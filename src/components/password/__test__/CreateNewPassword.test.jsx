import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect } from "vitest";
import CreateNewPassword from "../CreateNewPassword";

const setup = () => {
  const user = userEvent.setup();
  render(<CreateNewPassword />);
  return user;
};

describe("CreateNewPassword Component", () => {
  it("shows error when password does NOT meet requirements", async () => {
    const user = setup();

    const newPassInput = screen.getByPlaceholderText("New Password");
    const confirmPassInput = screen.getByPlaceholderText("Re-enter Password");
    const saveBtn = screen.getByRole("button", { name: /save/i });

    await user.type(newPassInput, "short");
    await user.type(confirmPassInput, "short");

    await user.click(saveBtn);

    expect(
      screen.getByText(
        /Password must be 8–64 characters and include at least 2 types/i
      )
    ).toBeInTheDocument();
  });

  it("shows error when passwords do NOT match", async () => {
    const user = setup();

    const newPassInput = screen.getByPlaceholderText("New Password");
    const confirmPassInput = screen.getByPlaceholderText("Re-enter Password");
    const saveBtn = screen.getByRole("button", { name: /save/i });

    await user.type(newPassInput, "ValidPass123!");
    await user.type(confirmPassInput, "Different123!");

    await user.click(saveBtn);

    expect(screen.getByText(/Passwords do not match/i)).toBeInTheDocument();
  });

  it("shows success message when password is valid and matches", async () => {
    const user = setup();

    const newPassInput = screen.getByPlaceholderText("New Password");
    const confirmPassInput = screen.getByPlaceholderText("Re-enter Password");
    const saveBtn = screen.getByRole("button", { name: /save/i });

    await user.type(newPassInput, "StrongPass123!");
    await user.type(confirmPassInput, "StrongPass123!");

    await user.click(saveBtn);

    expect(
      screen.getByText(/Password successfully updated/i)
    ).toBeInTheDocument();
  });
});

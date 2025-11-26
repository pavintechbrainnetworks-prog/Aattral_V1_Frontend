import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BrowserRouter } from "react-router-dom";
import { Signinpage } from "../Signinpage";
import "@testing-library/jest-dom";
import { describe, test, expect } from "vitest";

const renderWithRouter = (ui) => {
  return render(<BrowserRouter>{ui}</BrowserRouter>);
};

describe("Signinpage Component Tests", () => {

  test("renders sign in title", () => {
    renderWithRouter(<Signinpage />);
    const title = screen.getByRole("heading",{name:/sign in/i})
    expect(title).toBeInTheDocument();
  });

  test("shows error if email is empty", async () => {
    renderWithRouter(<Signinpage />);
    const user = userEvent.setup();

    const signInBtn = screen.getByRole("button", { name: /sign in/i });
    await user.click(signInBtn);

    expect(await screen.findByText("Email is required")).toBeInTheDocument();
  });

  test("shows invalid email error", async () => {
    renderWithRouter(<Signinpage />);
    const user = userEvent.setup();

    const emailInput = screen.getByPlaceholderText("Enter your email ID");
    await user.type(emailInput, "invalidemail");

    const signInBtn = screen.getByRole("button", { name: /sign in/i });
    await user.click(signInBtn);

    expect(
      await screen.findByText("Enter a valid email address")
    ).toBeInTheDocument();
  });

  test("shows password required error", async () => {
    renderWithRouter(<Signinpage />);
    const user = userEvent.setup();

    const signInBtn = screen.getByRole("button", { name: /sign in/i });
    await user.click(signInBtn);

    expect(await screen.findByText("Password is required")).toBeInTheDocument();
  });

  test("shows password min length error", async () => {
    renderWithRouter(<Signinpage />);
    const user = userEvent.setup();

    const passwordInput = screen.getByPlaceholderText("Enter your password");
    await user.type(passwordInput, "123");

    const signInBtn = screen.getByRole("button", { name: /sign in/i });
    await user.click(signInBtn);

    expect(
      await screen.findByText("Password must be at least 8 characters")
    ).toBeInTheDocument();
  });

  test("toggle text changes Sign up → Close", async () => {
    renderWithRouter(<Signinpage />);
    const user = userEvent.setup();

    const signUpLink = screen.getByText("Sign up");
    await user.click(signUpLink);

    expect(await screen.findByText("Close")).toBeInTheDocument();
  });

});

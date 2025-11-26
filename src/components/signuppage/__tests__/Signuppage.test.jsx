import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BrowserRouter } from "react-router-dom";
import "@testing-library/jest-dom";
import Signuppage from "../Signuppage";
import { describe,expect,test } from "vitest";
import { vi } from "vitest";

// Helper function to wrap component with Router
const renderWithRouter = (ui) => {
  return render(<BrowserRouter>{ui}</BrowserRouter>);
};

describe("Signuppage Component Tests", () => {
  test("renders signup heading correctly", () => {
    renderWithRouter(<Signuppage />);
     const title = screen.getByRole("heading",{name:/sign up/i})
    expect(title).toBeInTheDocument();
  });

  test("shows validation errors when empty submit is clicked", async () => {
    renderWithRouter(<Signuppage />);
    const user = userEvent.setup();

    const submitButton = screen.getByRole("button", { name: /sign up/i });
    await user.click(submitButton);

    expect(await screen.findByText("Name is required")).toBeInTheDocument();
    expect(screen.getByText("Email is required")).toBeInTheDocument();
    expect(screen.getByText("Phone number is required")).toBeInTheDocument();
    expect(screen.getByText("Password is required")).toBeInTheDocument();
    expect(screen.getByText("Confirm your password")).toBeInTheDocument();
  });

  test("shows error for invalid email", async () => {
    renderWithRouter(<Signuppage />);
    const user = userEvent.setup();

    const emailInput = screen.getByPlaceholderText("Enter your email ID");

    await user.type(emailInput, "invalidemail");

    const submitButton = screen.getByRole("button", { name: /sign up/i });
    await user.click(submitButton);

    expect(
      await screen.findByText("Enter a valid email address")
    ).toBeInTheDocument();
  });

  test("shows error for invalid phone number", async () => {
    renderWithRouter(<Signuppage />);
    const user = userEvent.setup();

    const phoneInput = screen.getByPlaceholderText("Enter your phone number");

    await user.type(phoneInput, "123");

    const submitButton = screen.getByRole("button", { name: /sign up/i });
    await user.click(submitButton);

    expect(
      await screen.findByText("Phone number must be 10 digits")
    ).toBeInTheDocument();
  });

  test("shows error for password mismatch", async () => {
    renderWithRouter(<Signuppage />);
    const user = userEvent.setup();

    await user.type(screen.getByPlaceholderText("Create password"), "123456");
    await user.type(screen.getByPlaceholderText("Confirm password"), "abcdef");

    const submitButton = screen.getByRole("button", { name: /sign up/i });
    await user.click(submitButton);

    expect(
      await screen.findByText("Passwords do not match")
    ).toBeInTheDocument();
  });

  test("accepts valid input and triggers success alert", async () => {
    renderWithRouter(<Signuppage />);
    const user = userEvent.setup();

    // Mock alert
    window.alert = vi.fn();


    await user.type(
      screen.getByPlaceholderText("Enter your full name"),
      "John Doe"
    );
    await user.type(
      screen.getByPlaceholderText("Enter your email ID"),
      "john@gmail.com"
    );
    await user.type(
      screen.getByPlaceholderText("Enter your phone number"),
      "9876543210"
    );
    await user.type(screen.getByPlaceholderText("Create password"), "123456");
    await user.type(
      screen.getByPlaceholderText("Confirm password"),
      "123456"
    );

    const submitButton = screen.getByRole("button", { name: /sign up/i });
    await user.click(submitButton);

    expect(window.alert).toHaveBeenCalledWith("Signup Successful!");
  });
});

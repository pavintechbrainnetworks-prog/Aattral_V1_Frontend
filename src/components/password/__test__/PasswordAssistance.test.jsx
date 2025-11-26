import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import PasswordAssistance from "../PasswordAssistance"; // adjust path if needed
import "@testing-library/jest-dom";
import { describe, test, expect,beforeAll} from "vitest";
import { vi } from "vitest";

// Mock window.alert
beforeAll(() => {
  window.alert = vi.fn();
});

describe("PasswordAssistance Component", () => {
  test("renders email and OTP inputs and buttons", () => {
    render(<PasswordAssistance />);

    expect(screen.getByPlaceholderText(/Enter your email ID/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/OTP/i)).toBeInTheDocument();
    expect(screen.getByText(/Resend OTP\?/i)).toBeInTheDocument();
    expect(screen.getByText(/Submit/i)).toBeInTheDocument();
  });

  test("shows error if email or OTP is empty on submit", async () => {
    render(<PasswordAssistance />);
    const submitButton = screen.getByText(/Submit/i);

    fireEvent.click(submitButton);

    expect(await screen.findByText(/Email is required/i)).toBeInTheDocument();
    expect(await screen.findByText(/OTP is required/i)).toBeInTheDocument();
  });

  test("validates email format", async () => {
    render(<PasswordAssistance />);
    const emailInput = screen.getByPlaceholderText(/Enter your email ID/i);
    const otpInput = screen.getByPlaceholderText(/OTP/i);
    const submitButton = screen.getByText(/Submit/i);

    await userEvent.type(emailInput, "invalidemail");
    await userEvent.type(otpInput, "123456");
    fireEvent.click(submitButton);

    expect(await screen.findByText(/Enter a valid email address/i)).toBeInTheDocument();
  });

  test("validates OTP format", async () => {
    render(<PasswordAssistance />);
    const emailInput = screen.getByPlaceholderText(/Enter your email ID/i);
    const otpInput = screen.getByPlaceholderText(/OTP/i);
    const submitButton = screen.getByText(/Submit/i);

    await userEvent.type(emailInput, "test@example.com");
    await userEvent.type(otpInput, "123");
    fireEvent.click(submitButton);

    expect(await screen.findByText(/OTP must be 6 digits/i)).toBeInTheDocument();
  });

  test("submits correctly with valid email and OTP", async () => {
    render(<PasswordAssistance />);
    const emailInput = screen.getByPlaceholderText(/Enter your email ID/i);
    const otpInput = screen.getByPlaceholderText(/OTP/i);
    const submitButton = screen.getByText(/Submit/i);

    await userEvent.type(emailInput, "test@example.com");
    await userEvent.type(otpInput, "123456");
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith("OTP Verified Successfully!");
    });
  });

test("resend OTP button behavior", async () => {
  vi.useFakeTimers();

  render(<PasswordAssistance />);

  // trigger resend OTP action
  const resendBtn = screen.getByText(/resend otp/i);
  fireEvent.click(resendBtn);

  // advance timer to simulate countdown finishing
  vi.advanceTimersByTime(30000); // whatever your countdown is

  // assert button is active again
  expect(resendBtn).not.toBeDisabled();

  vi.useRealTimers(); // cleanup
}, 10000);   // <-- increase timeout if needed

  
});

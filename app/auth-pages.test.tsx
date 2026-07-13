import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Login from "@/app/login/page";
import Signup from "@/app/signup/page";
import Checkout from "@/app/checkout/page";

const push = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push }),
}));

vi.mock("@/lib/auth", () => ({
  signIn: vi.fn(),
  signUp: vi.fn(),
}));

import { signIn, signUp } from "@/lib/auth";

beforeEach(() => {
  vi.clearAllMocks();
});

describe("Login page", () => {
  it("renders email/password fields and a log-in action", () => {
    render(<Login />);
    expect(screen.getByRole("heading", { name: "Log in" })).toBeInTheDocument();
    expect(screen.getByPlaceholderText("you@example.com")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Log in" })).toBeInTheDocument();
  });

  it("signs in and redirects to / on success", async () => {
    vi.mocked(signIn).mockResolvedValue({} as never);
    const user = userEvent.setup();
    render(<Login />);

    await user.type(screen.getByPlaceholderText("you@example.com"), "jane@example.com");
    await user.type(screen.getByPlaceholderText("••••••••"), "password123");
    await user.click(screen.getByRole("button", { name: "Log in" }));

    await waitFor(() => {
      expect(signIn).toHaveBeenCalledWith("jane@example.com", "password123");
      expect(push).toHaveBeenCalledWith("/");
    });
  });

  it("shows an error message when sign-in fails", async () => {
    vi.mocked(signIn).mockRejectedValue(new Error("invalid credentials"));
    const user = userEvent.setup();
    render(<Login />);

    await user.type(screen.getByPlaceholderText("you@example.com"), "jane@example.com");
    await user.type(screen.getByPlaceholderText("••••••••"), "wrong");
    await user.click(screen.getByRole("button", { name: "Log in" }));

    expect(await screen.findByText("invalid credentials")).toBeInTheDocument();
    expect(push).not.toHaveBeenCalled();
  });
});

describe("Signup page", () => {
  it("renders name/email/password fields and a sign-up action", () => {
    render(<Signup />);
    expect(
      screen.getByRole("heading", { name: "Create your account" }),
    ).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Jane Investor")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Sign up" })).toBeInTheDocument();
  });

  it("signs up and redirects to / on success", async () => {
    vi.mocked(signUp).mockResolvedValue({} as never);
    const user = userEvent.setup();
    render(<Signup />);

    await user.type(screen.getByPlaceholderText("Jane Investor"), "Jane Investor");
    await user.type(screen.getByPlaceholderText("you@example.com"), "jane@example.com");
    await user.type(screen.getByPlaceholderText("••••••••"), "password123");
    await user.click(screen.getByRole("button", { name: "Sign up" }));

    await waitFor(() => {
      expect(signUp).toHaveBeenCalledWith("jane@example.com", "password123", "Jane Investor");
      expect(push).toHaveBeenCalledWith("/");
    });
  });

  it("shows an error message when sign-up fails", async () => {
    vi.mocked(signUp).mockRejectedValue(new Error("email already registered"));
    const user = userEvent.setup();
    render(<Signup />);

    await user.type(screen.getByPlaceholderText("Jane Investor"), "Jane Investor");
    await user.type(screen.getByPlaceholderText("you@example.com"), "jane@example.com");
    await user.type(screen.getByPlaceholderText("••••••••"), "password123");
    await user.click(screen.getByRole("button", { name: "Sign up" }));

    expect(await screen.findByText("email already registered")).toBeInTheDocument();
    expect(push).not.toHaveBeenCalled();
  });
});

describe("Checkout page", () => {
  it("renders a non-functional payment scaffold with a disabled Pay button", () => {
    render(<Checkout />);
    expect(
      screen.getByRole("heading", { name: "Checkout" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Pay" })).toBeDisabled();
  });
});

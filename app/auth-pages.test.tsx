import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import Login from "@/app/login/page";
import Signup from "@/app/signup/page";
import Checkout from "@/app/checkout/page";

describe("Login page", () => {
  it("renders email/password fields and a log-in action", () => {
    render(<Login />);
    expect(screen.getByRole("heading", { name: "Log in" })).toBeInTheDocument();
    expect(screen.getByPlaceholderText("you@example.com")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Log in" })).toBeInTheDocument();
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

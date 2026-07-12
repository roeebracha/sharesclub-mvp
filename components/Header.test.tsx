import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { Header } from "@/components/Header";

vi.mock("next/navigation", () => ({
  usePathname: () => "/",
}));

describe("Header", () => {
  it("renders the nav links", () => {
    render(<Header />);
    expect(screen.getByRole("link", { name: "Home" })).toHaveAttribute("href", "/");
    expect(screen.getByRole("link", { name: "Dashboard" })).toHaveAttribute(
      "href",
      "/dashboard",
    );
    expect(screen.getByRole("link", { name: "Log in" })).toHaveAttribute(
      "href",
      "/login",
    );
  });

  it("highlights the active route with a filled pill", () => {
    render(<Header />);
    expect(screen.getByRole("link", { name: "Home" })).toHaveClass("bg-primary");
    expect(screen.getByRole("link", { name: "Dashboard" })).not.toHaveClass(
      "bg-primary",
    );
  });
});

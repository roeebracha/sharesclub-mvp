import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { ThemeToggle } from "./ThemeToggle";
import { THEME_STORAGE_KEY } from "@/lib/theme";

function mockMatchMedia(matches: boolean) {
  window.matchMedia = ((query: string) => ({
    matches,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  })) as typeof window.matchMedia;
}

beforeEach(() => {
  localStorage.clear();
  document.documentElement.classList.remove("dark");
  mockMatchMedia(false);
});

describe("ThemeToggle", () => {
  it("resolves to day mode when OS prefers light and nothing is stored", async () => {
    render(<ThemeToggle />);
    expect(await screen.findByRole("button", { name: "Switch to night mode" })).toBeInTheDocument();
  });

  it("resolves to night mode when OS prefers dark and nothing is stored", async () => {
    mockMatchMedia(true);
    render(<ThemeToggle />);
    expect(await screen.findByRole("button", { name: "Switch to day mode" })).toBeInTheDocument();
  });

  it("prefers an explicit stored choice over OS preference", async () => {
    mockMatchMedia(true);
    localStorage.setItem(THEME_STORAGE_KEY, "light");
    render(<ThemeToggle />);
    expect(await screen.findByRole("button", { name: "Switch to night mode" })).toBeInTheDocument();
  });

  it("switches to dark on click, updates the DOM class and storage", async () => {
    render(<ThemeToggle />);
    const button = await screen.findByRole("button", { name: "Switch to night mode" });

    fireEvent.click(button);

    expect(document.documentElement.classList.contains("dark")).toBe(true);
    expect(localStorage.getItem(THEME_STORAGE_KEY)).toBe("dark");
    expect(screen.getByRole("button", { name: "Switch to day mode" })).toBeInTheDocument();
  });

  it("switches back to light on a second click, updates the DOM class and storage", async () => {
    render(<ThemeToggle />);
    const firstClick = await screen.findByRole("button", { name: "Switch to night mode" });
    fireEvent.click(firstClick);
    const secondClick = screen.getByRole("button", { name: "Switch to day mode" });

    fireEvent.click(secondClick);

    expect(document.documentElement.classList.contains("dark")).toBe(false);
    expect(localStorage.getItem(THEME_STORAGE_KEY)).toBe("light");
    expect(screen.getByRole("button", { name: "Switch to night mode" })).toBeInTheDocument();
  });
});

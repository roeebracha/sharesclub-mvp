import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { Header } from "@/components/Header";

const mockUsePathname = vi.fn(() => "/");

vi.mock("next/navigation", () => ({
  usePathname: () => mockUsePathname(),
  useRouter: () => ({ push: vi.fn() }),
}));

const mockGetSession = vi.fn();
const mockOnAuthStateChange = vi.fn();
const unsubscribe = vi.fn();

vi.mock("@/lib/supabase/client", () => ({
  createClient: () => ({
    auth: {
      getSession: mockGetSession,
      onAuthStateChange: mockOnAuthStateChange,
    },
  }),
}));

vi.mock("@/features/auth/data/auth", () => ({
  signOut: vi.fn(),
}));

beforeEach(() => {
  vi.clearAllMocks();
  mockUsePathname.mockReturnValue("/");
  mockOnAuthStateChange.mockReturnValue({ data: { subscription: { unsubscribe } } });
});

describe("Header", () => {
  it("renders logged-out nav: Home and Log in, no Dashboard", async () => {
    mockGetSession.mockResolvedValue({ data: { session: null } });
    render(<Header />);

    await waitFor(() => {
      expect(screen.getByRole("link", { name: "Log in" })).toHaveAttribute("href", "/login");
    });
    expect(screen.getByRole("link", { name: "Home" })).toHaveAttribute("href", "/");
    expect(screen.queryByRole("link", { name: "Dashboard" })).not.toBeInTheDocument();
  });

  it("renders logged-in nav: Home, Dashboard, and Log out", async () => {
    mockGetSession.mockResolvedValue({ data: { session: { user: { id: "u1" } } } });
    render(<Header />);

    await waitFor(() => {
      expect(screen.getByRole("link", { name: "Dashboard" })).toHaveAttribute(
        "href",
        "/dashboard",
      );
    });
    expect(screen.getByRole("button", { name: "Log out" })).toBeInTheDocument();
    expect(screen.queryByRole("link", { name: "Log in" })).not.toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Tiers" })).toHaveAttribute("href", "/tiers");
  });

  it("highlights the active route with a filled pill", async () => {
    mockGetSession.mockResolvedValue({ data: { session: null } });
    render(<Header />);
    await waitFor(() => {
      expect(screen.getByRole("link", { name: "Home" })).toHaveClass("bg-primary");
    });
  });

  it("renders nothing on the login page", () => {
    mockUsePathname.mockReturnValue("/login");
    mockGetSession.mockResolvedValue({ data: { session: null } });
    const { container } = render(<Header />);
    expect(container).toBeEmptyDOMElement();
  });

  it("renders nothing on the signup page", () => {
    mockUsePathname.mockReturnValue("/signup");
    mockGetSession.mockResolvedValue({ data: { session: null } });
    const { container } = render(<Header />);
    expect(container).toBeEmptyDOMElement();
  });
});

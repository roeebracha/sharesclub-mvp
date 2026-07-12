import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { ProgressBar } from "@/components/ui/ProgressBar";

describe("Button", () => {
  it("renders its label", () => {
    render(<Button>Save</Button>);
    expect(screen.getByRole("button", { name: "Save" })).toBeInTheDocument();
  });

  it("applies the primary variant class", () => {
    render(<Button variant="primary">Go</Button>);
    expect(screen.getByRole("button", { name: "Go" })).toHaveClass("bg-primary");
  });

  it("can be disabled", () => {
    render(<Button disabled>Nope</Button>);
    expect(screen.getByRole("button", { name: "Nope" })).toBeDisabled();
  });
});

describe("Input", () => {
  it("forwards value and placeholder", () => {
    render(<Input placeholder="%" defaultValue="5" />);
    const input = screen.getByPlaceholderText("%") as HTMLInputElement;
    expect(input.value).toBe("5");
  });
});

describe("Card", () => {
  it("renders children", () => {
    render(<Card>Panel</Card>);
    expect(screen.getByText("Panel")).toBeInTheDocument();
  });
});

describe("Badge", () => {
  it("renders success variant with the success color", () => {
    render(<Badge variant="success">Eligible</Badge>);
    expect(screen.getByText("Eligible")).toHaveClass("text-success");
  });
});

describe("ProgressBar", () => {
  it("clamps values above 1 to 100%", () => {
    render(<ProgressBar value={1.5} />);
    expect(screen.getByRole("progressbar")).toHaveAttribute("aria-valuenow", "100");
  });

  it("clamps negative values to 0%", () => {
    render(<ProgressBar value={-0.5} />);
    expect(screen.getByRole("progressbar")).toHaveAttribute("aria-valuenow", "0");
  });

  it("reports mid-range progress", () => {
    render(<ProgressBar value={0.42} />);
    expect(screen.getByRole("progressbar")).toHaveAttribute("aria-valuenow", "42");
  });

  it("renders a tick for each milestone", () => {
    render(<ProgressBar value={0.3} milestones={[0.5, 0.8]} />);
    const bar = screen.getByRole("progressbar");
    expect(bar.querySelectorAll("[aria-hidden]")).toHaveLength(2);
  });

  it("switches to the hot accent color at 80% or above", () => {
    render(<ProgressBar value={0.8} />);
    const fill = screen.getByRole("progressbar").firstElementChild;
    expect(fill).toHaveClass("bg-accent-hot");
  });

  it("keeps the regular accent color below 80%", () => {
    render(<ProgressBar value={0.79} />);
    const fill = screen.getByRole("progressbar").firstElementChild;
    expect(fill).toHaveClass("bg-accent");
    expect(fill).not.toHaveClass("bg-accent-hot");
  });
});

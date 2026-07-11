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
});

import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ImportForm } from "./ImportForm";

const importPortfolioMock = vi.fn();
vi.mock("@/features/portfolio-import/data/import-server", () => ({
  importPortfolio: (formData: FormData) => importPortfolioMock(formData),
}));

beforeEach(() => {
  vi.clearAllMocks();
});

describe("ImportForm", () => {
  it("lists the supported brokers and disables submit until one is picked", () => {
    render(<ImportForm />);
    expect(screen.getByRole("option", { name: "IBI Trade" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Import" })).toBeDisabled();
  });

  it("submits the chosen broker + file and shows the saved/skipped result", async () => {
    importPortfolioMock.mockResolvedValue({ saved: 3, skipped: 1, skippedReasons: ["missing security name"] });
    const user = userEvent.setup();
    render(<ImportForm />);

    await user.selectOptions(screen.getByRole("combobox"), "ibi");
    const file = new File(["x"], "data.xlsx");
    const fileInput = document.querySelector('input[type="file"]')!;
    fireEvent.change(fileInput, { target: { files: [file] } });
    await user.click(screen.getByRole("button", { name: "Import" }));

    await waitFor(() => {
      expect(screen.getByText(/Saved 3 holdings — skipped 1 row\./)).toBeInTheDocument();
    });
    expect(importPortfolioMock).toHaveBeenCalledTimes(1);
  });

  it("shows the error message when the import fails", async () => {
    importPortfolioMock.mockRejectedValue(new Error("Not signed in."));
    const user = userEvent.setup();
    render(<ImportForm />);

    await user.selectOptions(screen.getByRole("combobox"), "ibi");
    const file = new File(["x"], "data.xlsx");
    const fileInput = document.querySelector('input[type="file"]')!;
    fireEvent.change(fileInput, { target: { files: [file] } });
    await user.click(screen.getByRole("button", { name: "Import" }));

    expect(await screen.findByText("Not signed in.")).toBeInTheDocument();
  });
});

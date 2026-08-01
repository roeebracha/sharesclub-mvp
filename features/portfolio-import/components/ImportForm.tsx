"use client";

import { useRef, useState } from "react";
import { BROKER_ADAPTERS } from "@/features/portfolio-import/parsers/registry";
import { importPortfolio, type ImportResult } from "@/features/portfolio-import/data/import-server";
import { Button } from "@/components/ui/Button";

export function ImportForm() {
  const [brokerId, setBrokerId] = useState("");
  const [pending, setPending] = useState(false);
  const [result, setResult] = useState<ImportResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setResult(null);
    setPending(true);
    try {
      const formData = new FormData(e.currentTarget);
      const imported = await importPortfolio(formData);
      setResult(imported);
      formRef.current?.reset();
      setBrokerId("");
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setPending(false);
    }
  }

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit}
      noValidate
      className="flex flex-wrap items-center gap-3"
    >
      <select
        name="brokerId"
        value={brokerId}
        onChange={(e) => setBrokerId(e.target.value)}
        required
        className="rounded-lg border border-black/10 dark:border-white/15 bg-transparent px-3 py-2 text-sm"
      >
        <option value="">Select your broker</option>
        {BROKER_ADAPTERS.map((adapter) => (
          <option key={adapter.id} value={adapter.id}>
            {adapter.label}
          </option>
        ))}
      </select>
      <input
        type="file"
        name="file"
        accept=".xlsx,.xls,.csv"
        required
        className="text-sm"
      />
      <Button type="submit" variant="primary" disabled={pending || !brokerId}>
        {pending ? "Importing…" : "Import"}
      </Button>

      {error && <p className="w-full text-sm text-danger">{error}</p>}
      {result && (
        <p className="w-full text-sm text-foreground/70">
          Saved {result.saved} holding{result.saved === 1 ? "" : "s"}
          {result.skipped > 0 && ` — skipped ${result.skipped} row${result.skipped === 1 ? "" : "s"}`}.
        </p>
      )}
    </form>
  );
}

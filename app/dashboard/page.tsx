"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { companies, type Holding } from "@/lib/dummy-data";
import {
  addHolding,
  deleteHolding,
  getHoldings,
  getPortfolioWorth,
  setPortfolioWorth as savePortfolioWorth,
  updateHolding,
} from "@/lib/holdings-data";

export default function DashboardPage() {
  const [holdings, setHoldings] = useState<Holding[]>([]);
  const [portfolioWorth, setPortfolioWorthState] = useState(0);
  const [portfolioInput, setPortfolioInput] = useState("");
  const [newCompanyId, setNewCompanyId] = useState("");
  const [newPercentage, setNewPercentage] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingValue, setEditingValue] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getHoldings().then(setHoldings);
    getPortfolioWorth().then((value) => {
      setPortfolioWorthState(value);
      setPortfolioInput(String(value));
    });
  }, []);

  const totalPercentage = holdings.reduce((sum, h) => sum + h.percentage, 0);
  const heldCompanyIds = new Set(holdings.map((h) => h.companyId));
  const availableCompanies = companies.filter((c) => !heldCompanyIds.has(c.id));

  async function handleSavePortfolio(e: React.FormEvent) {
    e.preventDefault();
    const value = Number(portfolioInput);
    if (Number.isNaN(value) || value < 0) {
      setError("Portfolio worth must be a positive number.");
      return;
    }
    const updated = await savePortfolioWorth(value);
    setPortfolioWorthState(updated);
    setError(null);
  }

  async function handleAddHolding(e: React.FormEvent) {
    e.preventDefault();
    const percentage = Number(newPercentage);
    if (!newCompanyId || Number.isNaN(percentage) || percentage <= 0) {
      setError("Pick a company and a percentage greater than 0.");
      return;
    }
    try {
      const updated = await addHolding(newCompanyId, percentage);
      setHoldings(updated);
      setNewCompanyId("");
      setNewPercentage("");
      setError(null);
    } catch (err) {
      setError((err as Error).message);
    }
  }

  function startEditing(holding: Holding) {
    setEditingId(holding.companyId);
    setEditingValue(String(holding.percentage));
    setError(null);
  }

  async function handleSaveEdit(companyId: string) {
    const percentage = Number(editingValue);
    if (Number.isNaN(percentage) || percentage <= 0) {
      setError("Percentage must be a positive number.");
      return;
    }
    try {
      const updated = await updateHolding(companyId, percentage);
      setHoldings(updated);
      setEditingId(null);
      setError(null);
    } catch (err) {
      setError((err as Error).message);
    }
  }

  async function handleDelete(companyId: string) {
    const updated = await deleteHolding(companyId);
    setHoldings(updated);
  }

  return (
    <div className="min-h-screen px-6 py-16 sm:px-12 sm:py-24 max-w-3xl mx-auto">
      <header className="mb-12 flex items-start justify-between">
        <div>
          <p className="text-sm font-[family-name:var(--font-geist-mono)] text-foreground/60">
            ShareClub
          </p>
          <h1 className="mt-3 text-3xl sm:text-4xl font-semibold tracking-tight">
            Your dashboard
          </h1>
        </div>
        <Link
          href="/"
          className="text-sm text-foreground/60 underline underline-offset-4 hover:text-foreground"
        >
          Benefits feed
        </Link>
      </header>

      {error && (
        <p className="mb-6 text-sm text-red-600 dark:text-red-400">{error}</p>
      )}

      <section className="mb-12">
        <h2 className="text-sm font-medium text-foreground/60 mb-4 uppercase tracking-wide">
          Portfolio worth
        </h2>
        <form onSubmit={handleSavePortfolio} className="flex items-center gap-3">
          <span className="text-foreground/60">$</span>
          <input
            type="number"
            min="0"
            value={portfolioInput}
            onChange={(e) => setPortfolioInput(e.target.value)}
            className="w-40 rounded-lg border border-black/10 dark:border-white/15 bg-transparent px-3 py-2 text-sm"
          />
          <button
            type="submit"
            className="rounded-lg border border-black/10 dark:border-white/15 px-3 py-2 text-sm hover:bg-black/5 dark:hover:bg-white/10"
          >
            Save
          </button>
        </form>
        <p className="mt-2 text-xs text-foreground/50">
          Currently saved: ${portfolioWorth}
        </p>
      </section>

      <section className="mb-12">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-sm font-medium text-foreground/60 uppercase tracking-wide">
            Your holdings
          </h2>
          <span
            className={`text-xs ${
              totalPercentage > 100 ? "text-red-600 dark:text-red-400" : "text-foreground/50"
            }`}
          >
            {totalPercentage}% of 100% allocated
          </span>
        </div>

        <div className="grid gap-3">
          {holdings.map((holding) => {
            const company = companies.find((c) => c.id === holding.companyId)!;
            const isEditing = editingId === holding.companyId;
            return (
              <div
                key={holding.companyId}
                className="flex items-center justify-between gap-4 rounded-xl border border-black/10 dark:border-white/15 p-4"
              >
                <span className="text-sm font-medium">
                  {company.name}{" "}
                  <span className="text-foreground/50">· {company.ticker}</span>
                </span>

                {isEditing ? (
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={editingValue}
                      onChange={(e) => setEditingValue(e.target.value)}
                      className="w-20 rounded-lg border border-black/10 dark:border-white/15 bg-transparent px-2 py-1 text-sm"
                    />
                    <button
                      onClick={() => handleSaveEdit(holding.companyId)}
                      className="text-xs underline underline-offset-4"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setEditingId(null)}
                      className="text-xs text-foreground/50 underline underline-offset-4"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-3">
                    <span className="text-sm">{holding.percentage}%</span>
                    <button
                      onClick={() => startEditing(holding)}
                      className="text-xs underline underline-offset-4"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(holding.companyId)}
                      className="text-xs text-red-600 dark:text-red-400 underline underline-offset-4"
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>
            );
          })}
          {holdings.length === 0 && (
            <p className="text-sm text-foreground/50">No holdings yet — add one below.</p>
          )}
        </div>
      </section>

      <section>
        <h2 className="text-sm font-medium text-foreground/60 mb-4 uppercase tracking-wide">
          Add a holding
        </h2>
        <form onSubmit={handleAddHolding} className="flex flex-wrap items-center gap-3">
          <select
            value={newCompanyId}
            onChange={(e) => setNewCompanyId(e.target.value)}
            className="rounded-lg border border-black/10 dark:border-white/15 bg-transparent px-3 py-2 text-sm"
          >
            <option value="">Select a company</option>
            {availableCompanies.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name} · {c.ticker}
              </option>
            ))}
          </select>
          <input
            type="number"
            min="0"
            max="100"
            placeholder="%"
            value={newPercentage}
            onChange={(e) => setNewPercentage(e.target.value)}
            className="w-24 rounded-lg border border-black/10 dark:border-white/15 bg-transparent px-3 py-2 text-sm"
          />
          <button
            type="submit"
            disabled={availableCompanies.length === 0}
            className="rounded-lg border border-black/10 dark:border-white/15 px-3 py-2 text-sm hover:bg-black/5 dark:hover:bg-white/10 disabled:opacity-40"
          >
            Add
          </button>
        </form>
      </section>
    </div>
  );
}

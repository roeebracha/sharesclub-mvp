"use client";

import { useEffect, useState } from "react";
import type { Company, Holding } from "@/lib/domain/eligibility";
import { getCompanies } from "@/features/benefits/data/catalog-client";
import {
  addHolding,
  deleteHolding,
  getHoldings,
  getPortfolioWorth,
  setPortfolioWorth as savePortfolioWorth,
  updateHolding,
} from "@/features/portfolio/data/holdings";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";

export default function DashboardPage() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [holdings, setHoldings] = useState<Holding[]>([]);
  const [portfolioWorth, setPortfolioWorthState] = useState(0);
  const [portfolioInput, setPortfolioInput] = useState("");
  const [newCompanyId, setNewCompanyId] = useState("");
  const [newPercentage, setNewPercentage] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingValue, setEditingValue] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getCompanies()
      .then(setCompanies)
      .catch((err) => setError((err as Error).message));
    getHoldings()
      .then(setHoldings)
      .catch((err) => setError((err as Error).message));
    getPortfolioWorth()
      .then((value) => {
        setPortfolioWorthState(value);
        setPortfolioInput(String(value));
      })
      .catch((err) => setError((err as Error).message));
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
      <header className="mb-12">
        <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight">
          Your dashboard
        </h1>
        <p className="mt-3 text-foreground/70">
          Enter your portfolio worth and holdings to see which perks you unlock.
        </p>
      </header>

      {error && <p className="mb-6 text-sm text-danger">{error}</p>}

      <section className="mb-12">
        <h2 className="text-sm font-medium text-foreground/60 mb-4 uppercase tracking-wide">
          Portfolio worth
        </h2>
        <form onSubmit={handleSavePortfolio} className="flex items-center gap-3">
          <span className="text-foreground/60">$</span>
          <Input
            type="number"
            min="0"
            value={portfolioInput}
            onChange={(e) => setPortfolioInput(e.target.value)}
            className="w-40"
          />
          <Button type="submit" variant="primary">
            Save
          </Button>
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
              totalPercentage > 100 ? "text-danger" : "text-foreground/50"
            }`}
          >
            {totalPercentage}% of 100% allocated
          </span>
        </div>

        <div className="grid gap-3">
          {holdings.map((holding) => {
            const company = companies.find((c) => c.id === holding.companyId);
            // Manual add/edit is company-based — a file-imported, unmatched holding (companyId
            // null) has nothing to edit here and isn't shown in this list.
            if (!company) return null;
            const isEditing = editingId === company.id;
            return (
              <Card
                key={company.id}
                className="flex flex-wrap items-center justify-between gap-4 p-4"
              >
                <span className="text-sm font-medium">
                  {company.name}{" "}
                  <span className="text-foreground/50">· {company.ticker}</span>
                </span>

                {isEditing ? (
                  <div className="flex flex-wrap items-center gap-2">
                    <Input
                      type="number"
                      min="0"
                      max="100"
                      value={editingValue}
                      onChange={(e) => setEditingValue(e.target.value)}
                      className="w-20 px-2 py-1"
                    />
                    <button
                      onClick={() => handleSaveEdit(company.id)}
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
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="text-sm">{holding.percentage}%</span>
                    <button
                      onClick={() => startEditing(holding)}
                      className="text-xs underline underline-offset-4"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(company.id)}
                      className="text-xs text-danger underline underline-offset-4"
                    >
                      Delete
                    </button>
                  </div>
                )}
              </Card>
            );
          })}
          {holdings.length === 0 && (
            <p className="text-sm text-foreground/50">
              No holdings yet — add one below.
            </p>
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
          <Input
            type="number"
            min="0"
            max="100"
            placeholder="%"
            value={newPercentage}
            onChange={(e) => setNewPercentage(e.target.value)}
            className="w-24"
          />
          <Button
            type="submit"
            variant="primary"
            disabled={availableCompanies.length === 0}
          >
            Add
          </Button>
        </form>
      </section>
    </div>
  );
}

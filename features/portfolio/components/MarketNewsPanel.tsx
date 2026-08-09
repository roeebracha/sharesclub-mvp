"use client";

import { useEffect, useState } from "react";
import { getMarketNews, type MarketNewsFeed, type NewsItem } from "@/lib/market-news";

const FEEDS: { key: MarketNewsFeed; label: string }[] = [
  { key: "israel", label: "Israel" },
  { key: "global", label: "Global" },
];

function NewsList({ items }: { items: NewsItem[] }) {
  if (items.length === 0) {
    return <p className="text-sm text-foreground/50">No headlines right now.</p>;
  }

  return (
    <ul className="space-y-2">
      {items.map((item) => (
        <li key={item.link}>
          <a
            href={item.link}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-foreground/80 hover:text-primary"
          >
            {item.title}
          </a>
        </li>
      ))}
    </ul>
  );
}

export function MarketNewsPanel() {
  const [news, setNews] = useState<Record<MarketNewsFeed, NewsItem[]>>({
    israel: [],
    global: [],
  });

  useEffect(() => {
    FEEDS.forEach(({ key }) => {
      getMarketNews(key).then((items) => setNews((prev) => ({ ...prev, [key]: items })));
    });
  }, []);

  return (
    <div className="rounded-xl border border-black/10 p-4 dark:border-white/15">
      <h2 className="mb-3 text-sm font-medium text-foreground/60 uppercase tracking-wide">
        Market news
      </h2>
      <div className="grid gap-6 sm:grid-cols-2">
        {FEEDS.map(({ key, label }) => (
          <div key={key}>
            <h3 className="mb-2 text-xs font-semibold text-foreground/50 uppercase tracking-wide">
              {label}
            </h3>
            <NewsList items={news[key]} />
          </div>
        ))}
      </div>
    </div>
  );
}

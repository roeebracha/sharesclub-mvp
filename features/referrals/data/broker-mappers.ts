// Pure snake_case row -> camelCase domain object mapper for the brokers
// referral catalog. No Supabase import — mirrors
// features/benefits/data/catalog-mappers.ts.

export type Broker = {
  id: string;
  slug: string;
  name: string;
  logoUrl: string | null;
  referralUrl: string;
};

export type BrokerRow = {
  id: string;
  slug: string;
  name: string;
  logo_url: string | null;
  referral_url: string;
};

export function mapBrokerRow(row: BrokerRow): Broker {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    logoUrl: row.logo_url,
    referralUrl: row.referral_url,
  };
}

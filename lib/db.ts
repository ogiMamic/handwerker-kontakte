// ============================================================
// NeonDB query executor - shared by server actions
// SEO queries moved to lib/handwerker-dynamic/db.ts
// ============================================================
import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL!);

export async function executeQuery(query: string, params: any[] = []): Promise<any[]> {
  return sql(query, params) as Promise<any[]>;
}

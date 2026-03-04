# Convergence Futuring Platform - Environment Variables

## Required Environment Variables

### Supabase (Required)
```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### Anthropic Claude API (Required for AI Analysis)
```
ANTHROPIC_API_KEY=sk-ant-api03-your-key-here
```

### Stripe (Optional - for payments)
```
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

## Demo/Test Configuration

For local development without a real Supabase backend, the app uses placeholder values that allow the UI to function:

- `NEXT_PUBLIC_SUPABASE_URL=https://placeholder.supabase.co`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY=placeholder`

## Setting Up

1. **Create a Supabase project:**
   - Go to https://supabase.com
   - Create a new project
   - Get URL and anon key from Settings > API

2. **Set up database tables:**
   Run the SQL from `supabase/schema.sql` in the Supabase SQL Editor

3. **Add your keys to `.env.local`:**
   ```
   NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   ANTHROPIC_API_KEY=your-claude-key
   ```

## Test Users

Create test users in Supabase Auth with these tiers:

| Email | Tier | Features |
|-------|------|----------|
| demo@convergence.app | Free | 3 scenarios, 1K iterations |
| pro@convergence.app | Pro | Unlimited, 100K iterations, data upload |
| enterprise@convergence.app | Enterprise | Everything + API access |

Profile table should have:
```sql
INSERT INTO profiles (id, email, full_name, subscription_tier, subscription_status)
VALUES 
  (uuid, 'demo@convergence.app', 'Demo User', 'free', 'active'),
  (uuid, 'pro@convergence.app', 'Pro User', 'pro', 'active'),
  (uuid, 'enterprise@convergence.app', 'Enterprise User', 'enterprise', 'active');
```

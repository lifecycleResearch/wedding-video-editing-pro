-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- PROFILES (updated for tiered subscriptions)
-- ============================================
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  full_name VARCHAR(255),
  avatar_url TEXT,
  plan VARCHAR(50) DEFAULT 'starter',
  stripe_customer_id VARCHAR(255),
  subscription_id VARCHAR(255),
  subscription_status VARCHAR(50) DEFAULT 'inactive',
  product_slug VARCHAR(100),
  queries_used INT DEFAULT 0,
  queries_limit INT DEFAULT 1000,
  alerts_used INT DEFAULT 0,
  alerts_limit INT DEFAULT 50,
  onboarded BOOLEAN DEFAULT FALSE,
  alert_channels JSONB DEFAULT '{"email": true, "sms": false, "webhook": false}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles(email);
CREATE INDEX IF NOT EXISTS idx_profiles_stripe_customer ON profiles(stripe_customer_id);
CREATE INDEX IF NOT EXISTS idx_profiles_product ON profiles(product_slug);

-- Plan limits configuration
-- starter: 1,000 queries, 50 alerts, email only
-- pro: 10,000 queries, 500 alerts, email + SMS + webhook
-- enterprise: unlimited queries, unlimited alerts, all channels + API + agents

-- ============================================
-- INCIDENTS (core data - the "records" users pay to access)
-- ============================================
CREATE TABLE IF NOT EXISTS incidents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_slug VARCHAR(100) NOT NULL,
  title VARCHAR(500) NOT NULL,
  description TEXT,
  source VARCHAR(255) NOT NULL,
  source_url TEXT,
  category VARCHAR(100),
  severity VARCHAR(20) DEFAULT 'info' CHECK (severity IN ('info', 'warning', 'critical', 'urgent')),
  metadata JSONB DEFAULT '{}',
  occurred_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_incidents_product ON incidents(product_slug);
CREATE INDEX IF NOT EXISTS idx_incidents_created ON incidents(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_incidents_severity ON incidents(severity);
CREATE INDEX IF NOT EXISTS idx_incidents_category ON incidents(category);

-- ============================================
-- ALERTS (user-specific notifications about incidents)
-- ============================================
CREATE TABLE IF NOT EXISTS alerts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  incident_id UUID REFERENCES incidents(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  category VARCHAR(100),
  severity VARCHAR(20) DEFAULT 'info',
  read BOOLEAN DEFAULT FALSE,
  delivered_via JSONB DEFAULT '[]',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_alerts_profile ON alerts(profile_id);
CREATE INDEX IF NOT EXISTS idx_alerts_created ON alerts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_alerts_incident ON alerts(incident_id);

-- ============================================
-- USAGE LOGS (track feature usage per tier)
-- ============================================
CREATE TABLE IF NOT EXISTS usage_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  action VARCHAR(100) NOT NULL,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_usage_logs_profile ON usage_logs(profile_id);
CREATE INDEX IF NOT EXISTS idx_usage_logs_created ON usage_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_usage_logs_action ON usage_logs(action);

-- ============================================
-- MONITORING SOURCES (where data comes from per product)
-- ============================================
CREATE TABLE IF NOT EXISTS monitoring_sources (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_slug VARCHAR(100) NOT NULL,
  name VARCHAR(255) NOT NULL,
  url TEXT NOT NULL,
  source_type VARCHAR(50) DEFAULT 'rss' CHECK (source_type IN ('rss', 'api', 'web_scraper', 'email_parser', 'database')),
  category VARCHAR(100),
  check_interval_minutes INT DEFAULT 60,
  last_checked_at TIMESTAMP WITH TIME ZONE,
  status VARCHAR(20) DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_monitoring_sources_product ON monitoring_sources(product_slug);

-- ============================================
-- WEBHOOK CONFIGS (per-user webhook endpoints)
-- ============================================
CREATE TABLE IF NOT EXISTS webhook_configs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  url TEXT NOT NULL,
  events JSONB DEFAULT '["incident.created", "alert.triggered"]',
  secret VARCHAR(255),
  active BOOLEAN DEFAULT TRUE,
  last_triggered_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_webhook_configs_profile ON webhook_configs(profile_id);

-- ============================================
-- AGENT CONFIGS (autonomous agent upsell)
-- ============================================
CREATE TABLE IF NOT EXISTS agent_configs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  agent_type VARCHAR(50) NOT NULL CHECK (agent_type IN ('monitor', 'analyzer', 'responder', 'reporter')),
  name VARCHAR(255) NOT NULL,
  config JSONB DEFAULT '{}',
  schedule VARCHAR(100) DEFAULT 'hourly',
  active BOOLEAN DEFAULT TRUE,
  last_run_at TIMESTAMP WITH TIME ZONE,
  run_count INT DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_agent_configs_profile ON agent_configs(profile_id);

-- ============================================
-- ROW LEVEL SECURITY
-- ============================================
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE usage_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE webhook_configs ENABLE ROW LEVEL SECURITY;
ALTER TABLE agent_configs ENABLE ROW LEVEL SECURITY;

-- Incidents are readable by all authenticated users (filtered by tier in app code)
ALTER TABLE incidents ENABLE ROW LEVEL SECURITY;
ALTER TABLE monitoring_sources ENABLE ROW LEVEL SECURITY;

-- Profiles: users can only see/update their own
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id) WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Incidents: all authenticated users can view, filtered by product_slug and tier
CREATE POLICY "Authenticated users can view incidents" ON incidents FOR SELECT USING (true);
CREATE POLICY "Service role can manage incidents" ON incidents FOR ALL USING (auth.role() = 'service_role');

-- Alerts: users can only see their own
CREATE POLICY "Users can view own alerts" ON alerts FOR SELECT USING (auth.uid() = profile_id);
CREATE POLICY "Users can update own alerts" ON alerts FOR UPDATE USING (auth.uid() = profile_id);
CREATE POLICY "Users can insert own alerts" ON alerts FOR INSERT WITH CHECK (auth.uid() = profile_id);
CREATE POLICY "Users can delete own alerts" ON alerts FOR DELETE USING (auth.uid() = profile_id);

-- Usage logs: users can only see their own
CREATE POLICY "Users can view own usage" ON usage_logs FOR SELECT USING (auth.uid() = profile_id);
CREATE POLICY "Users can insert own usage" ON usage_logs FOR INSERT WITH CHECK (auth.uid() = profile_id);

-- Monitoring sources: all authenticated users can view
CREATE POLICY "Authenticated users can view sources" ON monitoring_sources FOR SELECT USING (true);
CREATE POLICY "Service role can manage sources" ON monitoring_sources FOR ALL USING (auth.role() = 'service_role');

-- Webhook configs: users can only manage their own
CREATE POLICY "Users can manage own webhooks" ON webhook_configs FOR ALL USING (auth.uid() = profile_id);

-- Agent configs: users can only manage their own
CREATE POLICY "Users can manage own agents" ON agent_configs FOR ALL USING (auth.uid() = profile_id);

-- ============================================
-- AUTO-UPDATE UPDATED_AT
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================
-- HELPER: Get plan limits
-- ============================================
CREATE OR REPLACE FUNCTION get_plan_limits(plan VARCHAR)
RETURNS TABLE(queries_limit INT, alerts_limit INT, can_access_db BOOLEAN, can_api BOOLEAN, can_agent BOOLEAN) AS $$
BEGIN
  RETURN QUERY SELECT
    CASE plan
      WHEN 'starter' THEN 1000
      WHEN 'pro' THEN 10000
      WHEN 'enterprise' THEN 999999
      ELSE 1000
    END,
    CASE plan
      WHEN 'starter' THEN 50
      WHEN 'pro' THEN 500
      WHEN 'enterprise' THEN 999999
      ELSE 50
    END,
    CASE plan WHEN 'starter' THEN false ELSE true END,
    CASE plan WHEN 'enterprise' THEN true ELSE false END,
    CASE plan WHEN 'enterprise' THEN true ELSE false END;
END;
$$ LANGUAGE plpgsql;
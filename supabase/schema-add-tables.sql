-- Convergence Futuring Platform - Add Missing Tables
-- Run only the tables that don't exist

-- Projects table
CREATE TABLE IF NOT EXISTS projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  phase TEXT DEFAULT 'identify' CHECK (phase IN ('identify', 'analyze', 'predict', 'act')),
  data JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Scenarios table
CREATE TABLE IF NOT EXISTS scenarios (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  probability INTEGER DEFAULT 20,
  timeline TEXT DEFAULT '1-2 years',
  risk_score INTEGER DEFAULT 50,
  equity_impact TEXT DEFAULT 'medium' CHECK (equity_impact IN ('high', 'medium', 'low')),
  drivers JSONB DEFAULT '[]',
  indicators JSONB DEFAULT '[]',
  actions JSONB DEFAULT '[]',
  stakeholders JSONB DEFAULT '[]',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Simulations table
CREATE TABLE IF NOT EXISTS simulations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  question TEXT,
  base_value INTEGER,
  variables JSONB DEFAULT '[]',
  results JSONB,
  iterations INTEGER DEFAULT 10000,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Datasets table
CREATE TABLE IF NOT EXISTS datasets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  metric TEXT,
  data JSONB NOT NULL,
  data_type TEXT DEFAULT 'timeseries',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Stakeholders table
CREATE TABLE IF NOT EXISTS stakeholders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  group_name TEXT,
  power TEXT DEFAULT 'medium' CHECK (power IN ('high', 'medium', 'low')),
  interest TEXT DEFAULT 'medium' CHECK (interest IN ('high', 'medium', 'low')),
  concerns JSONB DEFAULT '[]',
  support_level TEXT DEFAULT 'medium',
  resistance_level TEXT DEFAULT 'low',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Future wheels table
CREATE TABLE IF NOT EXISTS future_wheels (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  center_trend TEXT NOT NULL,
  context TEXT,
  first_order JSONB DEFAULT '[]',
  second_order JSONB DEFAULT '[]',
  third_order JSONB DEFAULT '[]',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Cross-impacts table
CREATE TABLE IF NOT EXISTS cross_impacts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  forces JSONB DEFAULT '[]',
  impacts JSONB DEFAULT '[]',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE scenarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE simulations ENABLE ROW LEVEL SECURITY;
ALTER TABLE datasets ENABLE ROW LEVEL SECURITY;
ALTER TABLE stakeholders ENABLE ROW LEVEL SECURITY;
ALTER TABLE future_wheels ENABLE ROW LEVEL SECURITY;
ALTER TABLE cross_impacts ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view own projects" ON projects FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create projects" ON projects FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own projects" ON projects FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own projects" ON projects FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can manage scenarios" ON scenarios FOR ALL USING (
  EXISTS (SELECT 1 FROM projects WHERE projects.id = scenarios.project_id AND projects.user_id = auth.uid())
);

CREATE POLICY "Users can manage simulations" ON simulations FOR ALL USING (
  EXISTS (SELECT 1 FROM projects WHERE projects.id = simulations.project_id AND projects.user_id = auth.uid())
);

CREATE POLICY "Users can manage datasets" ON datasets FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage stakeholders" ON stakeholders FOR ALL USING (
  EXISTS (SELECT 1 FROM projects WHERE projects.id = stakeholders.project_id AND projects.user_id = auth.uid())
);

CREATE POLICY "Users can manage future_wheels" ON future_wheels FOR ALL USING (
  EXISTS (SELECT 1 FROM projects WHERE projects.id = future_wheels.project_id AND projects.user_id = auth.uid())
);

CREATE POLICY "Users can manage cross_impacts" ON cross_impacts FOR ALL USING (
  EXISTS (SELECT 1 FROM projects WHERE projects.id = cross_impacts.project_id AND projects.user_id = auth.uid())
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_projects_user_id ON projects(user_id);
CREATE INDEX IF NOT EXISTS idx_projects_updated ON projects(updated_at DESC);
CREATE INDEX IF NOT EXISTS idx_datasets_user_id ON datasets(user_id);

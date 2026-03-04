-- Convergence Futuring Platform Database Schema

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Profiles table (extends Supabase auth.users)
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  full_name TEXT,
  avatar_url TEXT,
  subscription_tier TEXT DEFAULT 'free' CHECK (subscription_tier IN ('free', 'pro', 'enterprise')),
  subscription_status TEXT DEFAULT 'active' CHECK (subscription_status IN ('active', 'cancelled', 'past_due')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Projects table
CREATE TABLE projects (
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
CREATE TABLE scenarios (
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
  stakeholders JSONB DEFAULT '[] TIMESTAMP WITH TIME',
  created_at ZONE DEFAULT NOW()
);

-- Simulations table
CREATE TABLE simulations (
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

-- Datasets table (uploaded district data)
CREATE TABLE datasets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  metric TEXT,
  data JSONB NOT NULL,
  data_type TEXT DEFAULT 'timeseries',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Stakeholders table
CREATE TABLE stakeholders (
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
CREATE TABLE future_wheels (
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
CREATE TABLE cross_impacts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  forces JSONB DEFAULT '[]',
  impacts JSONB DEFAULT '[]',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS Policies (Row Level Security)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE scenarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE simulations ENABLE ROW LEVEL SECURITY;
ALTER TABLE datasets ENABLE ROW LEVEL SECURITY;
ALTER TABLE stakeholders ENABLE ROW LEVEL SECURITY;
ALTER TABLE future_wheels ENABLE ROW LEVEL SECURITY;
ALTER TABLE cross_impacts ENABLE ROW LEVEL SECURITY;

-- Profile policies
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Projects policies
CREATE POLICY "Users can view own projects" ON projects FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create projects" ON projects FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own projects" ON projects FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own projects" ON projects FOR DELETE USING (auth.uid() = user_id);

-- Scenarios policies
CREATE POLICY "Users can view own scenarios" ON scenarios FOR SELECT USING (
  EXISTS (SELECT 1 FROM projects WHERE projects.id = scenarios.project_id AND projects.user_id = auth.uid())
);
CREATE POLICY "Users can manage own scenarios" ON scenarios FOR ALL USING (
  EXISTS (SELECT 1 FROM projects WHERE projects.id = scenarios.project_id AND projects.user_id = auth.uid())
);

-- Simulations policies
CREATE POLICY "Users can view own simulations" ON simulations FOR SELECT USING (
  EXISTS (SELECT 1 FROM projects WHERE projects.id = simulations.project_id AND projects.user_id = auth.uid())
);
CREATE POLICY "Users can manage own simulations" ON simulations FOR ALL USING (
  EXISTS (SELECT 1 FROM projects WHERE projects.id = simulations.project_id AND projects.user_id = auth.uid())
);

-- Datasets policies
CREATE POLICY "Users can view own datasets" ON datasets FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own datasets" ON datasets FOR ALL USING (auth.uid() = user_id);

-- Stakeholders policies
CREATE POLICY "Users can view own stakeholders" ON stakeholders FOR SELECT USING (
  EXISTS (SELECT 1 FROM projects WHERE projects.id = stakeholders.project_id AND projects.user_id = auth.uid())
);
CREATE POLICY "Users can manage own stakeholders" ON stakeholders FOR ALL USING (
  EXISTS (SELECT 1 FROM projects WHERE projects.id = stakeholders.project_id AND projects.user_id = auth.uid())
);

-- Function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, subscription_tier, subscription_status)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name',
    'free',
    'active'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Indexes for performance
CREATE INDEX idx_projects_user_id ON projects(user_id);
CREATE INDEX idx_projects_updated ON projects(updated_at DESC);
CREATE INDEX idx_scenarios_project_id ON scenarios(project_id);
CREATE INDEX idx_simulations_project_id ON simulations(project_id);
CREATE INDEX idx_datasets_user_id ON datasets(user_id);

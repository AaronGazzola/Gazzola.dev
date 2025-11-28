-- Enable Row Level Security on all tables

ALTER TABLE public.Post ENABLE ROW LEVEL SECURITY;

-- Create RLS Policies

-- Policies for public.Post
CREATE POLICY "Post_select_user"
  ON public.Post
  FOR SELECT
  TO user
  USING ((SELECT id FROM better_auth.user WHERE id = userId) IS NOT NULL);

CREATE POLICY "Post_select_admin"
  ON public.Post
  FOR SELECT
  TO admin
  USING (true);

-- Create database roles for Better Auth

CREATE ROLE user;
CREATE ROLE admin;
CREATE ROLE super_admin;
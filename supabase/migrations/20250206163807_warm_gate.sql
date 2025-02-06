/*
  # Initial Schema Setup

  1. New Tables
    - `profiles`
      - `id` (uuid, matches auth.users)
      - `username` (text)
      - `avatar_url` (text)
      - `created_at` (timestamp)
    - `startups`
      - `id` (uuid)
      - `name` (text)
      - `description` (text)
      - `logo_url` (text)
      - `website` (text)
      - `launch_date` (timestamp)
      - `user_id` (uuid, references profiles)
      - `created_at` (timestamp)
    - `upvotes`
      - `id` (uuid)
      - `startup_id` (uuid, references startups)
      - `user_id` (uuid, references profiles)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated access
*/

-- Create profiles table
CREATE TABLE profiles (
  id uuid PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  username text UNIQUE NOT NULL,
  avatar_url text,
  created_at timestamptz DEFAULT now()
);

-- Create startups table
CREATE TABLE startups (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text NOT NULL,
  logo_url text NOT NULL,
  website text NOT NULL,
  launch_date timestamptz NOT NULL,
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create upvotes table with unique constraint to prevent multiple upvotes
CREATE TABLE upvotes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  startup_id uuid REFERENCES startups(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(startup_id, user_id)
);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE startups ENABLE ROW LEVEL SECURITY;
ALTER TABLE upvotes ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Public profiles are viewable by everyone"
  ON profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- Startups policies
CREATE POLICY "Startups are viewable by everyone"
  ON startups FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can create startups"
  ON startups FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own startups"
  ON startups FOR UPDATE
  USING (auth.uid() = user_id);

-- Upvotes policies
CREATE POLICY "Upvotes are viewable by everyone"
  ON upvotes FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can upvote"
  ON upvotes FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Create functions
CREATE OR REPLACE FUNCTION get_startup_upvotes(startup_id uuid)
RETURNS bigint
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
  SELECT COUNT(*)
  FROM upvotes
  WHERE upvotes.startup_id = $1;
$$;
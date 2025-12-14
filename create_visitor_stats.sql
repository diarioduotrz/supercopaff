-- Create table for site statistics
CREATE TABLE IF NOT EXISTS site_stats (
    id text PRIMARY KEY DEFAULT 'main',
    visits integer DEFAULT 0,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now())
);

-- Enable RLS
ALTER TABLE site_stats ENABLE ROW LEVEL SECURITY;

-- Create function to increment visits atomically
CREATE OR REPLACE FUNCTION increment_visits()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    INSERT INTO site_stats (id, visits)
    VALUES ('main', 1)
    ON CONFLICT (id)
    DO UPDATE SET 
        visits = site_stats.visits + 1,
        updated_at = now();
END;
$$;

-- Grant permissions
GRANT EXECUTE ON FUNCTION increment_visits() TO anon;
GRANT EXECUTE ON FUNCTION increment_visits() TO authenticated;
GRANT EXECUTE ON FUNCTION increment_visits() TO service_role;

GRANT SELECT ON site_stats TO anon;
GRANT SELECT ON site_stats TO authenticated;
GRANT SELECT ON site_stats TO service_role;

-- Create policy for reading
CREATE POLICY "Allow public read access" ON site_stats FOR SELECT USING (true);

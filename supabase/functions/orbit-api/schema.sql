
-- Function to increment runs count safely
CREATE OR REPLACE FUNCTION public.increment_runs(automation_id uuid)
RETURNS integer AS $$
DECLARE
  current_count integer;
BEGIN
  SELECT COALESCE(runs_today, 0) INTO current_count 
  FROM public.automations 
  WHERE id = automation_id;
  
  RETURN current_count + 1;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to increment failures count safely
CREATE OR REPLACE FUNCTION public.increment_failures(automation_id uuid)
RETURNS integer AS $$
DECLARE
  current_count integer;
BEGIN
  SELECT COALESCE(failed_runs, 0) INTO current_count 
  FROM public.automations 
  WHERE id = automation_id;
  
  RETURN current_count + 1;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

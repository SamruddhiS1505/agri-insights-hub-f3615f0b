-- Create profiles table linked to auth.users
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  farmer_id TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view their own profile"
ON public.profiles FOR SELECT
TO authenticated
USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
ON public.profiles FOR UPDATE
TO authenticated
USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile"
ON public.profiles FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = id);

-- Function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, farmer_id)
  VALUES (
    NEW.id,
    NEW.email,
    'F' || SUBSTR(NEW.id::text, 1, 8)
  );
  RETURN NEW;
END;
$$;

-- Trigger for auto-creating profile on signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Update crop_data RLS policies - remove overly permissive policies
DROP POLICY IF EXISTS "Allow public read access " ON public.crop_data;
DROP POLICY IF EXISTS "Allow public insert access " ON public.crop_data;

-- Create secure RLS policies for crop_data
-- Users can only read their own data (linked via farmer_id in profiles)
CREATE POLICY "Users can read their own crop data"
ON public.crop_data FOR SELECT
TO authenticated
USING (
  farmer_id IN (
    SELECT p.farmer_id FROM public.profiles p WHERE p.id = auth.uid()
  )
);

-- Users can only insert their own data
CREATE POLICY "Users can insert their own crop data"
ON public.crop_data FOR INSERT
TO authenticated
WITH CHECK (
  farmer_id IN (
    SELECT p.farmer_id FROM public.profiles p WHERE p.id = auth.uid()
  )
);

-- Users can update their own data
CREATE POLICY "Users can update their own crop data"
ON public.crop_data FOR UPDATE
TO authenticated
USING (
  farmer_id IN (
    SELECT p.farmer_id FROM public.profiles p WHERE p.id = auth.uid()
  )
);

-- Users can delete their own data
CREATE POLICY "Users can delete their own crop data"
ON public.crop_data FOR DELETE
TO authenticated
USING (
  farmer_id IN (
    SELECT p.farmer_id FROM public.profiles p WHERE p.id = auth.uid()
  )
);
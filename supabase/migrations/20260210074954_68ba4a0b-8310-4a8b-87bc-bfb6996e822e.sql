-- Create function to auto-assign admin role for specific email
CREATE OR REPLACE FUNCTION public.handle_admin_assignment()
RETURNS TRIGGER AS $$
BEGIN
  -- Check if the user email is the admin email
  IF NEW.email = 'tujenganesaccoke@gmail.com' THEN
    -- Auto-approve the profile
    UPDATE public.profiles 
    SET status = 'approved' 
    WHERE user_id = NEW.id;
    
    -- Assign admin role
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.id, 'admin')
    ON CONFLICT (user_id, role) DO NOTHING;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Create trigger to run after profile is created
CREATE OR REPLACE FUNCTION public.check_admin_on_profile_insert()
RETURNS TRIGGER AS $$
BEGIN
  -- Check if the user email is the admin email
  IF NEW.email = 'tujenganesaccoke@gmail.com' THEN
    -- Auto-approve the profile
    NEW.status := 'approved';
    
    -- Assign admin role
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.user_id, 'admin')
    ON CONFLICT (user_id, role) DO NOTHING;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Create trigger on profiles table
CREATE TRIGGER on_profile_created
  BEFORE INSERT ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.check_admin_on_profile_insert();
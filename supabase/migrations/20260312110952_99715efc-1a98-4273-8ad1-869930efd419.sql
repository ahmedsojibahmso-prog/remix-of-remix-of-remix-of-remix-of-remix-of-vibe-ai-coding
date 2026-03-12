
-- Add admin_status column to profiles table
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS admin_status text NOT NULL DEFAULT 'pending';

-- Update existing profiles to 'approved' so current users aren't locked out
UPDATE public.profiles SET admin_status = 'approved' WHERE admin_status = 'pending';

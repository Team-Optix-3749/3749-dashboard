-- Enable RLS on all application tables. No policies are added yet (deny by default).
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.special_perms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.build_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.build_zones ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.outreach_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.outreach_attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.opi_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.opi_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.opi_event_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;


-- Role enum
CREATE TYPE public.app_role AS ENUM ('student', 'admin', 'super_admin');

-- User roles table (separate from profiles per security requirements)
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL DEFAULT 'student',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role
  )
$$;

-- Profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  full_name TEXT,
  avatar_url TEXT,
  phone TEXT,
  location TEXT,
  bio TEXT,
  skills TEXT[],
  github_url TEXT,
  linkedin_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Modules
CREATE TABLE public.modules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  order_index INT NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'published' CHECK (status IN ('published','draft','scheduled')),
  duration_minutes INT DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.modules ENABLE ROW LEVEL SECURITY;

-- Lessons
CREATE TABLE public.lessons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  module_id UUID REFERENCES public.modules(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'video' CHECK (type IN ('video','article','quiz','assignment')),
  video_url TEXT,
  content TEXT,
  duration_seconds INT DEFAULT 0,
  order_index INT NOT NULL DEFAULT 0,
  is_free BOOLEAN DEFAULT false,
  status TEXT NOT NULL DEFAULT 'published' CHECK (status IN ('published','draft','scheduled')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.lessons ENABLE ROW LEVEL SECURITY;

-- User progress
CREATE TABLE public.user_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  lesson_id UUID REFERENCES public.lessons(id) ON DELETE CASCADE NOT NULL,
  completed BOOLEAN DEFAULT false,
  progress_percent INT DEFAULT 0,
  last_position_seconds INT DEFAULT 0,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, lesson_id)
);
ALTER TABLE public.user_progress ENABLE ROW LEVEL SECURITY;

-- Assignments
CREATE TABLE public.assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  module_id UUID REFERENCES public.modules(id) ON DELETE SET NULL,
  type TEXT NOT NULL DEFAULT 'project' CHECK (type IN ('project','quiz','written','code')),
  max_points INT DEFAULT 100,
  pass_mark INT DEFAULT 60,
  due_date TIMESTAMPTZ,
  status TEXT NOT NULL DEFAULT 'published',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.assignments ENABLE ROW LEVEL SECURITY;

-- Assignment submissions
CREATE TABLE public.assignment_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  assignment_id UUID REFERENCES public.assignments(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  github_url TEXT,
  live_demo_url TEXT,
  file_url TEXT,
  notes TEXT,
  status TEXT NOT NULL DEFAULT 'submitted' CHECK (status IN ('submitted','grading','graded','resubmit')),
  score INT,
  grade TEXT,
  feedback TEXT,
  submitted_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  graded_at TIMESTAMPTZ,
  UNIQUE (assignment_id, user_id)
);
ALTER TABLE public.assignment_submissions ENABLE ROW LEVEL SECURITY;

-- Community posts
CREATE TABLE public.community_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT,
  content TEXT NOT NULL,
  type TEXT DEFAULT 'post' CHECK (type IN ('post','discussion','question')),
  category TEXT,
  likes_count INT DEFAULT 0,
  comments_count INT DEFAULT 0,
  is_pinned BOOLEAN DEFAULT false,
  is_solved BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.community_posts ENABLE ROW LEVEL SECURITY;

-- Post comments
CREATE TABLE public.post_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID REFERENCES public.community_posts(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  parent_id UUID REFERENCES public.post_comments(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  is_best_answer BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.post_comments ENABLE ROW LEVEL SECURITY;

-- Reviews
CREATE TABLE public.reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
  title TEXT,
  content TEXT,
  is_published BOOLEAN DEFAULT false,
  helpful_count INT DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- Announcements
CREATE TABLE public.announcements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  type TEXT DEFAULT 'general' CHECK (type IN ('general','course_update','live_class','maintenance','offer')),
  priority TEXT DEFAULT 'normal' CHECK (priority IN ('normal','important','urgent')),
  is_published BOOLEAN DEFAULT true,
  views_count INT DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;

-- Events
CREATE TABLE public.events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  type TEXT DEFAULT 'live_class' CHECK (type IN ('live_class','webinar','workshop')),
  event_date TIMESTAMPTZ NOT NULL,
  platform TEXT,
  meeting_url TEXT,
  max_attendees INT,
  banner_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;

-- Event registrations
CREATE TABLE public.event_registrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID REFERENCES public.events(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  registered_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (event_id, user_id)
);
ALTER TABLE public.event_registrations ENABLE ROW LEVEL SECURITY;

-- Tools & gifts
CREATE TABLE public.tools_gifts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL,
  value_bdt INT DEFAULT 0,
  access_type TEXT DEFAULT 'link' CHECK (access_type IN ('tutorial','download','link')),
  url TEXT,
  logo_url TEXT,
  status TEXT DEFAULT 'active' CHECK (status IN ('active','coming_soon','inactive')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.tools_gifts ENABLE ROW LEVEL SECURITY;

-- Notifications
CREATE TABLE public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT DEFAULT 'info',
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Certificates
CREATE TABLE public.certificates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  type TEXT DEFAULT 'completion',
  issued_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  file_url TEXT
);
ALTER TABLE public.certificates ENABLE ROW LEVEL SECURITY;

-- Achievements
CREATE TABLE public.achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  badge_icon TEXT,
  xp_points INT DEFAULT 0,
  earned_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;

-- QA Questions
CREATE TABLE public.qa_questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending','answered','instructor_answered')),
  is_bookmarked BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.qa_questions ENABLE ROW LEVEL SECURITY;

-- QA Answers
CREATE TABLE public.qa_answers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question_id UUID REFERENCES public.qa_questions(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  content TEXT NOT NULL,
  is_best_answer BOOLEAN DEFAULT false,
  helpful_count INT DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.qa_answers ENABLE ROW LEVEL SECURITY;

-- Transactions
CREATE TABLE public.transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  amount_bdt INT NOT NULL,
  payment_method TEXT,
  status TEXT DEFAULT 'success' CHECK (status IN ('success','pending','failed','refunded')),
  gateway_id TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;

-- Admin activity logs
CREATE TABLE public.admin_activity_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  details JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.admin_activity_logs ENABLE ROW LEVEL SECURITY;

-- Auto-create profile + student role on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, full_name, avatar_url)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email), NEW.raw_user_meta_data->>'avatar_url');
  
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'student');
  
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Updated_at trigger
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
CREATE TRIGGER update_modules_updated_at BEFORE UPDATE ON public.modules FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
CREATE TRIGGER update_lessons_updated_at BEFORE UPDATE ON public.lessons FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
CREATE TRIGGER update_user_progress_updated_at BEFORE UPDATE ON public.user_progress FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
CREATE TRIGGER update_assignments_updated_at BEFORE UPDATE ON public.assignments FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
CREATE TRIGGER update_community_posts_updated_at BEFORE UPDATE ON public.community_posts FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- ============ RLS POLICIES ============

-- Profiles: everyone can read, owners can update
CREATE POLICY "Anyone can read profiles" ON public.profiles FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

-- User roles: own role readable, admins manage
CREATE POLICY "Users can read own roles" ON public.user_roles FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Admins can read all roles" ON public.user_roles FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'super_admin'));
CREATE POLICY "Admins can manage roles" ON public.user_roles FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'super_admin'));

-- Modules: everyone reads, admins manage
CREATE POLICY "Anyone can read modules" ON public.modules FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admins manage modules" ON public.modules FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'super_admin'));

-- Lessons: everyone reads, admins manage
CREATE POLICY "Anyone can read lessons" ON public.lessons FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admins manage lessons" ON public.lessons FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'super_admin'));

-- User progress: own data only, admins read all
CREATE POLICY "Users manage own progress" ON public.user_progress FOR ALL TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Admins read all progress" ON public.user_progress FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'super_admin'));

-- Assignments: everyone reads, admins manage
CREATE POLICY "Anyone can read assignments" ON public.assignments FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admins manage assignments" ON public.assignments FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'super_admin'));

-- Assignment submissions
CREATE POLICY "Users manage own submissions" ON public.assignment_submissions FOR ALL TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Admins read all submissions" ON public.assignment_submissions FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'super_admin'));
CREATE POLICY "Admins grade submissions" ON public.assignment_submissions FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'super_admin'));

-- Community posts
CREATE POLICY "Anyone can read posts" ON public.community_posts FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can create posts" ON public.community_posts FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users update own posts" ON public.community_posts FOR UPDATE TO authenticated USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Users delete own posts" ON public.community_posts FOR DELETE TO authenticated USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));

-- Post comments
CREATE POLICY "Anyone can read comments" ON public.post_comments FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can create comments" ON public.post_comments FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users update own comments" ON public.post_comments FOR UPDATE TO authenticated USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Users delete own comments" ON public.post_comments FOR DELETE TO authenticated USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));

-- Reviews
CREATE POLICY "Anyone can read reviews" ON public.reviews FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can create reviews" ON public.reviews FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users update own reviews" ON public.reviews FOR UPDATE TO authenticated USING (auth.uid() = user_id);

-- Announcements: everyone reads, admins manage
CREATE POLICY "Anyone can read announcements" ON public.announcements FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admins manage announcements" ON public.announcements FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'super_admin'));

-- Events: everyone reads, admins manage
CREATE POLICY "Anyone can read events" ON public.events FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admins manage events" ON public.events FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'super_admin'));

-- Event registrations
CREATE POLICY "Users manage own registrations" ON public.event_registrations FOR ALL TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Admins read registrations" ON public.event_registrations FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'super_admin'));

-- Tools & gifts: everyone reads, admins manage
CREATE POLICY "Anyone can read tools" ON public.tools_gifts FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admins manage tools" ON public.tools_gifts FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'super_admin'));

-- Notifications: own only
CREATE POLICY "Users read own notifications" ON public.notifications FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users update own notifications" ON public.notifications FOR UPDATE TO authenticated USING (auth.uid() = user_id);

-- Certificates: own only, admins read all
CREATE POLICY "Users read own certificates" ON public.certificates FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Admins read all certificates" ON public.certificates FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'super_admin'));

-- Achievements: own only, admins read all
CREATE POLICY "Users read own achievements" ON public.achievements FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Admins read all achievements" ON public.achievements FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'super_admin'));

-- QA Questions
CREATE POLICY "Anyone can read questions" ON public.qa_questions FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users create questions" ON public.qa_questions FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users update own questions" ON public.qa_questions FOR UPDATE TO authenticated USING (auth.uid() = user_id);

-- QA Answers
CREATE POLICY "Anyone can read answers" ON public.qa_answers FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users create answers" ON public.qa_answers FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users update own answers" ON public.qa_answers FOR UPDATE TO authenticated USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));

-- Transactions: own only, admins read all
CREATE POLICY "Users read own transactions" ON public.transactions FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Admins read all transactions" ON public.transactions FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'super_admin'));

-- Admin activity logs: admins only
CREATE POLICY "Admins read activity logs" ON public.admin_activity_logs FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'super_admin'));
CREATE POLICY "Admins create activity logs" ON public.admin_activity_logs FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'super_admin'));

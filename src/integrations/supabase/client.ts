// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://ixkkeuyzqjikpajokbho.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml4a2tldXl6cWppa3Bham9rYmhvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzk4MjA2MzAsImV4cCI6MjA1NTM5NjYzMH0.mxLx7kTgnovGQubt86wBP3JdtYpVo5Q62ttesl89GYA";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);
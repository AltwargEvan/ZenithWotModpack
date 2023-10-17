import * as types from "./types";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://gxnxucnrgbmzhwrjpclf.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd4bnh1Y25yZ2Jtemh3cmpwY2xmIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTc0MjY4NTUsImV4cCI6MjAxMzAwMjg1NX0.LL9CDqccgOcIJibtGM55YQNnkB1_-j9bEZ6Wpl77WLs";

export const supabasePublicClient = createClient<types.Database>(
  supabaseUrl,
  supabaseAnonKey
);
export const supabaseAuthorizedClient = createClient<types.Database>(
  supabaseUrl,
  process.env.SUPABASE_SECRET_KEY as string
);

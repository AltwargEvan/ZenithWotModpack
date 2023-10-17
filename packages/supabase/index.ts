import { Json, Database } from "./types";
import { createClient } from "@supabase/supabase-js";
export type Tables<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Row"];
export type Enums<T extends keyof Database["public"]["Enums"]> =
  Database["public"]["Enums"][T];

export const supabaseUrl = "https://gxnxucnrgbmzhwrjpclf.supabase.co";
export const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd4bnh1Y25yZ2Jtemh3cmpwY2xmIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTc0MjY4NTUsImV4cCI6MjAxMzAwMjg1NX0.LL9CDqccgOcIJibtGM55YQNnkB1_-j9bEZ6Wpl77WLs";

export type Prettify<T> = {
  [K in keyof T]: T[K];
} & {};

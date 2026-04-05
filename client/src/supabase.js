import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://xbyxuifdmwzkcdqyjkfx.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_1ncm3qSgaVyxjdRkAfRjkQ_n7WZYV-c";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_KEY
console.log("Supabase URL:", supabaseUrl);
console.log("Supabase Key:", supabaseAnonKey);

export const supabase = createClient(supabaseUrl, supabaseAnonKey)



//1nga4tK@mpu5
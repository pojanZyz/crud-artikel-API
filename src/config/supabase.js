const { createClient } = require('@supabase/supabase-js');
const supabaseUrl = 'https://ggwfplbytoyuzuevhcfo.supabase.co';
const supabaseKey = process.env.SUPABASE_KEY;

if (!supabaseKey) {
  throw new Error('SUPABASE_KEY is not defined. Please check your .env file.');
}

console.log('Initializing Supabase client...');
const supabase = createClient(supabaseUrl, supabaseKey);
console.log('Supabase client initialized successfully.');

module.exports = supabase;

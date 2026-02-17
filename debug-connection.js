
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://cmlwammerxpeveprnrux.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNtbHdhbW1lcnhwZXZlcHJucnV4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzEzMjI3MDUsImV4cCI6MjA4Njg5ODcwNX0.0wyoI8N0FTCJR1XeugIekQbj2NmczURJusmc2OeOzzw';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkTable(tableName) {
  console.log(`Checking table '${tableName}'...`);
  const { data, error } = await supabase.from(tableName).select('count', { count: 'exact', head: true });
  
  if (error) {
    console.error(`ERROR accessing '${tableName}':`, error);
    return false;
  } else {
    console.log(`SUCCESS accessing '${tableName}'.`);
    return true;
  }
}

async function debug() {
  console.log('--- START DEBUG ---');
  await checkTable('leaderboard_settings');
  await checkTable('teams');
  await checkTable('leaderboard_view');
  console.log('--- END DEBUG ---');
}

debug();

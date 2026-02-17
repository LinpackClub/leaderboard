
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://cmlwammerxpeveprnrux.supabase.co';
// Using the JWT key which worked for SELECT
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNtbHdhbW1lcnhwZXZlcHJucnV4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzEzMjI3MDUsImV4cCI6MjA4Njg5ODcwNX0.0wyoI8N0FTCJR1XeugIekQbj2NmczURJusmc2OeOzzw';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkPermissions() {
  console.log('--- START PERMISSION CHECK (JWT) ---');

  // 1. Try Select
  console.log('Checking SELECT on teams...');
  const { data: selectData, error: selectError } = await supabase.from('teams').select('count', { count: 'exact', head: true });
  if (selectError) {
    console.error('SELECT Failed:', selectError);
  } else {
    console.log('SELECT Success. Count:', selectData); // data is null for head:true
  }

  // 2. Try Upsert (Mock data)
  console.log('Checking UPSERT on teams...');
  const mockTeam = {
      team_name: 'Debug Team_' + Math.random().toString(36).substring(7),
      ice_cream: 0,
      dart: 0,
      balloon: 0,
      cup_stack: 0
  };

  const { data: upsertData, error: upsertError } = await supabase.from('teams').upsert(mockTeam).select();
  
  if (upsertError) {
      console.error('UPSERT Failed:', upsertError);
  } else {
      console.log('UPSERT Success!');
      // Cleanup
      if (upsertData && upsertData[0]) {
          await supabase.from('teams').delete().eq('id', upsertData[0].id);
          console.log('Cleanup Success.');
      }
  }

  console.log('--- END PERMISSION CHECK (JWT) ---');
}

checkPermissions();


import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://cmlwammerxpeveprnrux.supabase.co';
// Using the NEW sb_publishable key provided by the user
const supabaseKey = 'sb_publishable_QaxJjw17LOvv254GTn-7GQ_0_0EUp5t';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkPermissions() {
  console.log('--- START PERMISSION CHECK ---');

  // 1. Try Select
  console.log('Checking SELECT on teams...');
  const { data: selectData, error: selectError } = await supabase.from('teams').select('count', { count: 'exact', head: true });
  if (selectError) {
    console.error('SELECT Failed:', selectError);
  } else {
    console.log('SELECT Success. Count:', selectData);
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

  console.log('--- END PERMISSION CHECK ---');
}

checkPermissions();

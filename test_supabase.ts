import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''
);

async function testUpload() {
  const { data, error } = await supabaseAdmin.storage
    .from('processed-files')
    .upload('test/test.txt', Buffer.from('hello world'), {
      contentType: 'text/plain',
      upsert: true
    });

  if (error) {
    console.error('Upload Error:', error);
  } else {
    console.log('Upload Success:', data);
  }
}

testUpload();

// check-supabase.ts
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY! // 使用 Service Role Key 才有写入权限

const supabase = createClient(supabaseUrl, supabaseKey)

async function main() {
  console.log('Testing Supabase connection...')
  console.log('URL:', supabaseUrl)
  
  // 尝试插入一条测试数据
  const { data, error } = await supabase.from('orders').insert({
    userEmail: 'test-connection@example.com',
    amount: 100,
    status: 'test',
    stripeSessionId: 'test_session_' + Date.now()
  }).select()

  if (error) {
    console.error('❌ Insert Error:', error)
  } else {
    console.log('✅ Insert Success:', data)
  }
}

main()
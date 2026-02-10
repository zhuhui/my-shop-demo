#!/bin/bash

echo "🚀 Simple Shop 配置助手"
echo "========================"
echo ""

# 检查是否在正确的目录
if [ ! -f "package.json" ]; then
    echo "❌ 错误：请在项目根目录运行此脚本"
    exit 1
fi

echo "请按提示输入你的配置信息："
echo ""

# 收集 Stripe 配置
echo "📦 Stripe 配置（支付系统）"
echo "   访问 https://dashboard.stripe.com/test/apikeys 获取"
read -p "   Stripe Publishable Key (pk_test_...): " stripe_pk
read -p "   Stripe Secret Key (sk_test_...): " stripe_sk
read -p "   Stripe Webhook Secret (whsec_...): " stripe_wh

echo ""

# 收集 Supabase 配置
echo "📦 Supabase 配置（数据库）"
echo "   访问 https://app.supabase.com/project/_/settings/api 获取"
read -p "   Supabase URL (https://...supabase.co): " supabase_url
read -p "   Supabase Anon Key: " supabase_key
read -p "   Database Password: " db_password

echo ""

# 收集产品配置
echo "📦 Stripe 产品配置"
echo "   访问 https://dashboard.stripe.com/test/products 获取"
read -p "   入门套餐 Price ID (price_...): " price_basic
read -p "   专业套餐 Price ID (price_...): " price_pro

echo ""
echo "正在生成配置文件..."

# 生成 .env.local
cat > .env.local << EOF
# Supabase
NEXT_PUBLIC_SUPABASE_URL=${supabase_url}
NEXT_PUBLIC_SUPABASE_ANON_KEY=${supabase_key}
SUPABASE_SERVICE_ROLE_KEY=${supabase_key}
DATABASE_URL="postgresql://postgres:${db_password}@db.${supabase_url#https://}.supabase.co:5432/postgres"

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=${stripe_pk}
STRIPE_SECRET_KEY=${stripe_sk}
STRIPE_WEBHOOK_SECRET=${stripe_wh}

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
EOF

echo "✅ .env.local 已创建"

# 更新产品配置
sed -i '' "s/price_test/${price_basic}/g" app/page.tsx
echo "✅ 产品配置已更新"

# 安装依赖
echo "📦 安装依赖..."
npm install

# 推送数据库模型
echo "🗄️ 初始化数据库..."
npx prisma db push

# 生成 Prisma Client
echo "🔧 生成数据库客户端..."
npx prisma generate

echo ""
echo "✅ 配置完成！"
echo ""
echo "🚀 启动开发服务器："
echo "   npm run dev"
echo ""
echo "🧪 测试支付流程："
echo "   1. 访问 http://localhost:3000"
echo "   2. 在新终端运行：stripe listen --forward-to localhost:3000/api/webhook"
echo "   3. 输入邮箱，点击购买"
echo "   4. 使用测试卡号：4242 4242 4242 4242"
echo ""

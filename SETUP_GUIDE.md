# 配置指南 - Stripe + Supabase

## 步骤 1：Stripe 配置

### 1.1 注册账号
1. 访问 https://stripe.com
2. 点击 "Start now" 注册
3. 使用邮箱注册（支持国内邮箱）
4. 选择 "Individual" 个人开发者

### 1.2 获取测试密钥
1. 登录 Stripe Dashboard
2. 确保在 **Test Mode**（左上角开关）
3. 进入 Developers → API keys
4. 复制以下密钥：
   - **Publishable key**: `pk_test_...`
   - **Secret key**: `sk_test_...`

### 1.3 创建产品
1. 进入 Products → Add product
2. 产品名称：入门套餐
3. 价格：¥99
4. 保存后获取 **Price ID** (格式：`price_xxx`)
5. 再创建一个产品：专业套餐 ¥299

### 1.4 配置 Webhook（支付回调）
1. 进入 Developers → Webhooks
2. Add endpoint
3. Endpoint URL: `http://localhost:3000/api/webhook`（本地测试）
4. 选择事件：`checkout.session.completed`
5. 保存后获取 **Webhook secret** (格式：`whsec_xxx`)

---

## 步骤 2：Supabase 配置（数据库）

### 2.1 注册账号
1. 访问 https://supabase.com
2. 点击 "Start your project"
3. 使用 GitHub 账号登录

### 2.2 创建项目
1. 点击 "New project"
2. 组织名：Personal
3. 项目名称：simple-shop
4. 数据库密码：设置一个强密码
5. 地区选择：Singapore（离中国最近）
6. 等待项目创建完成（约1-2分钟）

### 2.3 获取连接信息
1. 进入 Project Settings → Database
2. 找到 **Connection string** (URI 格式)
3. 或者使用以下信息：
   - **Project URL**: Settings → API → Project URL
   - **Anon Key**: Settings → API → Project API keys → anon/public

---

## 步骤 3：更新环境变量

编辑 `.env.local` 文件：

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_key
STRIPE_SECRET_KEY=sk_test_your_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

## 步骤 4：初始化数据库

### 4.1 安装 Prisma CLI
```bash
npm install -g prisma
```

### 4.2 更新 Prisma 配置
编辑 `prisma/schema.prisma`：

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL") // 使用完整的连接字符串
}
```

### 4.3 设置数据库连接字符串
在 `.env.local` 中添加：
```env
DATABASE_URL="postgresql://postgres:[password]@db.your-project.supabase.co:5432/postgres"
```

### 4.4 推送数据库模型
```bash
npx prisma db push
```

### 4.5 生成 Prisma Client
```bash
npx prisma generate
```

---

## 步骤 5：更新产品配置

编辑 `app/page.tsx`，更新 priceId：

```typescript
const products = [
  {
    id: "prod_1",
    name: "入门套餐",
    description: "适合个人用户的基础版本",
    price: 99,
    priceId: "price_你的实际ID", // 替换为 Stripe 中的 Price ID
    features: ["基础功能", "邮件支持", "1GB 存储"],
  },
  {
    id: "prod_2",
    name: "专业套餐",
    description: "适合小型团队的进阶版本",
    price: 299,
    priceId: "price_你的实际ID", // 替换为 Stripe 中的 Price ID
    features: ["所有基础功能", "优先支持", "10GB 存储", "团队协作"],
  },
];
```

---

## 步骤 6：测试支付流程

### 6.1 启动 Webhook 转发（新终端）
```bash
stripe login
stripe listen --forward-to localhost:3000/api/webhook
```

### 6.2 重启开发服务器
```bash
npm run dev
```

### 6.3 测试支付
1. 访问 http://localhost:3000
2. 输入邮箱地址
3. 点击"立即购买"
4. 使用测试卡号支付：
   - 卡号：`4242 4242 4242 4242`
   - 日期：`12/30`
   - CVC：`123`
5. 完成支付，查看成功页面

---

## 常见问题

### Q1: Stripe 需要公司注册吗？
不需要！个人开发者模式完全免费，可以无限测试。

### Q2: Supabase 免费吗？
免费！包含 500MB 数据库 + 无限 API 请求。

### Q3: Webhook 报错怎么办？
确保：
1. 在 .env.local 中配置了正确的 WEBHOOK_SECRET
2. 运行了 `stripe listen` 命令
3. Webhook URL 可访问

### Q4: 数据库连接失败？
检查：
1. DATABASE_URL 格式正确
2. 密码没有特殊字符（需要 URL encode）
3. Supabase 项目已启动

---

## 下一步

配置完成后，你可以：
1. 部署到 Vercel 线上环境
2. 添加更多功能（用户认证、订单管理等）
3. 接入真实产品数据

import { Metadata } from "next";
import Navbar from "./components/Navbar";
import ProductCard from "./components/ProductCard";

export const metadata: Metadata = {
  title: "Simple Shop - 全栈演示",
  description: "Next.js + Stripe 全栈支付演示",
};

const products = [
  {
    id: "prod_1",
    name: "入门套餐",
    description: "适合个人用户的基础版本",
    price: 99,
    priceId: "price_1SzBo9JopMRcThcBTqgkFH93",
    features: ["基础功能", "邮件支持", "1GB 存储"],
  },
  {
    id: "prod_2",
    name: "专业套餐",
    description: "适合小型团队的进阶版本",
    price: 299,
    priceId: "price_1SzBihJopMRcThcBxeTy1fdi",
    features: ["所有基础功能", "优先支持", "10GB 存储", "团队协作"],
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <section className="bg-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            全栈支付演示
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            基于 Next.js + Stripe 的最简全栈实现
          </p>
          <p className="text-sm text-gray-500">
            Android 开发者朱辉的全栈学习项目
          </p>
        </div>
      </section>

      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">选择套餐</h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-8">技术栈</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { name: "Next.js 14", desc: "React 框架" },
              { name: "TypeScript", desc: "类型安全" },
              { name: "Tailwind CSS", desc: "样式框架" },
              { name: "Stripe", desc: "支付系统" },
              { name: "Supabase", desc: "数据库" },
              { name: "Prisma", desc: "ORM" },
              { name: "Vercel", desc: "部署平台" },
              { name: "PostgreSQL", desc: "关系数据库" },
            ].map((tech) => (
              <div
                key={tech.name}
                className="bg-gray-50 p-4 rounded-lg text-center"
              >
                <h3 className="font-semibold text-gray-900">{tech.name}</h3>
                <p className="text-sm text-gray-600">{tech.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="bg-gray-900 text-white py-8 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <p>© 2025 Simple Shop. 朱辉的全栈学习项目</p>
        </div>
      </footer>
    </div>
  );
}

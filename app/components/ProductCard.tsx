"use client";

import { useState } from "react";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  priceId: string;
  features: string[];
}

export default function ProductCard({ product }: { product: Product }) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleCheckout = async () => {
    if (!email) {
      alert("请输入邮箱地址");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          priceId: product.priceId,
          customerEmail: email,
        }),
      });

      const data = await response.json();

      if (data.url) {
        window.location.href = data.url;
      } else {
        alert("支付初始化失败: " + (data.error || "未知错误"));
      }
    } catch (error) {
      console.error("Checkout error:", error);
      alert("支付初始化失败，请重试");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
      <h3 className="text-2xl font-bold text-gray-900 mb-2">{product.name}</h3>
      <p className="text-gray-600 mb-4">{product.description}</p>
      
      <div className="mb-6">
        <span className="text-4xl font-bold text-gray-900">¥{product.price}</span>
        <span className="text-gray-500">/月</span>
      </div>

      <ul className="space-y-2 mb-6">
        {product.features.map((feature, index) => (
          <li key={index} className="flex items-center text-gray-600">
            <svg
              className="w-5 h-5 text-green-500 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
            {feature}
          </li>
        ))}
      </ul>

      <div className="space-y-3">
        <input
          type="email"
          placeholder="输入邮箱地址"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <button
          onClick={handleCheckout}
          disabled={loading}
          className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "处理中..." : "立即购买"}
        </button>
      </div>

      <p className="text-xs text-gray-500 mt-3 text-center">
        使用 Stripe 安全支付
      </p>
    </div>
  );
}

// lib/check-orders.ts
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const orders = await prisma.order.findMany({
    orderBy: { createdAt: 'desc' }
  })
  
  console.log('📦 最新订单记录：')
  console.log('-------------------')
  orders.forEach(order => {
    console.log(`ID: ${order.id}`)
    console.log(`邮箱: ${order.userEmail}`)
    console.log(`金额: ¥${order.amount / 100}`)
    console.log(`状态: ${order.status}`)
    console.log(`时间: ${order.createdAt.toLocaleString()}`)
    console.log('-------------------')
  })
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect())
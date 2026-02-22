import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  await prisma.user.upsert({
    where: { email: 'instructor@example.com' },
    update: {},
    create: { name: 'อาจารย์สมชาย', email: 'instructor@example.com', role: 'INSTRUCTOR' }
  })
  await prisma.user.upsert({
    where: { email: 'student@example.com' },
    update: {},
    create: { name: 'นักศึกษาสมหญิง', email: 'student@example.com', role: 'STUDENT' }
  })
  await prisma.user.upsert({
    where: { email: 'student2@example.com' },
    update: {},
    create: { name: 'นักศึกษาประเสริฐ', email: 'student2@example.com', role: 'STUDENT' }
  })
}

main()
  .then(() => prisma.$disconnect())
  .catch(e => {
    console.error(e)
    prisma.$disconnect()
    process.exit(1)
  })

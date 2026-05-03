import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const owner = await prisma.user.upsert({
    where: { email: 'owner@team3749.org' },
    update: {},
    create: {
      name: 'Team Owner',
      email: 'owner@team3749.org',
      isVerified: true,
      role: 'OWNER'
    }
  })
  console.log('Owner ensured:', owner.email)
}

main()
  .catch(e => { console.error(e); process.exit(1) })
  .finally(async () => { await prisma.$disconnect() })

import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';
const prisma = new PrismaClient();
const roundsOfHashing = 10;

async function main() {
  const hashedPassword = await bcrypt.hash('password', roundsOfHashing);
  const checkEmail = await prisma.user.findUnique({
    where: {
      email: 'admin@mail.com',
    },
  });
  if (!checkEmail) {
    await prisma.user.create({
      data: {
        email: 'admin@mail.com',
        name: 'Admin',
        password: hashedPassword,
        role: 'SUPERADMIN',
      },
    });
  }
}

main()
  .catch((e) => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });

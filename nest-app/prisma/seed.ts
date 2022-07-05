import { Prisma, PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const roomData: Prisma.GameRoomCreateManyInput[] = [
  {
    name: 'fire',
    min_usd_to_join: 0.5,
    max_usd_to_join: 500,
    variable_stake: true,
  },
  {
    name: 'ice',
    min_usd_to_join: 0.5,
    max_usd_to_join: 0.5,
  },
];

async function main() {
  console.log('Seeding Initialized');
  await prisma.gameRoom.createMany({
    data: roomData,
  });
  console.log('Seeding Finished');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

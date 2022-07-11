import { FoodType, Prisma, PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const roomData: Prisma.GameRoomCreateManyInput[] = [
  {
    name: 'fire',
    min_usd_to_join: 0.5,
    max_usd_to_join: 500,
    variable_stake: true,
    max_players: 50,
    tokens: 10 * Math.pow(10, 12), // change tokens according to need
    tokens_per_instance: 1 * Math.pow(10, 9),
  },
  {
    name: 'ice',
    min_usd_to_join: 0.5,
    max_usd_to_join: 0.5,
    max_players: 50,
    tokens: 10 * Math.pow(10, 12), // change tokens according to need
    tokens_per_instance: 1 * Math.pow(10, 9),
  },
];

const foodData: Prisma.FoodCreateManyInput[] = [
  {
    type: FoodType.RED,
    value: 1,
  },
  {
    type: FoodType.GREEN,
    value: 2,
  },
  {
    type: FoodType.ORANGE,
    value: 10,
  },
  {
    type: FoodType.BLUE,
    value: 100,
  },
  {
    type: FoodType.COIN,
    value: 1000,
  },
];

async function main() {
  console.log('Seeding Initialized');
  await prisma.gameRoom.createMany({
    data: roomData,
  });
  console.log('rooms created');

  await prisma.food.createMany({
    data: foodData,
  });
  console.log('food types added');
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

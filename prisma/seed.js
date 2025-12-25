const { PrismaClient } = require("../app/generated/prisma/client");

const photographersData = require("../data/photographer.json");
const mediasData = require("../data/media.json");

const prisma = new PrismaClient();

async function main() {
  await prisma.photographer.createMany({
    data: photographersData,
  });

  await prisma.media.createMany({
    data: mediasData,
  });
}

main()
  .then(async () => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });

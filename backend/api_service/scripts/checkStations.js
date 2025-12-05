import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkStations() {
  try {
    const count = await prisma.stations.count();
    console.log(`Total stations in database: ${count}`);

    const sampleStations = await prisma.stations.findMany({
      take: 10,
      select: {
        id: true,
        name: true,
        line_name: true
      }
    });

    console.log('\nSample stations:');
    sampleStations.forEach(station => {
      console.log(`  ${station.id} - ${station.name} (${station.line_name || 'no line'})`);
    });

    const myp1 = await prisma.stations.findUnique({
      where: { id: 'MYP1' }
    });

    const era1 = await prisma.stations.findUnique({
      where: { id: 'ERA1' }
    });

    console.log('\nChecking your test stations:');
    console.log(`MYP1 exists: ${myp1 ? 'YES - ' + myp1.name : 'NO'}`);
    console.log(`ERA1 exists: ${era1 ? 'YES - ' + era1.name : 'NO'}`);

  } catch (error) {
    console.error('Error checking stations:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkStations();

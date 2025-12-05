import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const prisma = new PrismaClient();

async function importStations() {
  try {
    console.log('Testing database connection...');
    await prisma.$connect();
    console.log('Database connected successfully');

    const stopsFilePath = path.join(__dirname, '../../route_service/app/data/stops.txt');
    const fileContent = fs.readFileSync(stopsFilePath, 'utf-8');
    const lines = fileContent.trim().split('\n');

    const stations = [];
    const parentStations = [];
    const childStations = [];

    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',');
      const station = {
        id: values[0],
        name: values[1],
        latitude: parseFloat(values[2]),
        longitude: parseFloat(values[3]),
        parent_station_id: values[6] || null,
        line_name: null
      };

      if (station.parent_station_id) {
        childStations.push(station);
      } else {
        parentStations.push(station);
      }
    }

    console.log(`Found ${parentStations.length} parent stations and ${childStations.length} child stations`);

    const existingCount = await prisma.stations.count();
    console.log(`Database currently has ${existingCount} stations`);

    if (existingCount > 0) {
      console.log('Stations already exist. Skipping import to preserve foreign key relationships.');
      console.log('If you need to reimport, first delete all routes, saved_routes, and history records.');
      return;
    }

    console.log('Importing parent stations...');
    await prisma.stations.createMany({
      data: parentStations,
      skipDuplicates: true
    });
    console.log(`Imported ${parentStations.length} parent stations`);

    console.log('Importing child stations...');
    await prisma.stations.createMany({
      data: childStations,
      skipDuplicates: true
    });
    console.log(`Imported ${childStations.length} child stations`);

    console.log(`Successfully imported ${parentStations.length + childStations.length} stations total`);
  } catch (error) {
    console.error('Error importing stations:', error);
    if (error.code === 'P1001') {
      console.error('\nDatabase connection failed. Please check:');
      console.error('1. Your internet connection');
      console.error('2. Database server is running');
      console.error('3. DATABASE_URL in .env is correct');
      console.error('4. Firewall/VPN settings');
    }
  } finally {
    await prisma.$disconnect();
  }
}

importStations();

import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';
import path from 'path';
import sequelize from '../models';
import Holiday from '../models/holiday';

const seedHolidays = async () => {
  const holidaysFilePath = path.resolve(__dirname, '../../holidays.json');
  const holidaysData = JSON.parse(fs.readFileSync(holidaysFilePath, 'utf-8'));

  const holidayEntries = holidaysData.map((holiday: any) => ({
    holiday_id: uuidv4(),
    country: holiday.country,
    year: holiday.year,
    date: new Date(holiday.date),
    localName: holiday.localName,
    name: holiday.name,
  }));

  try {
    await sequelize.sync({ force: true }); // Drop and recreate the database schema
    await Holiday.bulkCreate(holidayEntries);
    console.log('Holidays seeded successfully!');
  } catch (error) {
    console.error('Error seeding holidays:', error);
  } finally {
    await sequelize.close();
  }
};

seedHolidays();

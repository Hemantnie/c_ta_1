import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';
import path from 'path';
import sequelize from '../models';
import Holiday from '../models/holiday';
import Employee from '../models/employee';
import Address from '../models/address';

const seedAll = async () => {
    const holidaysFilePath = path.resolve(__dirname, '../../holidays.json');
    const holidaysData = JSON.parse(fs.readFileSync(holidaysFilePath, 'utf-8'));
    const employeesFilePath = path.resolve(__dirname, '../../employees.json');
    const employeesData = JSON.parse(fs.readFileSync(employeesFilePath, 'utf-8'));
  
    const holidayEntries = holidaysData.map((holiday: any) => ({
      holiday_id: uuidv4(),
      country: holiday.country,
      year: holiday.year,
      date: new Date(holiday.date),
      localName: holiday.localName,
      name: holiday.name,
    }));
    try {
        await sequelize.sync({ force: true });
        await Holiday.bulkCreate(holidayEntries);
        for (const employeeData of employeesData) {
            const employee = await Employee.create({
              employee_id: uuidv4(),
              name: employeeData.name,
              position: employeeData.position,
              email: employeeData.email,
              salary: employeeData.salary,
              created_at: new Date(new Date().toUTCString()),
              modified_at: new Date(new Date().toUTCString())
            });
      
            await Address.create({
              address_id: uuidv4(),
              street: employeeData.address.street,
              house_number: employeeData.address.house_number,
              country: employeeData.address.country,
              state: employeeData.address.state,
              zipcode: employeeData.address.zipcode,
              employee_id: employee.employee_id
            });
          }
      } catch (error) {
        console.error('Error seeding All data:', error);
      } finally {
        await sequelize.close();
    }
};

seedAll();

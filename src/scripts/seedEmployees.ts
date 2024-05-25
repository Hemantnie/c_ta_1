import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';
import path from 'path';
import sequelize from '../models';
import Employee from '../models/employee';
import Address from '../models/address';

const seedEmployees = async () => {
  const employeesFilePath = path.resolve(__dirname, '../../employees.json');
  const employeesData = JSON.parse(fs.readFileSync(employeesFilePath, 'utf-8'));

  try {
    await sequelize.sync({ force: true }); // Drop and recreate the database schema

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

    console.log('Employees and addresses seeded successfully!');
  } catch (error) {
    console.error('Error seeding employees and addresses:', error);
  } finally {
    await sequelize.close();
  }
};

seedEmployees();

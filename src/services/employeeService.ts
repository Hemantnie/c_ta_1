import { Op, Transaction, UniqueConstraintError } from 'sequelize';
import { v4 as uuidv4 } from 'uuid';
import EmployeeRepository from '../repositories/employeeRepository';
import Employee, { EmployeeCreationAttributes } from '../models/employee';
import Address, { AddressCreationAttributes } from '../models/address';
import { getPublicHolidays } from '../utils/publicHolidays';
import HolidayRepository from '../repositories/holidayRepository';
import Holiday from '../models/holiday';
import sequelize from '../models';
import { validateEmail } from '../utils/EmailValidator';

class EmployeeService {

  public async createEmployee(data: EmployeeCreationAttributes, addressData: AddressCreationAttributes): Promise<Employee> {
    if (!validateEmail(data.email)) {
      throw new Error('Invalid email format');
    }
    const transaction = await sequelize.transaction();
    try {
      const employee = await EmployeeRepository.create(data, addressData, transaction);
      await transaction.commit();
      return employee;
    } catch (error) {
      await transaction.rollback();
      if (error instanceof UniqueConstraintError) {
        throw new Error('Email already exists');
      }
      throw error;
    }
  }

  public async getAllEmployees(): Promise<Employee[]> {
    return EmployeeRepository.findAll();
  }

  public async getEmployeeById(id: string): Promise<Employee | null> {
    return EmployeeRepository.findById(id);
  }

  public async updateEmployee(id: string, data: Partial<Employee>, addressData: Partial<Address>): Promise<number> {
    if (data.email && !validateEmail(data.email)) {
      throw new Error('Invalid email format');
    }
    const transaction = await sequelize.transaction();
    return EmployeeRepository.update(id, data, addressData, transaction);
  }

  public async deleteEmployee(id: string): Promise<number> {
    const transaction = await sequelize.transaction();
    return EmployeeRepository.delete(id, transaction);
  }

  public async getPublicHolidaysForEmployee(id: string, year: number): Promise<Holiday[]> {
    const employee = await EmployeeRepository.findById(id);
    if (!employee || !employee.address) {
      throw new Error('Employee or address not found');
    }
    const country = employee.address.country;
    const cachedHolidays = await HolidayRepository.findByCountryAndYear(country, year);

    if (cachedHolidays.length > 0) {
      return cachedHolidays;
    }

    //TODO:Hemant Implement this method
    const holidays = await getPublicHolidays(country, year);
    const holidayEntries = holidays.map(holiday => ({
      holiday_id: uuidv4(),
      country,
      year,
      date: new Date(holiday.date),
      localName: holiday.localName,
      name: holiday.name,
    }));
    await HolidayRepository.bulkCreate(holidayEntries);
    return HolidayRepository.findByCountryAndYear(country, year);
  }

  public async getEmployeesWithUpcomingHolidays(): Promise<Employee[]> {
    const transaction = await sequelize.transaction();
    try {
      const today = new Date();
      const nextWeek = new Date();
      nextWeek.setDate(today.getDate() + 7);

      const holidays = await HolidayRepository.findHolidayInDaterange(today,nextWeek, transaction);

      if (!holidays.length) {
        await transaction.commit();
        return [];
      }

      const countryList = holidays.map(holiday => holiday.country);
      const employees = await EmployeeRepository.getEmployeesInCountries(countryList);

      await transaction.commit();
      return employees;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }
}

export default new EmployeeService();

import { v4 as uuidv4 } from 'uuid';

import EmployeeRepository from '../repositories/employeeRepository';
import Employee, { EmployeeCreationAttributes } from '../models/employee';
import Address, { AddressCreationAttributes } from '../models/address';
import { getPublicHolidays } from '../utils/publicHolidays';
import HolidayRepository from '../repositories/holidayRepository';
import Holiday from '../models/holiday';

class EmployeeService {
  private validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  public async createEmployee(data: EmployeeCreationAttributes, addressData: AddressCreationAttributes): Promise<Employee> {
    if (!this.validateEmail(data.email)) {
      throw new Error('Invalid email format');
    }
    return EmployeeRepository.create(data, addressData);
  }

  public async getAllEmployees(): Promise<Employee[]> {
    return EmployeeRepository.findAll();
  }

  public async getEmployeeById(id: string): Promise<Employee | null> {
    return EmployeeRepository.findById(id);
  }

  public async updateEmployee(id: string, data: Partial<Employee>, addressData: Partial<Address>): Promise<number> {
    if (data.email && !this.validateEmail(data.email)) {
      throw new Error('Invalid email format');
    }
    return EmployeeRepository.update(id, data, addressData);
  }

  public async deleteEmployee(id: string): Promise<number> {
    return EmployeeRepository.delete(id);
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
    return Holiday.findAll({ where: { country, year } });
  }
}

export default new EmployeeService();

import EmployeeRepository from '../repositories/employeeRepository';
import Employee, { EmployeeCreationAttributes } from '../models/employee';
import Address, { AddressCreationAttributes } from '../models/address';
import { getPublicHolidays } from '../utils/publicHolidays';

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

  public async getPublicHolidaysForEmployee(id: string, year: number): Promise<any[]> {
    const employee = await EmployeeRepository.findById(id);
    if (!employee || !employee.address) {
      throw new Error('Employee or address not found');
    }
    const countryCode = employee.address.country;
    return getPublicHolidays(countryCode, year);
  }
}

export default new EmployeeService();

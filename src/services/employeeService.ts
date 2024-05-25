import { Op, Transaction, UniqueConstraintError } from 'sequelize';
import { v4 as uuidv4 } from 'uuid';
import EmployeeRepository from '../repositories/employeeRepository';
import Employee, { EmployeeCreationAttributes } from '../models/employee';
import Address, { AddressCreationAttributes } from '../models/address';
import { getPublicHolidays } from '../utils/publicHolidays';
import HolidayRepository from '../repositories/holidayRepository';
import Holiday from '../models/holiday';
import sequelize from '../models';

class EmployeeService {
  private validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  public async createEmployee(data: EmployeeCreationAttributes, addressData: AddressCreationAttributes): Promise<Employee> {
    if (!this.validateEmail(data.email)) {
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
    if (data.email && !this.validateEmail(data.email)) {
      throw new Error('Invalid email format');
    }
    const transaction = await sequelize.transaction();
    try {
      const employee = await Employee.findByPk(id, {
        transaction,
        lock: transaction.LOCK.UPDATE,
      });

      if (!employee) {
        await transaction.rollback();
        return 0;
      }

      await Employee.update(data, { where: { employee_id: id }, transaction });
      await Address.update(addressData, { where: { employee_id: id }, transaction });

      await transaction.commit();
      return 1;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  public async deleteEmployee(id: string): Promise<number> {
    const transaction = await sequelize.transaction();
    try {
      const employee = await Employee.findByPk(id, {
        transaction,
        lock: transaction.LOCK.UPDATE,
      });

      if (!employee) {
        await transaction.rollback();
        return 0;
      }

      await Address.destroy({ where: { employee_id: id }, transaction });
      await Employee.destroy({ where: { employee_id: id }, transaction });

      await transaction.commit();
      return 1;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
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

  public async getEmployeesWithUpcomingHolidays(): Promise<Employee[]> {
    const transaction = await sequelize.transaction();
    try {
      const today = new Date();
      const nextWeek = new Date();
      nextWeek.setDate(today.getDate() + 7);

      const holidays = await Holiday.findAll({
        where: {
          date: {
            [Op.between]: [today, nextWeek],
          },
        },
        transaction,
      });

      if (!holidays.length) {
        await transaction.commit();
        return [];
      }

      const countryList = holidays.map(holiday => holiday.country);
      const employees = await Employee.findAll({
        include: [
          {
            model: Address,
            as: 'address',
            where: {
              country: {
                [Op.in]: countryList,
              },
            },
          },
        ],
        transaction,
      });

      await transaction.commit();
      return employees;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }
}

export default new EmployeeService();

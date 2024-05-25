import { Transaction, LOCK } from 'sequelize';
import Employee, { EmployeeCreationAttributes } from '../models/employee';
import Address, { AddressCreationAttributes } from '../models/address';
import sequelize from '../models';

class EmployeeRepository {
  public async create(data: EmployeeCreationAttributes, addressData: AddressCreationAttributes): Promise<Employee> {
    const transaction = await sequelize.transaction();
    try {
      const employee = await Employee.create(data, { transaction });
      await Address.create({ ...addressData, employee_id: employee.employee_id }, { transaction });
      await transaction.commit();
      return employee;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  public async findAll(): Promise<Employee[]> {
    return Employee.findAll({ include: [{ model: Address, as: 'address' }] });
  }

  public async findById(id: string): Promise<Employee | null> {
    return Employee.findByPk(id, { include: [{ model: Address, as: 'address' }] });
  }

  public async update(id: string, data: Partial<Employee>, addressData: Partial<Address>): Promise<number> {
    const transaction = await sequelize.transaction();
    try {
      const employee = await Employee.findByPk(id, {
        transaction,
        lock: transaction.LOCK.UPDATE,
        include: [{ model: Address, as: 'address' }],
      });
      if (!employee) {
        await transaction.commit();
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

  public async delete(id: string): Promise<number> {
    const transaction = await sequelize.transaction();
    try {
      const employee = await Employee.findByPk(id, {
        transaction,
        lock: transaction.LOCK.UPDATE,
        include: [{ model: Address, as: 'address' }],
      });
      if (!employee) {
        await transaction.commit();
        return 0;
      }
      await Address.destroy({ where: { employee_id: id }, transaction });
      const affectedCount = await Employee.destroy({ where: { employee_id: id }, transaction });
      await transaction.commit();
      return affectedCount;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }
}

export default new EmployeeRepository();

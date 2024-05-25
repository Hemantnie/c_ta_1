import Employee, { EmployeeCreationAttributes } from '../models/employee';
import Address, { AddressCreationAttributes } from '../models/address';
import { Transaction } from 'sequelize';

class EmployeeRepository {
  public async create(data: EmployeeCreationAttributes, addressData: AddressCreationAttributes, transaction?: Transaction): Promise<Employee> {
    const employee = await Employee.create(data, { transaction });
    await Address.create({ ...addressData, employee_id: employee.employee_id }, { transaction });
    return employee;
  }

  public async findAll(transaction?: Transaction): Promise<Employee[]> {
    return Employee.findAll({ include: [{ model: Address, as: 'address' }], transaction });
  }

  public async findById(id: string, transaction?: Transaction): Promise<Employee | null> {
    return Employee.findByPk(id, { include: [{ model: Address, as: 'address' }], transaction });
  }

  public async update(id: string, data: Partial<Employee>, addressData: Partial<Address>, transaction?: Transaction): Promise<number> {
    const employee = await Employee.findByPk(id, { transaction });
    if (!employee) return 0;
    await Employee.update(data, { where: { employee_id: id }, transaction });
    await Address.update(addressData, { where: { employee_id: id }, transaction });
    return 1;
  }

  public async delete(id: string, transaction?: Transaction): Promise<number> {
    const employee = await Employee.findByPk(id, { transaction });
    if (!employee) return 0;
    await Address.destroy({ where: { employee_id: id }, transaction });
    await Employee.destroy({ where: { employee_id: id }, transaction });
    return 1;
  }
}

export default new EmployeeRepository();

import Employee, { EmployeeCreationAttributes } from '../models/employee';
import Address, { AddressCreationAttributes } from '../models/address';
import { Op, Transaction } from 'sequelize';

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
    try{
      const employee = await Employee.findByPk(id, {
        transaction,
        lock: transaction?.LOCK.UPDATE,
      });
      if (!employee) {
        await transaction?.rollback();
        return 0;
      }
      await Employee.update(data, { where: { employee_id: id }, transaction });
      await Address.update(addressData, { where: { employee_id: id }, transaction });
      transaction?.commit();
      return 1;
    }catch (error) {
      await transaction?.rollback();
      throw error;
    }
  }

  public async delete(id: string, transaction?: Transaction): Promise<number> {
    try {
      const employee = await Employee.findByPk(id, {
        transaction,
        lock: transaction?.LOCK.UPDATE,
      });

      if (!employee) {
        await transaction?.rollback();
        return 0;
      }

      await Address.destroy({ where: { employee_id: id }, transaction });
      await Employee.destroy({ where: { employee_id: id }, transaction });

      await transaction?.commit();
      return 1;
    } catch (error) {
      await transaction?.rollback();
      throw error;
    }
  }

  public async getEmployeesInCountries(countries:string[], transaction?:Transaction):Promise<Employee[]>{
    return Employee.findAll({
      include: [
        {
          model: Address,
          as: 'address',
          where: {
            country: {
              [Op.in]: countries,
            },
          },
        },
      ],
      transaction,
    });
  }
}

export default new EmployeeRepository();

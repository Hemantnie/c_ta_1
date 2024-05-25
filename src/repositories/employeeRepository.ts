import { Transaction } from 'sequelize';
import Employee, { EmployeeCreationAttributes } from '../models/employee';
import sequelize from '../models';

class EmployeeRepository {
  public async create(data: EmployeeCreationAttributes): Promise<Employee> {
    const transaction = await sequelize.transaction();
    try {
      const employee = await Employee.create(data, { transaction });
      await transaction.commit();
      return employee;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  public async findAll(): Promise<Employee[]> {
    return Employee.findAll();
  }

  public async findById(id: string): Promise<Employee | null> {
    return Employee.findByPk(id);
  }

  public async update(id: string, data: Partial<Employee>): Promise<number> {
    const transaction = await sequelize.transaction();
    try {
      const [affectedCount] = await Employee.update(data, { where: { employee_id: id }, transaction });
      await transaction.commit();
      return affectedCount;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  public async delete(id: string): Promise<number> {
    return Employee.destroy({ where: { employee_id: id } });
  }
}

export default new EmployeeRepository();

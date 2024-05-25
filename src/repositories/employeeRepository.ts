import Employee, { EmployeeCreationAttributes } from '../models/employee';

class EmployeeRepository {
  public async create(data: EmployeeCreationAttributes): Promise<Employee> {
    return Employee.create(data);
  }

  public async findAll(): Promise<Employee[]> {
    return Employee.findAll();
  }

  public async findById(id: string): Promise<Employee | null> {
    return Employee.findByPk(id);
  }

  public async update(id: string, data: Partial<Employee>): Promise<number> {
    const [affectedCount] = await Employee.update(data, { where: { employee_id: id } });
    return affectedCount;
  }

  public async delete(id: string): Promise<number> {
    return Employee.destroy({ where: { employee_id: id } });
  }
}

export default new EmployeeRepository();

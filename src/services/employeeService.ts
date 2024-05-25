import EmployeeRepository from '../repositories/employeeRepository';
import Employee, { EmployeeCreationAttributes } from '../models/employee';

class EmployeeService {
  public async createEmployee(data: EmployeeCreationAttributes): Promise<Employee> {
    return EmployeeRepository.create(data);
  }

  public async getAllEmployees(): Promise<Employee[]> {
    return EmployeeRepository.findAll();
  }

  public async getEmployeeById(id: string): Promise<Employee | null> {
    return EmployeeRepository.findById(id);
  }

  public async updateEmployee(id: string, data: Partial<Employee>): Promise<number> {
    return EmployeeRepository.update(id, data);
  }

  public async deleteEmployee(id: string): Promise<number> {
    return EmployeeRepository.delete(id);
  }
}

export default new EmployeeService();

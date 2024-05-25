import { Request, Response } from 'express';
import EmployeeService from '../services/employeeService';
import { EmployeeCreationAttributes } from '../models/employee';

export const createEmployee = async (req: Request, res: Response) => {
  try {
    const employeeData: EmployeeCreationAttributes = req.body;
    const employee = await EmployeeService.createEmployee(employeeData);
    res.status(201).json(employee);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getEmployees = async (req: Request, res: Response) => {
  try {
    const employees = await EmployeeService.getAllEmployees();
    res.status(200).json(employees);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getEmployeeById = async (req: Request, res: Response) => {
  try {
    const employee = await EmployeeService.getEmployeeById(req.params.id);
    if (employee) {
      res.status(200).json(employee);
    } else {
      res.status(404).json({ error: 'Employee not found' });
    }
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const updateEmployee = async (req: Request, res: Response) => {
  try {
    const updated = await EmployeeService.updateEmployee(req.params.id, req.body);
    if (updated) {
      const updatedEmployee = await EmployeeService.getEmployeeById(req.params.id);
      res.status(200).json(updatedEmployee);
    } else {
      res.status(404).json({ error: 'Employee not found' });
    }
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteEmployee = async (req: Request, res: Response) => {
  try {
    const deleted = await EmployeeService.deleteEmployee(req.params.id);
    if (deleted) {
      res.status(204).send();
    } else {
      res.status(404).json({ error: 'Employee not found' });
    }
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

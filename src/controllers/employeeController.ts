import { Request, Response } from 'express';
import Employee from '../models/employee';

export const createEmployee = async (req: Request, res: Response) => {
  try {
    const employee = await Employee.create({ ...req.body });
    res.status(201).json(employee);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getEmployees = async (req: Request, res: Response) => {
  try {
    const employees = await Employee.findAll();
    res.status(200).json(employees);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getEmployeeById = async (req: Request, res: Response) => {
  try {
    const employee = await Employee.findByPk(req.params.id);
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
    const [updated] = await Employee.update(req.body, {
      where: { employee_id: req.params.id },
    });
    if (updated) {
      const updatedEmployee = await Employee.findByPk(req.params.id);
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
    const deleted = await Employee.destroy({
      where: { employee_id: req.params.id },
    });
    if (deleted) {
      res.status(204).send();
    } else {
      res.status(404).json({ error: 'Employee not found' });
    }
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

import { Request, Response } from 'express';
import EmployeeService from '../services/employeeService';
import { EmployeeCreationAttributes } from '../models/employee';
import { AddressCreationAttributes } from '../models/address';

// Type guard to check if an error is an instance of Error
function isError(error: unknown): error is Error {
  return error instanceof Error;
}

export const createEmployee = async (req: Request, res: Response) => {
  try {
    const employeeData: EmployeeCreationAttributes = req.body;
    const addressData: AddressCreationAttributes = req.body.address;
    const employee = await EmployeeService.createEmployee(employeeData, addressData);
    res.status(201).json(employee);
  } catch (error) {
    if (isError(error) && error.message === 'Invalid email format') {
      res.status(400).json({ error: error.message });
    } else {
      res.status(500).json({ error: isError(error) ? error.message : 'Unknown error' });
    }
  }
};

export const getEmployees = async (req: Request, res: Response) => {
  try {
    const employees = await EmployeeService.getAllEmployees();
    res.status(200).json(employees);
  } catch (error) {
    res.status(500).json({ error: isError(error) ? error.message : 'Unknown error' });
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
  } catch (error) {
    res.status(500).json({ error: isError(error) ? error.message : 'Unknown error' });
  }
};

export const updateEmployee = async (req: Request, res: Response) => {
  try {
    const updated = await EmployeeService.updateEmployee(req.params.id, req.body, req.body.address);
    if (updated) {
      const updatedEmployee = await EmployeeService.getEmployeeById(req.params.id);
      res.status(200).json(updatedEmployee);
    } else {
      res.status(404).json({ error: 'Employee not found' });
    }
  } catch (error) {
    if (isError(error) && error.message === 'Invalid email format') {
      res.status(400).json({ error: error.message });
    } else {
      res.status(500).json({ error: isError(error) ? error.message : 'Unknown error' });
    }
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
  } catch (error) {
    res.status(500).json({ error: isError(error) ? error.message : 'Unknown error' });
  }
};

export const getPublicHolidays = async (req: Request, res: Response) => {
  try {
    const { id, year } = req.params;
    const holidays = await EmployeeService.getPublicHolidaysForEmployee(id, parseInt(year));
    res.status(200).json(holidays);
  } catch (error) {
    res.status(500).json({ error: isError(error) ? error.message : 'Unknown error' });
  }
};

export const getEmployeesWithUpcomingHolidays = async (req: Request, res: Response) => {
  try {
    const employees = await EmployeeService.getEmployeesWithUpcomingHolidays();
    res.status(200).json(employees);
  } catch (error) {
    res.status(500).json({ error: isError(error) ? error.message : 'Unknown error' });
  }
};

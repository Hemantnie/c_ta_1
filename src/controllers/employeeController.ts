import { Request, Response } from 'express';
import EmployeeService from '../services/employeeService';
import { EmployeeCreationAttributes } from '../models/employee';
import { AddressCreationAttributes } from '../models/address';
import { isError } from '../utils/utils';

/**
 * API to create a new Employee with Address
 * @param req Contains object with properties EmployeeCreationAttributes and AddressCreationAttributes
 * @param res returns newly  created Employees with Id
 */
export const createEmployee = async (req: Request, res: Response) => {
  try {
    const employeeData: EmployeeCreationAttributes = req.body;
    const addressData: AddressCreationAttributes = req.body.address;
    const employee = await EmployeeService.createEmployee(employeeData, addressData);
    res.status(201).json(employee);
  } catch (error) {
    if (isError(error) && error.message === 'Invalid email format') {
      res.status(400).json({ error: error.message });
    } else if (isError(error) && error.message === 'Email already exists') {
      res.status(409).json({ error: error.message });
    } else {
      res.status(500).json({ error: isError(error) ? error.message : 'Unknown error' });
    }
  }
};
/**
 * To get the dates in the given time zones we use the timezones mentioned in the Momentjs timezone
 * https://momentjs.com/timezone/docs/
 * @param req 
 * @param res 
 * @returns : List all all the employees
 */
export const getEmployees = async (req: Request, res: Response) => {
  try {
    const employees = await EmployeeService.getAllEmployees();
    res.status(200).json(employees);
  } catch (error) {
    res.status(500).json({ error: isError(error) ? error.message : 'Unknown error' });
  }
};

/**
 * Get the employee by Id also takes timeZones if passed
 * @param req ID of the employee
 * @param res 
 * @returns : Single employee 
 */

export const getEmployeeById = async (req: Request, res: Response) => {
  try {
    const employee = await EmployeeService.getEmployeeById(req.params.id);
    if (employee) {
      console.log(employee.getSalaryInDollers());
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

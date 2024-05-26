import { Router } from 'express';
import {
  createEmployee,
  getEmployees,
  getEmployeeById,
  updateEmployee,
  deleteEmployee,
  getPublicHolidays,
  getEmployeesWithUpcomingHolidays,
} from '../controllers/employeeController';
import { convertToTimezone } from '../middleware/timezoneMiddleware';

const router = Router();

router.post('/employees', createEmployee);
router.get('/employees', convertToTimezone, getEmployees);
router.get('/employees/upcoming-holidays', getEmployeesWithUpcomingHolidays);
router.get('/employees/:id', convertToTimezone, getEmployeeById);
router.put('/employees/:id', updateEmployee);
router.delete('/employees/:id', deleteEmployee);
router.get('/employees/:id/holidays/:year', getPublicHolidays);


export default router;

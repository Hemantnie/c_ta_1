import cron from 'node-cron';
import EmployeeService from '../services/employeeService';
/**
   * Executes every 2 seconds
   * @returns .
   */
cron.schedule('*/2 * * * * *', async () => {
  console.log('_________Running scheduled job: Fetching employees with upcoming public holidays_________');
  try {
    const employees = await EmployeeService.getEmployeesWithUpcomingHolidays();
    if (employees.length === 0) {
      console.log('No employees with upcoming public holidays found.');
    } else {
      employees.forEach(employee => {
        console.log(`Employee: ${employee.name}, Email: ${employee.email}, Position: ${employee.position} Address: ${employee.address?.country}`);
      });
    }
  } catch (error) {
    console.error('Error fetching employees with upcoming public holidays:', error);
  }
});

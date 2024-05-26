# Employee Management API

This is an Employee Management API built with Node.js, TypeScript, Sequelize, and SQLite. The API supports creating, reading, updating, and deleting employee records, ensuring data integrity through transactions and row-level locking. The API also supports email validation and timezone conversion for date fields.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [Testing](#testing)
- [Technologies Used](#technologies-used)
- [Cron job to send mail for upcoming public holidays](#cron-job-to-send-mail-for-upcoming-public-holidays)
- [Future Enhancements](#future-enhancements)

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/Hemantnie/c_ta_1.git
   cd c_ta_1
   ```

2. Install dependencies:
    ```bash
       npm install
    ```
3. Seed the database:
    ```bash
        npm run seed:all
    ```

## Usage
1. Start the server:
    ```bash
        npm start
    ```
2. The API will be running at `http://localhost:3000`.

## API Endpoints

### Create Employee
* URL: `/api/employees`
* Method: `POST`
* Body:
    ```json
    {
      "name": "Ravi Teju",
      "position": "Developer",
      "email": "Ravi.Teju@example.com",
      "salary": 60000
    }
    ```
* Responses
    *   `201 Created` on success
    *   `400 Bad Request` if the email format is invalid

### Get All Employees
* URL: `/api/employees`
* Method: `GET`
* Responses:
    * `200 OK` on success

### Get Employee by ID
* URL: `/api/employees/:id`
* Method: `GET`
* Responses:
    * `200 OK` on success
    * `404 Not` Found if the employee does not exist

### Update Employee

* URL: `/api/employees/:id`
* Method: `PUT`
* Body:
    ```json
    {
      "name": "Ravi Teju",
      "position": "Developer",
      "email": "Ravi.Teju@example.com",
      "salary": 60000
    }
    ```
* Responses
    * `200 OK` on success
    * `400 Bad` Request if the email format is invalid
    * `404 Not Found` if the employee does not exist

### Delete Employees
* URL: `/api/employees/:id`
* Method: `DELETE`
* Responses:
    * `200 OK` on success
    * `404 Not Found` if the employee does not exist

### Get Public Holidays for a given employee
* URL: `/api/employees/:id/holidays/:year`
* Method: `GET`
* Responses:
    * `200 OK` on success

### Get Employee with upcoming public holidays in next 7 days
* URL: `/api/employees/upcoming-holidays`
* Method: `GET`
* Responses:
    * `200 OK` on success
 
## Testing
* To run the tests, use the following command:
```bash
   npm test
```
* Also a Postman collection is attached to be imported under the postman folder.


##  Technologies Used

* Node.js
* TypeScript
* Express
* Sequelize
* SQLite
* Jest
* Supertest
* Moment.js (for timezone conversion)
* Node-cron (for cron jobs)

##  Cron job to send mail for upcoming public holidays
* Added a new Table to store Public Holidays per country per year.
* To add a new public holiday for a country, we can update the `holidays.json` file and run the seed script to update the public holidays.
* Public holidays can be fetch from any source and updated in the json file.
* Added a cron job `scheduleJob.ts` to poll the API to get the employees with upcoming public holidays
* If there are any employee, we can have a third party service we 

## Future Enhancements
* Added hooks in employee to change the timeZones into UTC before storing
* We need middleware to convert the date-time fields from UTC to the user's local timezone when fetching data.
* We can use third party services to get the timezone of requetse uedser basbed on IP* 
* User transaction and locks to update the data
* The error handling could have been better by adding a new Error classes.
* Add documentation
* Fix timezone issue with Holidays.
* Addd database indexing and contraints.

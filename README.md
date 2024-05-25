# Employee Management API

This is an Employee Management API built with Node.js, TypeScript, Sequelize, and SQLite. The API supports creating, reading, updating, and deleting employee records, ensuring data integrity through transactions and row-level locking. The API also supports email validation and timezone conversion for date fields.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [Testing](#testing)
- [Project Structure](#project-structure)
- [Technologies Used](#technologies-used)
- [License](#license)

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
3. Initialize the SQLite database:
    ```bash
        npx sequelize-cli db:migrate
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


## Testing
To run the tests, use the following command:
```bash
   npm test
```

##  Technologies Used

* Node.js
* TypeScript
* Express
* Sequelize
* SQLite
* Jest
* Supertest
* Moment.js (for timezone conversion)

## Future Enhancements / Notes-
* Added hooks in employee to change the timeZones into UTC before storing
* We need middleware to convert the date-time fields from UTC to the user's local timezone when fetching data.
* We can use third party services to get the timezone of requetse uedser basbed on IP* 
* User transaction and locks to update the data
* The error handling could have been better by adding a new Error classes.
* Create a  utils methods for timezone and validations
* Fix skipped test
* Fix timezone issue with Holiday.
* Add documentation

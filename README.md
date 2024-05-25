How to Execute the project -> 
npm start

How to run tests ?
npm test

- Added hooks in employee to change the timeZones into UTC before storing
- We need middleware to convert the date-time fields from UTC to the user's local timezone when fetching data.
- We can use third party services to get the timezone of requetse uedser basbed on IP

- User transaction and locks to update the data
- The error handling could have been better by adding a new Error classes.


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
   git clone https://github.com/yourusername/employee-management.git
   cd employee-management
   ```

2. Install dependencies:

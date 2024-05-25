How to Execute the project -> 
npm start

How to run tests ?
npm test

- Added hooks in employee to change the timeZones into UTC before storing
- We need middleware to convert the date-time fields from UTC to the user's local timezone when fetching data.
- We can use third party services to get the timezone of requetse uedser basbed on IP

- User transaction and locks to update the data
- The error handling could have been better by adding a new Error classes.

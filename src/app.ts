import express from 'express';
import bodyParser from 'body-parser';
import employeeRoutes from './routes/employeeRoutes';
import sequelize from './models';

const app = express();
const PORT = 3000;

app.use(bodyParser.json());
app.use('/api', employeeRoutes);

sequelize.sync().then(() => {
  console.log('Database synced');
  if (process.env.NODE_ENV !== 'test') {
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  }
});

export default app;

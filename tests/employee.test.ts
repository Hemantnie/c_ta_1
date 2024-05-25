import request from 'supertest';
import app from '../src/app';
import sequelize from '../src/models';

beforeAll(async () => {
  await sequelize.sync({ force: true });
});

describe('Employee API', () => {
  let employeeId: string;

  it('should create a new employee', async () => {
    const res = await request(app)
      .post('/api/employees')
      .send({
        name: 'John Doe',
        position: 'Developer',
        email: 'john.doe@example.com',
        salary: 60000,
      });
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('employee_id');
    employeeId = res.body.employee_id;
  });

  it('should retrieve all employees', async () => {
    const res = await request(app).get('/api/employees');
    expect(res.status).toBe(200);
    expect(res.body.length).toBeGreaterThan(0);
  });

  it('should retrieve an employee by ID', async () => {
    const res = await request(app).get(`/api/employees/${employeeId}`);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('employee_id', employeeId);
  });

  it('should update an employee', async () => {
    const res = await request(app)
      .put(`/api/employees/${employeeId}`)
      .send({
        name: 'Jane Doe',
        position: 'Senior Developer',
        email: 'jane.doe@example.com',
        salary: 80000,
      });
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('name', 'Jane Doe');
  });

  it('should delete an employee', async () => {
    const res = await request(app).delete(`/api/employees/${employeeId}`);
    expect(res.status).toBe(204);
  });

  it('should return 404 when retrieving a deleted employee', async () => {
    const res = await request(app).get(`/api/employees/${employeeId}`);
    expect(res.status).toBe(404);
  });
});

afterAll(async () => {
  await sequelize.close();
});

import request from 'supertest';
import app from '../src/app';
import sequelize from '../src/models';
import moment from 'moment-timezone';

beforeAll(async () => {
  await sequelize.sync({ force: true });
});

describe('Employee API', () => {
  let employeeId: string;
  const employeeData = {
    name: 'John Doe',
    position: 'Developer',
    email: 'john.doe@example.com',
    salary: 60000,
  };

  it('should create a new employee', async () => {
    const res = await request(app)
      .post('/api/employees')
      .send(employeeData);
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

  describe('Timezone conversion', () => {
    beforeAll(async () => {
      const res = await request(app)
        .post('/api/employees')
        .send(employeeData);
      employeeId = res.body.employee_id;
    });

    it('should retrieve employee with converted created_at and modified_at in America/New_York timezone', async () => {
      const res = await request(app).get(`/api/employees/${employeeId}?timezone=America/New_York`);
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('created_at');
      expect(res.body).toHaveProperty('modified_at');

      const createdAtNy = moment.utc(res.body.created_at).tz('America/New_York').format();
      const modifiedAtNy = moment.utc(res.body.modified_at).tz('America/New_York').format();
      const expectedCreatedAt = moment.utc(res.body.created_at).tz('America/New_York').format('YYYY-MM-DDTHH:mm:ssZ');
      const expectedModifiedAt = moment.utc(res.body.modified_at).tz('America/New_York').format('YYYY-MM-DDTHH:mm:ssZ');

      expect(createdAtNy).toBe(expectedCreatedAt);
      expect(modifiedAtNy).toBe(expectedModifiedAt);
    });

    it('should retrieve employee with converted created_at and modified_at in Asia/Tokyo timezone', async () => {
      const res = await request(app).get(`/api/employees/${employeeId}?timezone=Asia/Tokyo`);
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('created_at');
      expect(res.body).toHaveProperty('modified_at');

      const createdAtTokyo = moment.utc(res.body.created_at).tz('Asia/Tokyo').format();
      const modifiedAtTokyo = moment.utc(res.body.modified_at).tz('Asia/Tokyo').format();
      const expectedCreatedAt = moment.utc(res.body.created_at).tz('Asia/Tokyo').format('YYYY-MM-DDTHH:mm:ssZ');
      const expectedModifiedAt = moment.utc(res.body.modified_at).tz('Asia/Tokyo').format('YYYY-MM-DDTHH:mm:ssZ');

      expect(createdAtTokyo).toBe(expectedCreatedAt);
      expect(modifiedAtTokyo).toBe(expectedModifiedAt);
    });
  });
});

afterAll(async () => {
  await sequelize.close();
});

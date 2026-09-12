import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

export const ENV = {
  BASE_URL: process.env.BASE_URL || 'http://localhost:3000',
  BASE_URL_SAMPLE: process.env.BASE_URL_SAMPLE || 'https://opensource-demo.orangehrmlive.com',
  API_BASE_URL: process.env.API_BASE_URL || 'http://localhost:8000',
  DB: {
    HOST: process.env.DB_HOST || 'localhost',
    PORT: parseInt(process.env.DB_PORT || '5432', 10),
    NAME: process.env.DB_NAME || 'meta_pricing_db',
    USER: process.env.DB_USER || 'postgres',
    PASSWORD: process.env.DB_PASSWORD || 'secret',
  },
  USERS: {
    ADMIN: {
      EMAIL: process.env.ADMIN_EMAIL || 'admin@example.com',
      PASSWORD: process.env.ADMIN_PASSWORD || 'Password123!',
    },
    AGENT: {
      EMAIL: process.env.AGENT_EMAIL || 'agent@example.com',
      PASSWORD: process.env.AGENT_PASSWORD || 'Password123!',
    },
    SUPERVISOR: {
      EMAIL: process.env.SUPERVISOR_EMAIL || 'supervisor@example.com',
      PASSWORD: process.env.SUPERVISOR_PASSWORD || 'Password123!',
    },
  },
  IS_CI: process.env.CI === 'true',
};

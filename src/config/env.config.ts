import dotenv from 'dotenv';
import path from 'path';

// Determine the environment (default to 'qa')
const environment = process.env.TEST_ENV || 'qa';

// Construct the path to the environment-specific .env file
const envFilePath = path.resolve(process.cwd(), `.env.${environment}`);

// Load environment variables
dotenv.config({ path: envFilePath });

export interface AppConfig {
  ENV: string;
  BASE_URL: string;
  STANDARD_USER: string;
  LOCKED_USER: string;
  PROBLEM_USER: string;
  PERF_USER: string;
  PASSWORD: string;
  DEFAULT_TIMEOUT: number;
  HEADLESS: boolean;
  VIEWPORT_WIDTH: number;
  VIEWPORT_HEIGHT: number;
  LOG_LEVEL: string;
}

export const Config: AppConfig = {
  ENV: process.env.ENV || environment,
  BASE_URL: process.env.BASE_URL || 'https://www.saucedemo.com',
  STANDARD_USER: process.env.STANDARD_USER || 'standard_user',
  LOCKED_USER: process.env.LOCKED_USER || 'locked_out_user',
  PROBLEM_USER: process.env.PROBLEM_USER || 'problem_user',
  PERF_USER: process.env.PERF_USER || 'performance_glitch_user',
  PASSWORD: process.env.PASSWORD || 'secret_sauce',
  DEFAULT_TIMEOUT: Number(process.env.DEFAULT_TIMEOUT) || 30000,
  HEADLESS: process.env.HEADLESS !== 'false',
  VIEWPORT_WIDTH: Number(process.env.VIEWPORT_WIDTH) || 1920,
  VIEWPORT_HEIGHT: Number(process.env.VIEWPORT_HEIGHT) || 1080,
  LOG_LEVEL: process.env.LOG_LEVEL || 'info',
};


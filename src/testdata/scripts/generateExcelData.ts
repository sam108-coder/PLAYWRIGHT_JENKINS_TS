import * as XLSX from 'xlsx';
import path from 'path';
import fs from 'fs';

const excelFilePath = path.resolve(__dirname, '../excel/testdata.xlsx');

const loginData = [
  {
    testCaseId: 'TC_LOGIN_01',
    description: 'Valid standard user login should succeed and redirect to inventory',
    username: 'standard_user',
    password: 'secret_sauce',
    expectedOutcome: 'SUCCESS',
    expectedErrorMessage: '',
    severity: 'critical',
  },
  {
    testCaseId: 'TC_LOGIN_02',
    description: 'Locked out user login should show locked account error',
    username: 'locked_out_user',
    password: 'secret_sauce',
    expectedOutcome: 'FAILURE',
    expectedErrorMessage: 'Epic sadface: Sorry, this user has been locked out.',
    severity: 'normal',
  },
  {
    testCaseId: 'TC_LOGIN_03',
    description: 'Invalid credentials should display mismatch error',
    username: 'standard_user',
    password: 'invalid_password_123',
    expectedOutcome: 'FAILURE',
    expectedErrorMessage: 'Epic sadface: Username and password do not match any user in this service',
    severity: 'normal',
  },
  {
    testCaseId: 'TC_LOGIN_04',
    description: 'Empty username should show username required error',
    username: '',
    password: 'secret_sauce',
    expectedOutcome: 'FAILURE',
    expectedErrorMessage: 'Epic sadface: Username is required',
    severity: 'minor',
  },
  {
    testCaseId: 'TC_LOGIN_05',
    description: 'Empty password should show password required error',
    username: 'standard_user',
    password: '',
    expectedOutcome: 'FAILURE',
    expectedErrorMessage: 'Epic sadface: Password is required',
    severity: 'minor',
  },
];

const checkoutData = [
  {
    testCaseId: 'TC_CHK_01',
    description: 'Purchase single item - Sauce Labs Backpack',
    products: 'Sauce Labs Backpack',
    firstName: 'Alex',
    lastName: 'Morgan',
    postalCode: '10001',
    expectedOutcome: 'SUCCESS',
  },
  {
    testCaseId: 'TC_CHK_02',
    description: 'Purchase multiple items - Backpack and Bike Light',
    products: 'Sauce Labs Backpack;Sauce Labs Bike Light',
    firstName: 'Samantha',
    lastName: 'Ray',
    postalCode: '90210',
    expectedOutcome: 'SUCCESS',
  },
  {
    testCaseId: 'TC_CHK_03',
    description: 'Purchase single item - Sauce Labs Bolt T-Shirt',
    products: 'Sauce Labs Bolt T-Shirt',
    firstName: 'Liam',
    lastName: 'Johnson',
    postalCode: '75001',
    expectedOutcome: 'SUCCESS',
  },
];

// Ensure directory exists
const dir = path.dirname(excelFilePath);
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir, { recursive: true });
}

const workbook = XLSX.utils.book_new();

const loginSheet = XLSX.utils.json_to_sheet(loginData);
XLSX.utils.book_append_sheet(workbook, loginSheet, 'LoginData');

const checkoutSheet = XLSX.utils.json_to_sheet(checkoutData);
XLSX.utils.book_append_sheet(workbook, checkoutSheet, 'CheckoutData');

XLSX.writeFile(workbook, excelFilePath);

console.log(`Excel test data generated successfully at: ${excelFilePath}`);


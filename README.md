# Saucedemo Test Automation Framework (Playwright + TypeScript)

An enterprise-grade, industry-standard UI Test Automation Framework built with **Playwright**, **TypeScript**, **Data-Driven Testing (Excel)**, **Multi-Environment configuration**, **Allure Reporting**, and **Jenkins CI/CD Declarative Pipeline**.

---

## 🏗️ Project Architecture & Structure

```
PLAYWRIGHT_JENKINS_TS/
├── .env.dev                        # Environment configuration for DEV
├── .env.qa                         # Environment configuration for QA / Staging
├── .env.prod                       # Environment configuration for Production
├── .env.example                    # Environment template
├── .gitignore                      # Git ignore rules for reports, logs, node_modules
├── Jenkinsfile                     # Production Jenkins Declarative CI/CD Pipeline
├── package.json                    # Project dependencies and test execution scripts
├── playwright.config.ts            # Central Playwright runner & reporter configuration
├── tsconfig.json                   # Strict TypeScript compiler options & path aliases
├── src/
│   ├── config/
│   │   └── env.config.ts           # Dynamic multi-environment loader & typed config
│   ├── constants/
│   │   └── appConstants.ts         # Centralized application constants, routes & error text
│   ├── fixtures/
│   │   └── testFixtures.ts         # Custom Playwright fixtures injecting Page Objects
│   ├── pages/
│   │   ├── BasePage.ts             # Base page actions, explicit waits, screenshots & logs
│   │   ├── LoginPage.ts            # Saucedemo login page locators & methods
│   │   ├── ProductsPage.ts         # Inventory list, sorting, add/remove, badge counts
│   │   ├── CartPage.ts             # Shopping cart items, removal, proceed to checkout
│   │   ├── CheckoutPage.ts         # Checkout Step 1 (Info) & Step 2 (Price & Tax Overview)
│   │   └── CheckoutCompletePage.ts # Order confirmation & thank you screen
│   ├── testdata/
│   │   ├── excel/
│   │   │   └── testdata.xlsx       # Excel workbook with LoginData and CheckoutData sheets
│   │   └── scripts/
│   │       └── generateExcelData.ts# Script to programmatically generate/reset test data
│   └── utils/
│       ├── allureHelper.ts         # Allure metadata (epics, stories, severity, steps, attachments)
│       ├── excelUtil.ts            # Fast, typed Excel reader & writer utility
│       └── logger.ts               # Timestamped structured logger (INFO, DEBUG, WARN, ERROR)
└── tests/
    ├── ddt/
    │   ├── loginExcelDdt.spec.ts   # Excel data-driven login test suite
    │   └── checkoutExcelDdt.spec.ts# Excel data-driven purchase test suite
    ├── e2e/
    │   └── endToEndCheckout.spec.ts# Complete end-to-end user checkout journey
    └── functional/
        ├── inventory.spec.ts       # Product inventory, catalog sorting, cart badges
        └── login.spec.ts           # Functional positive/negative authentication tests
```

---

## 🌟 Key Features

1. **Page Object Model (POM)**:
   - Clean separation of UI locators, user actions, and test assertions.
   - Reusable `BasePage` providing built-in waiting, logging, and Allure step wrapping.

2. **Multi-Environment Support**:
   - Seamlessly switch between environments (`dev`, `qa`, `prod`) using `TEST_ENV` environment variable.
   - Typed configuration (`src/config/env.config.ts`) loading variables from `.env.[env]`.

3. **Data-Driven Testing (DDT) with Excel**:
   - Real `.xlsx` files (`src/testdata/excel/testdata.xlsx`) read via SheetJS (`xlsx`).
   - Supports multiple sheets (`LoginData`, `CheckoutData`).
   - Dynamically registers Playwright tests for every row in the spreadsheet.

4. **Allure & HTML Reporting**:
   - Rich reporting with Epic, Feature, Story, Severity hierarchy and custom tags (`@smoke`, `@regression`, `@ddt`, `@e2e`).
   - Automatic failure screenshots and JSON payload attachments.
   - Dual reports: Playwright HTML Report + Allure Interactive Dashboard.

5. **Jenkins CI/CD Declarative Pipeline**:
   - Parameterized pipeline for `ENVIRONMENT`, `BROWSER`, `TEST_SUITE`, `HEADLESS`, and `WORKERS`.
   - Automated dependency and browser installation.
   - Static typechecking step (`npm run typecheck`).
   - Automated Allure report publishing (`allure`) and HTML report archiving (`publishHTML`).

---

## 🚀 Getting Started

### 1. Prerequisites
- **Node.js**: v18 or later
- **npm**: v9 or later
- **Java JDK**: 8+ (required for Allure CLI)

### 2. Installation
Clone the repository and install dependencies:
```bash
npm install
```

Install Playwright browser binaries:
```bash
npx playwright install
```

---

## 🧪 Test Execution Scripts

| Command | Description |
| :--- | :--- |
| `npm test` | Run all tests across configured projects |
| `npm run test:chromium` | Run all tests on Chromium browser |
| `npm run test:firefox` | Run all tests on Firefox browser |
| `npm run test:webkit` | Run all tests on WebKit (Safari) browser |
| `npm run test:headed` | Run tests with visible browser UI |
| `npm run test:smoke` | Run only `@smoke` tagged test cases |
| `npm run test:regression` | Run all `@regression` tagged test cases |
| `npm run test:ddt` | Run Excel Data-Driven tests (`@ddt`) |
| `npm run test:e2e` | Run end-to-end purchase workflows (`@e2e`) |
| `npm run test:dev` | Run test suite against **DEV** environment |
| `npm run test:qa` | Run test suite against **QA** environment (Default) |
| `npm run test:prod` | Run test suite against **PROD** environment |
| `npm run typecheck` | Run TypeScript compiler verification without emitting files |
| `npm run generate:testdata`| Regenerate `testdata.xlsx` from script |

---

## 📊 Viewing Reports

### Allure Report
Generate and open the Allure interactive report:
```bash
# Clean previous results and run tests with Allure listener:
npm run test:allure

# Generate HTML report from results:
npm run allure:generate

# Open the report in default browser:
npm run allure:open

# Or serve live with built-in server:
npm run allure:serve
```

### Playwright HTML Report
```bash
npm run report:playwright
```

---

## ⚙️ Step-by-Step Jenkins & GitHub Integration Guide

### Phase 1: Generate GitHub Personal Access Token (PAT)
GitHub requires a Personal Access Token (or SSH Key) for Jenkins to clone private/public repositories securely:
1. Log in to your **GitHub** account.
2. Click your avatar (top-right) ➔ **Settings**.
3. In the left sidebar, click **Developer settings** ➔ **Personal access tokens** ➔ **Tokens (classic)**.
4. Click **Generate new token** ➔ **Generate new token (classic)**.
5. Provide details:
   - **Note**: `Jenkins-Playwright-Token`
   - **Expiration**: `90 days` or `No expiration`
   - **Scopes**: Select `repo` (Full control) and `admin:repo_hook` (Manage repository hooks).
6. Click **Generate token** and **copy the generated token immediately**.

---

### Phase 2: Install Jenkins Plugins & Configure Tools

#### 1. Install Required Plugins
1. Open Jenkins (`http://localhost:8080`).
2. Navigate to **Manage Jenkins** ➔ **Plugins** (or **Manage Plugins**).
3. Under the **Available plugins** tab, search and install:
   - **NodeJS Plugin**
   - **Allure Jenkins Plugin**
   - **HTML Publisher Plugin**
   - **GitHub Integration Plugin** (typically pre-installed)
4. Click **Install without restart**.

#### 2. Configure Global Tools (NodeJS & Allure)
1. Go to **Manage Jenkins** ➔ **Tools** (or **Global Tool Configuration**).
2. **NodeJS Configuration**:
   - Scroll down to **NodeJS** ➔ Click **Add NodeJS**.
   - **Name**: `NodeJS-20` (or `NodeJS-LTS`).
   - Check **Install automatically**.
   - **Version**: Select `NodeJS 20.x` or latest LTS.
3. **Allure Commandline Configuration**:
   - Scroll down to **Allure Commandline** ➔ Click **Add Allure Commandline**.
   - **Name**: `Allure Commandline`.
   - Check **Install automatically**.
   - **Version policy**: Select `Recommended Allure 2 (2.46.0)`.
4. Click **Save**.

---

### Phase 3: Store GitHub Credentials in Jenkins
1. Go to **Manage Jenkins** ➔ **Credentials** ➔ **System** ➔ **Global credentials (unrestricted)**.
2. Click **Add Credentials** (top right).
3. Set the following fields:
   - **Kind**: `Username with password`
   - **Scope**: `Global (Jenkins, nodes, items, all child items...)`
   - **Username**: Your GitHub username (or email)
   - **Password**: Paste the **GitHub Personal Access Token** generated in Phase 1
   - **ID**: `github-credentials`
   - **Description**: `GitHub Access Token for Playwright Framework`
4. Click **Create**.

---

### Phase 4: Create & Configure the Pipeline Job

#### 1. Create New Job
1. From Jenkins Dashboard, click **New Item**.
2. Enter item name: `Saucedemo-Playwright-Pipeline`.
3. Select **Pipeline** as the project type.
4. Click **OK**.

#### 2. Configure Pipeline Definition
1. Under the **General** tab:
   - (Optional) Check **GitHub project** and paste your repository URL:
     `https://github.com/<your-username>/PLAYWRIGHT_JENKINS_TS/`
2. Scroll down to the **Pipeline** section:
   - **Definition**: Change to **`Pipeline script from SCM`**.
   - **SCM**: Select **Git**.
   - **Repository URL**: `https://github.com/<your-username>/PLAYWRIGHT_JENKINS_TS.git`
   - **Credentials**: Select `github-credentials` (created in Phase 3).
   - **Branches to build**: Change `*/master` to `*/main` (or your active branch).
   - **Script Path**: Set to `Jenkinsfile`.
3. Click **Save**.

---

### Phase 5: (Optional) Configure GitHub Webhook for Automatic Push Trigger

#### In Jenkins:
1. Open `Saucedemo-Playwright-Pipeline` ➔ Click **Configure**.
2. Under **Build Triggers**, check **GitHub hook trigger for GITScm polling**.
3. Click **Save**.

#### In GitHub:
1. Open your repository on GitHub ➔ Click **Settings** ➔ **Webhooks** ➔ **Add webhook**.
2. **Payload URL**: `http://<your-jenkins-public-ip-or-domain>:8080/github-webhook/` *(ensure trailing slash is present)*.
3. **Content type**: `application/json`.
4. **Which events**: Select **Just the push event**.
5. Click **Add webhook**.

---

### Phase 6: Run the Pipeline & View Reports

#### 1. Initial Build & Parameter Discovery
1. Click **Build Now** on the pipeline dashboard.
2. The initial build pulls the repo, parses the declarative parameters block from `Jenkinsfile`, and enables the **Build with Parameters** button.

#### 2. Run Parameterized Builds
1. Click **Build with Parameters**.
2. Choose your run configuration:
   - **`ENVIRONMENT`**: `qa` (default) / `dev` / `prod`
   - **`BROWSER`**: `chromium` (default) / `firefox` / `webkit` / `all`
   - **`TEST_SUITE`**: `all` / `@smoke` / `@regression` / `@ddt` / `@e2e`
   - **`HEADLESS`**: `true` / `false`
   - **`WORKERS`**: `2`
3. Click **Build**.

#### 3. View Interactive Reports & Results
- **Allure Report**: Click **Allure Report** in the build sidebar to open the interactive dashboard showing Epics, Features, test steps, execution timing, JSON attachments, and failure screenshots.
- **Playwright HTML Report**: Click **Playwright HTML Report** in the sidebar for native Playwright traces and test execution summaries.
- **Console Output**: Click **Build #** ➔ **Console Output** to observe live test logs, environment variables, and execution steps.



# E2E Testing

## Description
Expert in end-to-end testing using Playwright and Cypress including test automation, page object models, visual testing, and CI/CD integration.

## Usage Scenario
Use this skill when:
- Writing E2E tests
- Setting up Playwright or Cypress
- Creating page object models
- Visual regression testing
- API testing
- CI/CD test integration

## Instructions

### Playwright

1. **Installation and Setup**
   ```bash
   npm init playwright@latest
   
   npx playwright install
   npx playwright install chromium firefox webkit
   ```

2. **Basic Test**
   ```typescript
   import { test, expect } from '@playwright/test';
   
   test.describe('User Authentication', () => {
     test('should login successfully', async ({ page }) => {
       await page.goto('/login');
       
       await page.fill('[data-testid="email"]', 'user@example.com');
       await page.fill('[data-testid="password"]', 'password123');
       await page.click('[data-testid="login-button"]');
       
       await expect(page).toHaveURL('/dashboard');
       await expect(page.locator('[data-testid="welcome-message"]')).toBeVisible();
     });
     
     test('should show error for invalid credentials', async ({ page }) => {
       await page.goto('/login');
       
       await page.fill('[data-testid="email"]', 'invalid@example.com');
       await page.fill('[data-testid="password"]', 'wrongpassword');
       await page.click('[data-testid="login-button"]');
       
       await expect(page.locator('[data-testid="error-message"]')).toBeVisible();
       await expect(page.locator('[data-testid="error-message"]')).toContainText('Invalid credentials');
     });
   });
   ```

3. **Page Object Model**
   ```typescript
   export class LoginPage {
     constructor(private page: Page) {}
     
     async goto() {
       await this.page.goto('/login');
     }
     
     async login(email: string, password: string) {
       await this.page.fill('[data-testid="email"]', email);
       await this.page.fill('[data-testid="password"]', password);
       await this.page.click('[data-testid="login-button"]');
     }
     
     async expectError(message: string) {
       await expect(this.page.locator('[data-testid="error-message"]')).toContainText(message);
     }
     
     async expectRedirect(path: string) {
       await expect(this.page).toHaveURL(new RegExp(path));
     }
   }
   
   export class DashboardPage {
     constructor(private page: Page) {}
     
     async expectWelcomeMessage() {
       await expect(this.page.locator('[data-testid="welcome-message"]')).toBeVisible();
     }
     
     async logout() {
       await this.page.click('[data-testid="logout-button"]');
     }
   }
   
   import { test, expect } from '@playwright/test';
   import { LoginPage } from './pages/LoginPage';
   import { DashboardPage } from './pages/DashboardPage';
   
   test('login flow', async ({ page }) => {
     const loginPage = new LoginPage(page);
     const dashboardPage = new DashboardPage(page);
     
     await loginPage.goto();
     await loginPage.login('user@example.com', 'password123');
     
     await dashboardPage.expectWelcomeMessage();
   });
   ```

4. **API Testing**
   ```typescript
   import { test, expect } from '@playwright/test';
   
   test.describe('API Tests', () => {
     test('should create user', async ({ request }) => {
       const response = await request.post('/api/users', {
         data: {
           name: 'John Doe',
           email: 'john@example.com',
         },
       });
       
       expect(response.ok()).toBeTruthy();
       
       const user = await response.json();
       expect(user.name).toBe('John Doe');
     });
     
     test('should get users list', async ({ request }) => {
       const response = await request.get('/api/users');
       
       expect(response.ok()).toBeTruthy();
       
       const users = await response.json();
       expect(Array.isArray(users)).toBeTruthy();
     });
   });
   ```

5. **Visual Testing**
   ```typescript
   import { test, expect } from '@playwright/test';
   
   test('visual regression test', async ({ page }) => {
     await page.goto('/dashboard');
     
     await expect(page).toHaveScreenshot('dashboard.png', {
       maxDiffPixels: 100,
     });
     
     await expect(page.locator('[data-testid="chart"]')).toHaveScreenshot('chart.png');
   });
   ```

6. **Configuration**
   ```typescript
   import { defineConfig, devices } from '@playwright/test';
   
   export default defineConfig({
     testDir: './tests',
     fullyParallel: true,
     forbidOnly: !!process.env.CI,
     retries: process.env.CI ? 2 : 0,
     workers: process.env.CI ? 1 : undefined,
     reporter: 'html',
     
     use: {
       baseURL: 'http://localhost:3000',
       trace: 'on-first-retry',
       screenshot: 'only-on-failure',
       video: 'retain-on-failure',
     },
     
     projects: [
       {
         name: 'chromium',
         use: { ...devices['Desktop Chrome'] },
       },
       {
         name: 'firefox',
         use: { ...devices['Desktop Firefox'] },
       },
       {
         name: 'webkit',
         use: { ...devices['Desktop Safari'] },
       },
       {
         name: 'Mobile Chrome',
         use: { ...devices['Pixel 5'] },
       },
     ],
     
     webServer: {
       command: 'npm run dev',
       url: 'http://localhost:3000',
       reuseExistingServer: !process.env.CI,
     },
   });
   ```

### Cypress

1. **Basic Test**
   ```typescript
   describe('User Authentication', () => {
     beforeEach(() => {
       cy.visit('/login');
     });
     
     it('should login successfully', () => {
       cy.get('[data-testid="email"]').type('user@example.com');
       cy.get('[data-testid="password"]').type('password123');
       cy.get('[data-testid="login-button"]').click();
       
       cy.url().should('include', '/dashboard');
       cy.get('[data-testid="welcome-message"]').should('be.visible');
     });
     
     it('should show error for invalid credentials', () => {
       cy.get('[data-testid="email"]').type('invalid@example.com');
       cy.get('[data-testid="password"]').type('wrongpassword');
       cy.get('[data-testid="login-button"]').click();
       
       cy.get('[data-testid="error-message"]')
         .should('be.visible')
         .and('contain', 'Invalid credentials');
     });
   });
   ```

2. **Page Object Model**
   ```typescript
   class LoginPage {
     visit() {
       cy.visit('/login');
     }
     
     fillEmail(email: string) {
       cy.get('[data-testid="email"]').type(email);
     }
     
     fillPassword(password: string) {
       cy.get('[data-testid="password"]').type(password);
     }
     
     submit() {
       cy.get('[data-testid="login-button"]').click();
     }
     
     login(email: string, password: string) {
       this.fillEmail(email);
       this.fillPassword(password);
       this.submit();
     }
     
     expectError(message: string) {
       cy.get('[data-testid="error-message"]').should('contain', message);
     }
   }
   
   export const loginPage = new LoginPage();
   
   import { loginPage } from './pages/LoginPage';
   
   describe('Login', () => {
     it('should login', () => {
       loginPage.visit();
       loginPage.login('user@example.com', 'password123');
       cy.url().should('include', '/dashboard');
     });
   });
   ```

3. **Custom Commands**
   ```typescript
   Cypress.Commands.add('login', (email: string, password: string) => {
     cy.session([email, password], () => {
       cy.visit('/login');
       cy.get('[data-testid="email"]').type(email);
       cy.get('[data-testid="password"]').type(password);
       cy.get('[data-testid="login-button"]').click();
       cy.url().should('include', '/dashboard');
     });
   });
   
   Cypress.Commands.add('dataCy', (value: string) => {
     return cy.get(`[data-testid="${value}"]`);
   });
   
   declare global {
     namespace Cypress {
       interface Chainable {
         login(email: string, password: string): Chainable<void>;
         dataCy(value: string): Chainable<JQuery<HTMLElement>>;
       }
     }
   }
   ```

4. **API Testing**
   ```typescript
   describe('API Tests', () => {
     it('should create user', () => {
       cy.request({
         method: 'POST',
         url: '/api/users',
         body: {
           name: 'John Doe',
           email: 'john@example.com',
         },
       }).then((response) => {
         expect(response.status).to.eq(201);
         expect(response.body.name).to.eq('John Doe');
       });
     });
     
     it('should intercept API call', () => {
       cy.intercept('GET', '/api/users', { fixture: 'users.json' }).as('getUsers');
       
       cy.visit('/users');
       cy.wait('@getUsers');
       
       cy.get('[data-testid="user-list"]').should('have.length', 3);
     });
   });
   ```

5. **Configuration**
   ```typescript
   import { defineConfig } from 'cypress';
   
   export default defineConfig({
     e2e: {
       baseUrl: 'http://localhost:3000',
       specPattern: 'cypress/e2e/**/*.cy.{js,jsx,ts,tsx}',
       viewportWidth: 1280,
       viewportHeight: 720,
       video: true,
       screenshotOnRunFailure: true,
       retries: {
         runMode: 2,
         openMode: 0,
       },
     },
   });
   ```

### Best Practices

1. **Test Structure**
   ```
   tests/
   ├── e2e/
   │   ├── auth/
   │   │   ├── login.spec.ts
   │   │   └── register.spec.ts
   │   ├── dashboard/
   │   │   └── dashboard.spec.ts
   │   └── api/
   │       └── users.spec.ts
   ├── pages/
   │   ├── LoginPage.ts
   │   └── DashboardPage.ts
   └── fixtures/
       └── test-data.ts
   ```

2. **Test Data**
   ```typescript
   export const testUsers = {
     valid: {
       email: 'user@example.com',
       password: 'password123',
     },
     invalid: {
       email: 'invalid@example.com',
       password: 'wrongpassword',
     },
   };
   ```

3. **Fixtures**
   ```typescript
   import { test as base } from '@playwright/test';
   
   interface MyFixtures {
     loginPage: LoginPage;
     authenticatedPage: Page;
   }
   
   export const test = base.extend<MyFixtures>({
     loginPage: async ({ page }, use) => {
       await use(new LoginPage(page));
     },
     
     authenticatedPage: async ({ page }, use) => {
       await page.goto('/login');
       await page.fill('[data-testid="email"]', 'user@example.com');
       await page.fill('[data-testid="password"]', 'password123');
       await page.click('[data-testid="login-button"]');
       await use(page);
     },
   });
   ```

### CI/CD Integration

```yaml
name: E2E Tests

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
   test:
     runs-on: ubuntu-latest
     steps:
       - uses: actions/checkout@v4
       
       - uses: actions/setup-node@v4
         with:
           node-version: '20'
           cache: 'npm'
       
       - run: npm ci
       - run: npx playwright install --with-deps
       
       - run: npm run test:e2e
       
       - uses: actions/upload-artifact@v4
         if: always()
         with:
           name: playwright-report
           path: playwright-report/
           retention-days: 30
```

## Output Contract
- Test files
- Page object models
- Test configuration
- CI/CD integration
- Test utilities

## Constraints
- Use data-testid selectors
- Implement page object model
- Handle async operations properly
- Use meaningful test descriptions
- Keep tests independent

## Examples

### Example 1: Complete Test Suite
```typescript
import { test, expect } from '@playwright/test';
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';

test.describe('User Flow', () => {
  let loginPage: LoginPage;
  let dashboardPage: DashboardPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    dashboardPage = new DashboardPage(page);
  });

  test('complete user journey', async ({ page }) => {
    await test.step('Login', async () => {
      await loginPage.goto();
      await loginPage.login('user@example.com', 'password123');
      await expect(page).toHaveURL('/dashboard');
    });

    await test.step('View dashboard', async () => {
      await dashboardPage.expectWelcomeMessage();
      await expect(page.locator('[data-testid="stats"]')).toBeVisible();
    });

    await test.step('Logout', async () => {
      await dashboardPage.logout();
      await expect(page).toHaveURL('/login');
    });
  });
});
```

### Example 2: API Mocking
```typescript
import { test, expect } from '@playwright/test';

test('should display mocked users', async ({ page }) => {
  await page.route('**/api/users', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify([
        { id: 1, name: 'John Doe' },
        { id: 2, name: 'Jane Smith' },
      ]),
    });
  });

  await page.goto('/users');

  await expect(page.locator('[data-testid="user-item"]')).toHaveCount(2);
});
```

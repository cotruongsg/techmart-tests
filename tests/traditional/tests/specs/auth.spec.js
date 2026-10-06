// @ts-check
const { test, expect } = require("@playwright/test");
const LoginPage = require("../pages/LoginPages");
const RegisterPage = require("../pages/RegisterPage");

test.describe("Authentication", () => {
  test.describe("Login", () => {
    let loginPage;

    test.beforeEach(async ({ page }) => {
      loginPage = new LoginPage(page);
      await loginPage.navigate();
    });

    test("should display login form", async () => {
      await expect(loginPage.page.locator("h1")).toHaveText(
        "Login to TechMart"
      );
      await expect(loginPage.emailInput).toBeVisible();
      await expect(loginPage.passwordInput).toBeVisible();
      await expect(loginPage.submitButton).toBeVisible();
    });

    test("should show error for invalid credentials", async () => {
      await loginPage.login("wrong@email.com", "wrongpassword");
      await expect(loginPage.errorMessage).toBeVisible();
      await expect(loginPage.errorMessage).toContainText("Invalid credentials");
    });

    test("should login successfully with valid credentials", async () => {
      await loginPage.login("demo@techmart.com", "demo123");
      await expect(loginPage.toastMessage).toContainText("Login successful");
      await loginPage.page.waitForURL("/");
    });

    test("should show validation for empty fields", async () => {
      await loginPage.submitButton.click();
      const isInvalid = await loginPage.emailInput.evaluate(
        (el) => !el.checkValidity()
      );
      expect(isInvalid).toBe(true);
    });

    test("should have link to registration page", async () => {
      await expect(loginPage.signUpLink).toBeVisible();
      await loginPage.clickSignUpLink();
      await expect(loginPage.page).toHaveURL("/register.html");
    });

    test("should display demo credentials", async () => {
      await expect(loginPage.demoCredentialsSection).toBeVisible();
      await expect(loginPage.demoCredentialsSection).toContainText(
        "demo@techmart.com"
      );
      await expect(loginPage.demoCredentialsSection).toContainText("demo123");
    });
  });

  test.describe("Registration", () => {
    let registerPage;

    test.beforeEach(async ({ page }) => {
      registerPage = new RegisterPage(page);
      await registerPage.navigate();
    });

    test("should display registration form", async () => {
      await expect(registerPage.page.locator("h1")).toHaveText(
        "Create Your Account"
      );
      await expect(registerPage.nameInput).toBeVisible();
      await expect(registerPage.emailInput).toBeVisible();
      await expect(registerPage.passwordInput).toBeVisible();
      await expect(registerPage.confirmPasswordInput).toBeVisible();
    });

    test("should show error for mismatched passwords", async () => {
      await registerPage.register(
        "Test User",
        "test@example.com",
        "password123",
        "different123"
      );
      await expect(registerPage.errorMessage).toBeVisible();
      await expect(registerPage.errorMessage).toContainText(
        "Passwords do not match"
      );
    });

    test("should register new user successfully", async () => {
      const uniqueEmail = `test${Date.now()}@example.com`;
      await registerPage.register(
        "New User",
        uniqueEmail,
        "password123",
        "password123"
      );
      await expect(registerPage.toastMessage).toContainText("Account created");
      await registerPage.page.waitForURL("/");
    });

    test("should have link to login page", async () => {
      await expect(registerPage.loginLink).toBeVisible();
      await registerPage.clickLoginLink();
      await expect(registerPage.page).toHaveURL("/login.html");
    });
  });

  test.describe("Logout", () => {
    let loginPage;

    test("should logout successfully", async ({ page }) => {
      loginPage = new LoginPage(page);
      await loginPage.navigate();
      await loginPage.login("demo@techmart.com", "demo123");

      await loginPage.page.waitForURL("/");
      await loginPage.page.waitForTimeout(500);

      const authArea = loginPage.page.locator("#authArea");
      await expect(authArea).toContainText("Hi, Demo User");

      const logoutButton = loginPage.page.locator("#logoutBtn");
      await logoutButton.click();

      await expect(authArea).toContainText("Login");
    });
  });
});

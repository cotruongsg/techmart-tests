class LoginPage {
  constructor(page) {
    this.page = page;
    this.emailInput = page.locator("#email");
    this.passwordInput = page.locator("#password");
    this.submitButton = page.locator('button[type="submit"]');
    this.errorMessage = page.locator("#errorMessage");
    this.toastMessage = page.locator("#toast");
    this.signUpLink = page.locator("text=Sign up here");
    this.demoCredentialsSection = page.locator(".demo-credentials");
  }

  async navigate() {
    await this.page.goto("/login.html");
  }

  async login(email, password) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.submitButton.click();
  }

  async getErrorMessage() {
    return this.errorMessage.textContent();
  }

  async getToastMessage() {
    return this.toastMessage.textContent();
  }

  async clickSignUpLink() {
    await this.signUpLink.click();
  }

  async isDemoCredentialsVisible() {
    return await this.demoCredentialsSection.isVisible();
  }
}

module.exports = LoginPage;

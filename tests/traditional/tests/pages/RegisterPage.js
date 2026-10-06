class RegisterPage {
  constructor(page) {
    this.page = page;
    this.nameInput = page.locator("#name");
    this.emailInput = page.locator("#email");
    this.passwordInput = page.locator("#password");
    this.confirmPasswordInput = page.locator("#confirmPassword");
    this.submitButton = page.locator('button[type="submit"]');
    this.errorMessage = page.locator("#errorMessage");
    this.toastMessage = page.locator("#toast");
    this.loginLink = page.locator("text=Login here");
  }

  async navigate() {
    await this.page.goto("/register.html");
  }

  async register(name, email, password, confirmPassword) {
    await this.nameInput.fill(name);
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.confirmPasswordInput.fill(confirmPassword);
    await this.submitButton.click();
  }

  async getErrorMessage() {
    return this.errorMessage.textContent();
  }

  async getToastMessage() {
    return this.toastMessage.textContent();
  }

  async clickLoginLink() {
    await this.loginLink.click();
  }
}

module.exports = RegisterPage;

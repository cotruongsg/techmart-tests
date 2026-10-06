// @ts-check
const { test, expect } = require("@playwright/test");
const CheckoutPage = require("../pages/CheckoutPage");
const LoginPage = require("../pages/LoginPages");
const RegisterPage = require("../pages/RegisterPage");

/**
 * Edge Cases Tests
 * Tests for unusual inputs, boundary conditions, and error handling
 */

test.describe("Edge Cases", () => {
  let checkoutPage;
  let loginPage;
  let registerPage;

  test.beforeEach(async ({ page }) => {
    checkoutPage = new CheckoutPage(page);
    loginPage = new LoginPage(page);
    registerPage = new RegisterPage(page);

    // Clear cart before each test
    await checkoutPage.clearCart();
    await page.goto("/");
  });

  // --- SEARCH EDGE CASES ---

  test("should handle empty search gracefully", async ({ page }) => {
    const searchBtn = page.locator("#searchBtn");

    // Click search without typing anything
    await searchBtn.click();
    await page.waitForTimeout(500);

    // Should still show all products
    const productCards = page.locator(".product-card");
    await expect(productCards).toHaveCount(6);
  });

  test("should show no results for nonsense search", async ({ page }) => {
    const searchInput = page.locator("#searchInput");
    const searchBtn = page.locator("#searchBtn");

    await searchInput.fill("xyznonexistent123");
    await searchBtn.click();
    await page.waitForTimeout(500);

    const productCards = page.locator(".product-card");
    await expect(productCards).toHaveCount(0);
  });

  test("should handle special characters in search", async ({ page }) => {
    const searchInput = page.locator("#searchInput");
    const searchBtn = page.locator("#searchBtn");

    // Try special characters that could break things
    await searchInput.fill('<script>alert("xss")</script>');
    await searchBtn.click();
    await page.waitForTimeout(500);

    // App should not break - just show no results
    const productCards = page.locator(".product-card");
    await expect(productCards).toHaveCount(0);

    // Page should still be functional
    await expect(page.locator(".logo")).toBeVisible();
  });

  test("should handle search with only whitespace", async ({ page }) => {
    const searchInput = page.locator("#searchInput");
    const searchBtn = page.locator("#searchBtn");

    await searchInput.fill("   ");
    await searchBtn.click();
    await page.waitForTimeout(500);

    // Should show all products (whitespace = no filter)
    const productCards = page.locator(".product-card");
    const count = await productCards.count();
    expect(count).toBeGreaterThan(0);
  });

  // --- CART EDGE CASES ---

  test("should handle adding same product multiple times", async ({ page }) => {
    const addButton = page.locator(".add-to-cart-btn").first();

    // Click add to cart three times
    await addButton.click();
    await page.waitForTimeout(300);
    await addButton.click();
    await page.waitForTimeout(300);
    await addButton.click();
    await page.waitForTimeout(500);

    // Cart count should be 3 (quantity increases)
    const cartCount = page.locator("#cartCount").first();
    await expect(cartCount).toHaveText("3");
  });

  test("should not allow checkout with empty cart", async () => {
    // Go directly to checkout with empty cart
    await checkoutPage.navigate();

    // Fill out the form
    await checkoutPage.fillShippingDetails(
      "Test",
      "User",
      "123 Test St",
      "Testville",
      "MI",
      "49501",
      "555-0000"
    );

    await checkoutPage.fillPaymentDetails(
      "Test User",
      "4111111111111111",
      "12/28",
      "123"
    );

    await checkoutPage.placeOrder();

    // Should show error about empty cart
    const toast = page.locator("#toast");
    await expect(toast).toBeVisible();
  });

  // --- FORM VALIDATION EDGE CASES ---

  test("should require all fields for registration", async () => {
    await registerPage.navigate();

    // Try to submit with only email filled
    await registerPage.emailInput.fill("test@example.com");
    await registerPage.submitButton.click();

    // Should stay on register page (validation prevents submit)
    await expect(registerPage.page).toHaveURL(/register/);
  });

  test("should reject duplicate email registration", async () => {
    await registerPage.navigate();

    // Try to register with the demo account email
    await registerPage.register(
      "Another User",
      "demo@techmart.com",
      "password123",
      "password123"
    );

    // Should show error about existing email
    const errorMessage = await registerPage.getErrorMessage();
    expect(errorMessage).toMatch(/already registered|exists/i);
  });

  // --- NAVIGATION EDGE CASES ---

  test("should handle direct URL access to cart page", async ({ page }) => {
    // Navigate directly to cart without adding anything
    await page.goto("/cart.html");

    // Should show empty cart state
    await expect(page.locator(".logo")).toBeVisible();
  });

  test("should preserve cart across page navigation", async ({ page }) => {
    // Add item to cart
    const addButton = page.locator(".add-to-cart-btn").first();
    await addButton.click();
    await page.waitForTimeout(500);

    // Navigate away and back
    await loginPage.navigate();
    await page.goto("/");

    // Cart count should still show 1
    const cartCount = page.locator("#cartCount").first();
    await expect(cartCount).toHaveText("1");
  });
});

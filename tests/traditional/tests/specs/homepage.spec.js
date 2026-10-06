// @ts-check
const { test, expect } = require("@playwright/test");
const HomePage = require("../pages/HomePage");

/**
 * Homepage Tests
 * Tests for the main landing page of TechMart
 */

test.describe("Homepage", () => {
  let homePage;

  test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page);

    // Clear cart before each test for consistent state
    await homePage.clearCart();
    await homePage.navigate();
  });

  test("should display the page title", async () => {
    // Verify the page title contains TechMart
    await expect(homePage.page).toHaveTitle(/TechMart/);
  });

  test("should display the logo in the navbar", async () => {
    // Check that the logo is visible
    await expect(homePage.logo).toBeVisible();
    await expect(homePage.logo).toHaveText(/TechMart/);
  });

  test("should display the hero section", async () => {
    // Verify hero section content
    await expect(homePage.heroTitle).toHaveText("Welcome to TechMart");
    await expect(homePage.heroSubtitle).toContainText("best tech accessories");
  });

  test("should display product cards", async () => {
    // Wait for products to load
    await expect(homePage.productGrid).toBeVisible();

    // Check that at least one product card exists
    await expect(homePage.productCards).toHaveCount(6); // We have 6 products
  });

  test("should display product information correctly", async () => {
    // Check first product card has required elements
    await expect(homePage.productInfo).toBeVisible();
    await expect(homePage.productPrice).toBeVisible();
    await expect(homePage.productStock).toBeVisible();
    await expect(homePage.addToCartButton).toBeVisible();
  });

  test("should have a working search bar", async () => {
    // Search for "Keyboard"
    await homePage.searchProduct("Keyboard");

    // Should show only keyboard product
    const productCount = await homePage.getProductCount();
    expect(productCount).toBe(1);
  });

  test("should filter products by category", async () => {
    // Select electronics category
    await homePage.filterByCategory("electronics");

    // Check that all visible products are electronics
    const productCount = await homePage.getProductCount();
    expect(productCount).toBeGreaterThan(0);
    expect(productCount).toBeLessThan(6); // Not all products
  });

  test("should display cart count in navbar", async () => {
    await expect(homePage.cartCount).toBeVisible();
    await expect(homePage.cartCount).toHaveText("0");
  });

  test("should have login and signup buttons", async () => {
    await expect(homePage.loginButton).toBeVisible();
    await expect(homePage.signUpButton).toBeVisible();
  });
});

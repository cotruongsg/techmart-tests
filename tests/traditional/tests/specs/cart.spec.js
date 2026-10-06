// @ts-check
const { test, expect } = require("@playwright/test");
const CartPage = require("../pages/CartPage");

test.describe("Shopping Cart", () => {
  let cartPage;

  test.beforeEach(async ({ page }) => {
    cartPage = new CartPage(page);
    await cartPage.clearCart();
    await page.goto("/");
  });

  test("should add item to cart", async () => {
    // Add first product to cart
    await cartPage.addItemToCart();

    // Verify toast message appears
    await expect(cartPage.toastMessage).toContainText("Added to cart");

    // Verify cart count updates
    await expect(cartPage.cartCount).toHaveText("1");
  });

  test("should navigate to cart page", async () => {
    // Add first product to cart
    await cartPage.addItemToCart();

    // Click on cart link
    await cartPage.cartLink.click();

    // Verify we're on cart page
    await expect(cartPage.page).toHaveURL("/cart.html");
    await expect(cartPage.page.locator("h1")).toHaveText("Your Shopping Cart");
  });

  test("should display cart items correctly", async () => {
    // Add item via API
    await cartPage.addItemViaAPI(1, 2);

    // Navigate to cart
    await cartPage.navigate();

    // Verify cart item is displayed
    await expect(cartPage.cartItems).toHaveCount(1);

    // Verify quantity is correct
    await expect(cartPage.qtyValue).toHaveText("2");
  });

  test("should update item quantity", async () => {
    // Add item via API
    await cartPage.addItemViaAPI(1, 1);

    // Navigate to cart
    await cartPage.navigate();

    // Increase quantity
    await cartPage.clickIncreaseQuantity();

    // Verify quantity increased
    await expect(cartPage.qtyValue).toHaveText("2");
  });

  test("should remove item from cart", async () => {
    // Add item via API
    await cartPage.addItemViaAPI(1, 1);

    // Navigate to cart
    await cartPage.navigate();

    // Remove item
    await cartPage.clickRemoveItem();

    // Verify empty cart message appears
    await expect(cartPage.emptyCartMessage).toBeVisible();
  });

  test("should clear entire cart", async () => {
    // Add multiple items via API
    await cartPage.addItemViaAPI(1, 1);
    await cartPage.addItemViaAPI(2, 1);

    // Navigate to cart
    await cartPage.navigate();

    // Clear cart
    await cartPage.clickClearCart();

    // Verify cart is empty
    await expect(cartPage.emptyCartMessage).toBeVisible();
  });

  test("should calculate correct totals", async () => {
    // Add item via API
    await cartPage.addItemViaAPI(1, 2);

    // Navigate to cart
    await cartPage.navigate();

    // Verify total
    await expect(cartPage.total).toContainText("159.98");
  });

  test("should show empty cart message when cart is empty", async () => {
    // Navigate to cart
    await cartPage.navigate();

    // Verify empty cart message
    await expect(cartPage.emptyCartMessage).toBeVisible();
    await expect(cartPage.emptyCartMessage).toContainText("Your cart is empty");

    // Verify "Start Shopping" button exists
    await expect(cartPage.startShoppingButton).toBeVisible();
  });
});

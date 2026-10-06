// @ts-check
const { test, expect } = require("@playwright/test");
const CheckoutPage = require("../pages/CheckoutPage");

test.describe("Checkout", () => {
  let checkoutPage;

  test.beforeEach(async ({ page }) => {
    checkoutPage = new CheckoutPage(page);

    // Clear cart and add an item before each test
    await checkoutPage.clearCart();
    await checkoutPage.addItemToCart(1, 1);

  });

  test("should redirect to cart if cart is empty", async ({ page }) => {
    // Clear cart
    await checkoutPage.clearCart();

    // Try to access checkout
    await checkoutPage.navigate();

    // Should redirect to cart
    await page.waitForURL("/cart.html");
  });

  test("should display checkout form", async () => {
    await checkoutPage.navigate();

    // Verify shipping form fields
    await expect(checkoutPage.firstNameInput).toBeVisible();
    await expect(checkoutPage.lastNameInput).toBeVisible();
    await expect(checkoutPage.addressInput).toBeVisible();
    await expect(checkoutPage.cityInput).toBeVisible();
    await expect(checkoutPage.stateSelect).toBeVisible();
    await expect(checkoutPage.zipInput).toBeVisible();
    await expect(checkoutPage.phoneInput).toBeVisible();

    // Verify payment form fields
    await expect(checkoutPage.cardNameInput).toBeVisible();
    await expect(checkoutPage.cardNumberInput).toBeVisible();
    await expect(checkoutPage.expiryInput).toBeVisible();
    await expect(checkoutPage.cvvInput).toBeVisible();
  });

  test("should display order summary", async () => {
    await checkoutPage.navigate();

    // Verify order summary section
    await expect(checkoutPage.orderSummary).toBeVisible();

    // Verify item is listed
    await expect(checkoutPage.orderItems).toHaveCount(1);

    // Verify totals are displayed
    await expect(checkoutPage.subtotal).toBeVisible();
    await expect(checkoutPage.tax).toBeVisible();
    await expect(checkoutPage.total).toBeVisible();
  });

  test("should calculate tax correctly", async () => {
    await checkoutPage.navigate();

    // Verify tax value
    const taxValue = await checkoutPage.getTaxValue();
    expect(taxValue).toContain("6.40");
  });

  test("should format card number with spaces", async () => {
    await checkoutPage.navigate();

    await checkoutPage.cardNumberInput.fill("1234567890123456");

    // Should be formatted as 1234 5678 9012 3456
    await expect(checkoutPage.cardNumberInput).toHaveValue(
      "1234 5678 9012 3456"
    );
  });

  test("should format expiry date correctly", async () => {
    await checkoutPage.navigate();

    await checkoutPage.expiryInput.fill("1225");

    // Should be formatted as 12/25
    await expect(checkoutPage.expiryInput).toHaveValue("12/25");
  });

  test("should complete checkout successfully", async () => {
    await checkoutPage.navigate();

    // Fill shipping information
    await checkoutPage.fillShippingDetails(
      "John",
      "Doe",
      "123 Main Street",
      "Grand Rapids",
      "MI",
      "49501",
      "555-123-4567"
    );

    // Fill payment information
    await checkoutPage.fillPaymentDetails(
      "John Doe",
      "4111111111111111",
      "12/25",
      "123"
    );

    // Submit order
    await checkoutPage.placeOrder();

    // Verify order confirmation modal
    await expect(checkoutPage.orderConfirmationModal).toBeVisible();
    await expect(checkoutPage.orderConfirmationModal).toContainText(
      "Order Confirmed"
    );
    const orderId = await checkoutPage.getOrderId();
    expect(orderId).not.toBe("");
  });

  test("should validate required fields", async () => {
    await checkoutPage.navigate();

    // Try to submit empty form
    await checkoutPage.placeOrder();

    // First name should show validation
    const isInvalid = await checkoutPage.isFieldInvalid(
      checkoutPage.firstNameInput
    );
    expect(isInvalid).toBe(true);
  });

  test("should validate ZIP code format", async () => {
    await checkoutPage.navigate();

    // Fill all fields but with invalid ZIP
    await checkoutPage.fillShippingDetails(
      "John",
      "Doe",
      "123 Main Street",
      "Grand Rapids",
      "MI",
      "abc", // Invalid ZIP
      "555-123-4567"
    );

    await checkoutPage.placeOrder();

    // ZIP should show validation error
    const isInvalid = await checkoutPage.isFieldInvalid(checkoutPage.zipInput);
    expect(isInvalid).toBe(true);
  });
});

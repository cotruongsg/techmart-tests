class CheckoutPage {
  constructor(page) {
    this.page = page;

    // Shipping form fields
    this.firstNameInput = page.locator("#firstName");
    this.lastNameInput = page.locator("#lastName");
    this.addressInput = page.locator("#address");
    this.cityInput = page.locator("#city");
    this.stateSelect = page.locator("#state");
    this.zipInput = page.locator("#zip");
    this.phoneInput = page.locator("#phone");

    // Payment form fields
    this.cardNameInput = page.locator("#cardName");
    this.cardNumberInput = page.locator("#cardNumber");
    this.expiryInput = page.locator("#expiry");
    this.cvvInput = page.locator("#cvv");

    // Order summary
    this.orderSummary = page.locator(".order-summary-sidebar");
    this.orderItems = page.locator(".order-item");
    this.subtotal = page.locator("#subtotal");
    this.tax = page.locator("#tax");
    this.total = page.locator("#total");

    // Buttons
    this.placeOrderButton = page.locator("#placeOrderBtn");

    // Confirmation modal
    this.orderConfirmationModal = page.locator("#orderConfirmation");
    this.orderId = page.locator("#orderId");
  }

  async navigate() {
    await this.page.goto("/checkout.html");
    await this.page.waitForLoadState("networkidle");
  }

  async clearCart() {
    await this.page.request.delete('/api/cart');
    await this.page.waitForTimeout(500); // Wait for the cart to be cleared
  }

  async addItemToCart(productId, quantity = 1) {
    await this.page.request.post('/api/cart', {
      data: { productId, quantity },
    });
    await this.page.waitForTimeout(500); // Wait for the item to be added
  }

  async fillShippingDetails(
    firstName,
    lastName,
    address,
    city,
    state,
    zip,
    phone
  ) {
    await this.firstNameInput.fill(firstName);
    await this.lastNameInput.fill(lastName);
    await this.addressInput.fill(address);
    await this.cityInput.fill(city);
    await this.stateSelect.selectOption(state);
    await this.zipInput.fill(zip);
    await this.phoneInput.fill(phone);
  }

  async fillPaymentDetails(cardName, cardNumber, expiry, cvv) {
    await this.cardNameInput.fill(cardName);
    await this.cardNumberInput.fill(cardNumber);
    await this.expiryInput.fill(expiry);
    await this.cvvInput.fill(cvv);
  }

  async placeOrder() {
    await this.placeOrderButton.click();
    await this.page.waitForTimeout(500); // Wait for the order confirmation modal to appear
  }

  async getTaxValue() {
    return await this.tax.textContent();
  }

  async getOrderId() {
    return await this.orderId.textContent();
  }

  async isOrderConfirmationVisible() {
    return await this.orderConfirmationModal.isVisible();
  }

  async isFieldInvalid(fieldLocator) {
    return await fieldLocator.evaluate((el) => !el.checkValidity());
  }
}

module.exports = CheckoutPage;

class CartPage {
  constructor(page) {
    this.page = page;
    this.addToCartButton = page.locator(".add-to-cart-btn");
    this.toastMessage = page.locator("#toast");
    this.cartCount = page.locator("#cartCount");
    this.cartLink = page.locator(".cart-link");
    this.cartItems = page.locator(".cart-item");
    this.qtyValue = page.locator(".qty-value");
    this.increaseQtyButton = page.locator(".qty-btn").nth(1); // Second button is +
    this.decreaseQtyButton = page.locator(".qty-btn").nth(0); // First button is -
    this.removeButton = page.locator(".remove-btn");
    this.clearCartButton = page.locator("#clearCartBtn");
    this.emptyCartMessage = page.locator("#emptyCart");
    this.total = page.locator("#total");
    this.startShoppingButton = page.locator("text=Start Shopping");
  }

  async navigate() {
    await this.page.goto("/cart.html");
    await this.page.waitForLoadState("networkidle", { timeout: 10000 }); 
  }

  async addItemToCart(productIndex = 0) {
    await this.addToCartButton.nth(productIndex).click();
  }

  async clearCart() {
    await this.page.request.delete("/api/cart");
    await this.page.waitForTimeout(800); // Wait for the item to be removed from the DOM
  }

  async addItemViaAPI(productId, quantity = 1) {
    await this.page.request.post("/api/cart", {
      data: { productId, quantity },
    });
    await this.page.waitForTimeout(1000); // Wait for the item to added
  }

  async clickIncreaseQuantity() {
    await this.increaseQtyButton.click();
    await this.page.waitForTimeout(500); // Wait for the item to be removed from the DOM
  }

  async clickDecreaseQuantity() {
    await this.decreaseQtyButton.click();
    await this.page.waitForTimeout(500); // Wait for the item to be removed from the DOM
  }

  async clickRemoveItem() {
    await this.removeButton.click();
    await this.page.waitForTimeout(500); // Wait for the item to be removed from the DOM
  }

  async clickClearCart() {
    await this.clearCartButton.click();
    await this.page.waitForTimeout(500); // Wait for the item to be removed from the DOM
  }

  async getCartItemCount() {
    return await this.cartItems.count();
  }

  async getToastMessage() {
    return await this.toastMessage.textContent();
  }

  async getTotal() {
    return await this.total.textContent();
  }

  async isEmptyCartVisible() {
    return await this.emptyCartMessage.isVisible();
  }
}

module.exports = CartPage;

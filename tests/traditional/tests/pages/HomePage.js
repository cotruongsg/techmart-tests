class HomePage {
  constructor(page) {
    this.page = page;

    // Navbar
    this.logo = page.locator(".logo");
    this.cartCount = page.locator("#cartCount");
    this.authArea = page.locator("#authArea");
    this.loginButton = this.authArea.locator("text=Login");
    this.signUpButton = this.authArea.locator("text=Sign Up");

    // Hero Section
    this.heroTitle = page.locator(".hero h1");
    this.heroSubtitle = page.locator(".hero p");

    // Product Grid
    this.productGrid = page.locator("#productGrid");
    this.productCards = page.locator(".product-card");
    this.firstProduct = this.productCards.first();

    // Product Details
    this.productInfo = this.firstProduct.locator(".product-info h3");
    this.productPrice = this.firstProduct.locator(".product-price");
    this.productStock = this.firstProduct.locator(".product-stock");
    this.addToCartButton = this.firstProduct.locator(".add-to-cart-btn");

    // Search Bar
    this.searchInput = page.locator("#searchInput");
    this.searchButton = page.locator("#searchBtn");

    // Category Filter
    this.categoryFilter = page.locator("#categoryFilter");
  }

  async navigate() {
    await this.page.goto("/");
  }

  async clearCart() {
    await this.page.request.delete('/api/cart');
    await this.page.waitForTimeout(500); // Wait for the cart to be cleared
  }

  async searchProduct(productName) {
    await this.searchInput.fill(productName);
    await this.searchButton.click();
    await this.page.waitForTimeout(500); // Wait for search results to load
  }

  async filterByCategory(category) {
    await this.categoryFilter.selectOption(category);
    await this.page.waitForTimeout(500); // Wait for filter to apply
  }

  async getProductCount() {
    return await this.productCards.count();
  }
}

module.exports = HomePage;

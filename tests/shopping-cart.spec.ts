import { test, expect } from '@playwright/test';

test.describe('Shopping Cart Management', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the application
    await page.goto('/');
    
    // Wait for albums to load
    await page.waitForSelector('.album-card', { timeout: 10000 });
    
    // Clear localStorage to start with empty cart
    await page.evaluate(() => localStorage.clear());
    await page.reload();
    await page.waitForSelector('.album-card', { timeout: 10000 });
  });

  test('should display cart icon in header', async ({ page }) => {
    // Verify cart icon is visible
    const cartIcon = page.locator('.cart-icon');
    await expect(cartIcon).toBeVisible();
    
    // Take screenshot
    await page.screenshot({ path: 'tests/screenshots/cart-icon.png', fullPage: true });
  });

  test('should show cart count badge when items are added', async ({ page }) => {
    // Initially no badge should be visible
    const badge = page.locator('.cart-icon .badge');
    await expect(badge).not.toBeVisible();
    
    // Click "Add to Cart" on first album
    const firstAddButton = page.locator('.album-card .btn-primary').first();
    await firstAddButton.click();
    
    // Badge should appear with count 1
    await expect(badge).toBeVisible();
    await expect(badge).toHaveText('1');
    
    // Take screenshot
    await page.screenshot({ path: 'tests/screenshots/cart-with-one-item.png', fullPage: true });
  });

  test('should add album to cart and update count', async ({ page }) => {
    // Click "Add to Cart" on first album
    const firstAddButton = page.locator('.album-card .btn-primary').first();
    await firstAddButton.click();
    
    // Verify badge shows 1
    const badge = page.locator('.cart-icon .badge');
    await expect(badge).toHaveText('1');
    
    // Add second album
    const secondAddButton = page.locator('.album-card .btn-primary').nth(1);
    await secondAddButton.click();
    
    // Verify badge shows 2
    await expect(badge).toHaveText('2');
    
    // Take screenshot
    await page.screenshot({ path: 'tests/screenshots/cart-with-two-items.png', fullPage: true });
  });

  test('should disable "Add to Cart" button when album is in cart', async ({ page }) => {
    // Click "Add to Cart" on first album
    const firstAddButton = page.locator('.album-card .btn-primary').first();
    await firstAddButton.click();
    
    // Button should be disabled and text should change
    await expect(firstAddButton).toBeDisabled();
    await expect(firstAddButton).toHaveClass(/in-cart/);
    
    // Take screenshot
    await page.screenshot({ path: 'tests/screenshots/album-in-cart.png', fullPage: true });
  });

  test('should open cart panel when cart icon is clicked', async ({ page }) => {
    // Add an item first
    const firstAddButton = page.locator('.album-card .btn-primary').first();
    await firstAddButton.click();
    
    // Click cart icon
    const cartIcon = page.locator('.cart-icon');
    await cartIcon.click();
    
    // Cart panel should be visible
    const cartPanel = page.locator('.cart-panel');
    await expect(cartPanel).toBeVisible();
    
    // Take screenshot
    await page.screenshot({ path: 'tests/screenshots/cart-panel-open.png', fullPage: true });
  });

  test('should display cart items in cart panel', async ({ page }) => {
    // Add first album
    const firstAddButton = page.locator('.album-card .btn-primary').first();
    await firstAddButton.click();
    
    // Add second album
    const secondAddButton = page.locator('.album-card .btn-primary').nth(1);
    await secondAddButton.click();
    
    // Open cart panel
    const cartIcon = page.locator('.cart-icon');
    await cartIcon.click();
    
    // Verify cart items are displayed
    const cartItems = page.locator('.cart-item');
    await expect(cartItems).toHaveCount(2);
    
    // Take screenshot
    await page.screenshot({ path: 'tests/screenshots/cart-panel-with-items.png', fullPage: true });
  });

  test('should display empty cart message when no items', async ({ page }) => {
    // Open cart panel
    const cartIcon = page.locator('.cart-icon');
    await cartIcon.click();
    
    // Verify empty message is displayed
    const emptyMessage = page.locator('.empty-cart');
    await expect(emptyMessage).toBeVisible();
    
    // Take screenshot
    await page.screenshot({ path: 'tests/screenshots/empty-cart.png', fullPage: true });
  });

  test('should remove item from cart', async ({ page }) => {
    // Add an item
    const firstAddButton = page.locator('.album-card .btn-primary').first();
    await firstAddButton.click();
    
    // Open cart panel
    const cartIcon = page.locator('.cart-icon');
    await cartIcon.click();
    
    // Remove the item
    const removeButton = page.locator('.cart-item .remove-btn').first();
    await removeButton.click();
    
    // Cart should be empty
    const emptyMessage = page.locator('.empty-cart');
    await expect(emptyMessage).toBeVisible();
    
    // Badge should not be visible
    const badge = page.locator('.cart-icon .badge');
    await expect(badge).not.toBeVisible();
    
    // Take screenshot
    await page.screenshot({ path: 'tests/screenshots/item-removed.png', fullPage: true });
  });

  test('should display total price in cart panel', async ({ page }) => {
    // Add two items
    const firstAddButton = page.locator('.album-card .btn-primary').first();
    await firstAddButton.click();
    
    const secondAddButton = page.locator('.album-card .btn-primary').nth(1);
    await secondAddButton.click();
    
    // Open cart panel
    const cartIcon = page.locator('.cart-icon');
    await cartIcon.click();
    
    // Verify total is displayed
    const totalPrice = page.locator('.total-price');
    await expect(totalPrice).toBeVisible();
    
    // Take screenshot
    await page.screenshot({ path: 'tests/screenshots/cart-total.png', fullPage: true });
  });

  test('should close cart panel when close button is clicked', async ({ page }) => {
    // Open cart panel
    const cartIcon = page.locator('.cart-icon');
    await cartIcon.click();
    
    // Verify panel is open
    const cartPanel = page.locator('.cart-panel');
    await expect(cartPanel).toBeVisible();
    
    // Click close button
    const closeButton = page.locator('.close-btn');
    await closeButton.click();
    
    // Panel should be hidden
    await expect(cartPanel).not.toBeVisible();
  });

  test('should close cart panel when overlay is clicked', async ({ page }) => {
    // Open cart panel
    const cartIcon = page.locator('.cart-icon');
    await cartIcon.click();
    
    // Click overlay
    const overlay = page.locator('.cart-overlay');
    await overlay.click();
    
    // Panel should be hidden
    const cartPanel = page.locator('.cart-panel');
    await expect(cartPanel).not.toBeVisible();
  });

  test('should persist cart data in localStorage', async ({ page }) => {
    // Add an item
    const firstAddButton = page.locator('.album-card .btn-primary').first();
    await firstAddButton.click();
    
    // Reload the page
    await page.reload();
    await page.waitForSelector('.album-card', { timeout: 10000 });
    
    // Cart should still have 1 item
    const badge = page.locator('.cart-icon .badge');
    await expect(badge).toHaveText('1');
    
    // Take screenshot
    await page.screenshot({ path: 'tests/screenshots/cart-persisted.png', fullPage: true });
  });

  test('should support language switching', async ({ page }) => {
    // Add an item
    const firstAddButton = page.locator('.album-card .btn-primary').first();
    await firstAddButton.click();
    
    // Open cart panel
    const cartIcon = page.locator('.cart-icon');
    await cartIcon.click();
    
    // Take screenshot in English
    await page.screenshot({ path: 'tests/screenshots/cart-english.png', fullPage: true });
    
    // Close cart
    const closeButton = page.locator('.close-btn');
    await closeButton.click();
    
    // Switch to French
    const languageSelector = page.locator('.locale-select');
    await languageSelector.selectOption('fr');
    
    // Open cart again
    await cartIcon.click();
    
    // Take screenshot in French
    await page.screenshot({ path: 'tests/screenshots/cart-french.png', fullPage: true });
    
    // Close cart
    await closeButton.click();
    
    // Switch to German
    await languageSelector.selectOption('de');
    
    // Open cart again
    await cartIcon.click();
    
    // Take screenshot in German
    await page.screenshot({ path: 'tests/screenshots/cart-german.png', fullPage: true });
  });

  test('should handle badge display for counts over 99', async ({ page }) => {
    // This test would require adding many items, which we'll simulate by directly modifying localStorage
    await page.evaluate(() => {
      const items = Array.from({ length: 100 }, (_, i) => ({
        id: i + 1,
        title: `Album ${i + 1}`,
        artist: `Artist ${i + 1}`,
        price: 10.99,
        image_url: 'https://via.placeholder.com/300'
      }));
      localStorage.setItem('album-viewer-cart', JSON.stringify(items));
    });
    
    await page.reload();
    await page.waitForSelector('.album-card', { timeout: 10000 });
    
    // Badge should show "99+"
    const badge = page.locator('.cart-icon .badge');
    await expect(badge).toHaveText('99+');
    
    // Take screenshot
    await page.screenshot({ path: 'tests/screenshots/cart-99-plus.png', fullPage: true });
  });
});

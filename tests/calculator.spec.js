import { test, expect } from '@playwright/test';

// URL de production pour les tests de validation
const PROD_URL = 'https://lakadev.github.io/nounoutrice/';

test.describe('Nounoutrice E2E Tests', () => {

  test('Test 1: Homepage loads and displays header', async ({ page }) => {
    await page.goto(PROD_URL);
    await page.waitForLoadState('networkidle');
    
    // Check title
    await expect(page.locator('.app-header')).toContainText('Nounoutrice');
  });

  test('Test 2: Calculates default weekly hours correctly', async ({ page }) => {
    await page.goto(PROD_URL);
    await page.waitForLoadState('networkidle');
    
    // Default should show 35h (9-16 = 7h * 5 days)
    await expect(page.locator('.display-total-semaine')).toContainText('35h');
  });

  test('Test 3: Tarif slider works and displays default value', async ({ page }) => {
    await page.goto(PROD_URL);
    await page.waitForLoadState('networkidle');
    
    // Default tarif is 4.00
    await expect(page.locator('.display-tarif')).toContainText('4.00');
  });

  test('Test 4: Toggles change labels and functionality', async ({ page }) => {
    await page.goto(PROD_URL);
    await page.waitForLoadState('networkidle');
    
    // Toggle 2 enfants
    const toggleEnfants = page.locator('.toggle-enfants');
    await toggleEnfants.click();
    await expect(page.locator('.label-enfants')).toContainText('2 enfants');
    
    // Toggle année complète
    const toggleAnnee = page.locator('.toggle-annee');
    await toggleAnnee.click();
    await expect(page.locator('.label-annee')).toContainText('Année incomplète');
  });

  test('Test 5: Monthly cost is calculated with default values', async ({ page }) => {
    await page.goto(PROD_URL);
    await page.waitForLoadState('networkidle');
    
    // Should show monthly cost
    await expect(page.locator('.display-total-mensuel')).toContainText('Coût mensuel');
    await expect(page.locator('.display-total-mensuel')).toContainText('€/mois');
  });

  test('Test 6: Add and remove plage', async ({ page }) => {
    await page.goto(PROD_URL);
    await page.waitForLoadState('networkidle');
    
    // Add a plage (use .first() in case of multiple buttons)
    await page.locator('.btn-add-plage').first().click();
    
    // Check we have 2 plages now
    const plages = await page.locator('.plage-item').count();
    expect(plages).toBe(2);
    
    // Remove the second plage
    const removeBtns = await page.locator('.btn-remove-plage').all();
    await removeBtns[1].click();
    
    // Check we have 1 plage again
    const plagesAfter = await page.locator('.plage-item').count();
    expect(plagesAfter).toBe(1);
  });

});
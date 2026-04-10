import { test, expect } from '@playwright/test';

// URL de l'application originale pour la création des tests
const ORIGINAL_APP_URL = 'https://lakadev.com/nounoutrice/'; 
// URL de production pour les tests de validation
const PROD_URL = 'https://lakadev.github.io/nounoutrice/';

test.describe('Nounoutrice E2E Tests', () => {

  test('Test 1: Homepage loads and displays header', async ({ page }) => {
    await page.goto(PROD_URL);
    await page.waitForLoadState('networkidle');
    
    // Check title
    await expect(page.locator('text=Nounoutrice')).toBeVisible();
  });

  test('Test 2: Calculates default weekly hours correctly', async ({ page }) => {
    await page.goto(PROD_URL);
    await page.waitForLoadState('networkidle');
    
    // Default should show 35h (9-16 = 7h * 5 days)
    await expect(page.locator('strong:has-text("35h")')).toBeVisible();
  });

  test('Test 3: Tarif slider works and displays default value', async ({ page }) => {
    await page.goto(PROD_URL);
    await page.waitForLoadState('networkidle');
    
    // Default tarif is 4.00
    await expect(page.locator('.text-center.text-h5')).toContainText('4.00');
  });

  test('Test 4: Toggles change labels and functionality', async ({ page }) => {
    await page.goto(PROD_URL);
    await page.waitForLoadState('networkidle');
    
    // Toggle 2 enfants
    await page.getByText('2 enfants').click({force: true}); // Utiliser force pour s'assurer du clic
    await expect(page.getByText('2 enfants')).toBeVisible();
    
    // Toggle année complète
    // Cibler le toggle par son label ou une propriété unique si possible
    const toggleAnneeComplete = page.locator('label:has-text("Année complète")').locator('..').locator('.q-toggle__inner');
    await toggleAnneeComplete.click({force: true});
    await expect(page.getByText('Année incomplète')).toBeVisible();
  });

  test('Test 5: Monthly cost is calculated with default values', async ({ page }) => {
    await page.goto(PROD_URL);
    await page.waitForLoadState('networkidle');
    
    // Should show monthly cost
    await expect(page.locator('text=Coût mensuel')).toBeVisible();
    await expect(page.locator('text=€/mois')).toBeVisible();
  });

});

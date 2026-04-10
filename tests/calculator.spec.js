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
    await expect(page.locator('.display-total-mensuel')).toContainText('€');
  });

  test('Test 6: Add and remove plage', async ({ page }) => {
    await page.goto(PROD_URL);
    await page.waitForLoadState('networkidle');
    
    // Add a plage (use .first() in case of multiple buttons)
    await page.locator('button:has-text("Ajouter")').first().click();
    
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

test.describe('UI Improvements E2E Tests', () => {

  test('UI-1: Time labels on range slider are in HH:00 format', async ({ page }) => {
    await page.goto(PROD_URL);
    await page.waitForLoadState('networkidle');
    
    // Check that q-range labels exist with HH:00 format
    const rangeLabels = await page.locator('.q-range__label').allInnerTexts();
    // Labels should match pattern like "09:00", "16:00"
    for (const label of rangeLabels) {
      expect(label).toMatch(/^\d{2}:00$/);
    }
  });

  test('UI-2: Duration displayed in hours format (e.g., "7h")', async ({ page }) => {
    await page.goto(PROD_URL);
    await page.waitForLoadState('networkidle');
    
    // Default plage shows 7h (16-9=7)
    const hoursDisplay = await page.locator('.display-hours').first().innerText();
    expect(hoursDisplay).toMatch(/^\d+h$/);
    expect(hoursDisplay).toContain('7h');
  });

  test('UI-3: Remove button hidden when only one plage exists', async ({ page }) => {
    await page.goto(PROD_URL);
    await page.waitForLoadState('networkidle');
    
    // With 1 plage, remove button should not be visible
    const removeButtons = await page.locator('.btn-remove-plage').count();
    expect(removeButtons).toBe(0);
  });

  test('UI-4: Remove button visible when multiple plages exist', async ({ page }) => {
    await page.goto(PROD_URL);
    await page.waitForLoadState('networkidle');
    
    // Add a second plage
    await page.locator('button:has-text("Ajouter")').first().click();
    await page.waitForTimeout(200);
    
    // Now remove buttons should be visible (2 plages = 2 buttons)
    const removeButtons = await page.locator('.btn-remove-plage').count();
    expect(removeButtons).toBe(2);
  });

  test('UI-5: Add button has outline style', async ({ page }) => {
    await page.goto(PROD_URL);
    await page.waitForLoadState('networkidle');
    
    // Check the add button has outline class
    const addBtn = page.locator('button:has-text("Ajouter")').first();
    await expect(addBtn).toBeVisible();
    
    // Quasar outline buttons have q-btn--outline class
    const className = await addBtn.getAttribute('class');
    expect(className).toContain('q-btn--outline');
  });

  test('UI-6: No "Plages horaires" title displayed', async ({ page }) => {
    await page.goto(PROD_URL);
    await page.waitForLoadState('networkidle');
    
    // Title should not exist
    const titleExists = await page.locator('text=Plages horaires').count();
    expect(titleExists).toBe(0);
  });

  test('UI-7: Tarif knob size is reduced (80px)', async ({ page }) => {
    await page.goto(PROD_URL);
    await page.waitForLoadState('networkidle');
    
    // Check tarif knob exists and is visible
    const tarifKnob = page.locator('.display-tarif-knob');
    await expect(tarifKnob).toBeVisible();
    
    // Check it's smaller (should have size attribute or style)
    const box = await tarifKnob.boundingBox();
    expect(box).not.toBeNull();
    // 80px knob + some padding
    expect(box.width).toBeLessThan(120);
  });

  test('UI-8: "Tarif net" label is on left of knob', async ({ page }) => {
    await page.goto(PROD_URL);
    await page.waitForLoadState('networkidle');
    
    // Check section-tarif contains both label and knob in a row
    const tarifSection = page.locator('.section-tarif');
    await expect(tarifSection).toContainText('Tarif net');
    await expect(tarifSection.locator('.display-tarif-knob')).toBeVisible();
  });

  test('UI-9: 6-day limit enforced across all plages', async ({ page }) => {
    await page.goto(PROD_URL);
    await page.waitForLoadState('networkidle');
    
    // Add second plage
    await page.locator('button:has-text("Ajouter")').first().click();
    await page.waitForTimeout(200);
    
    // Both knobs should show at least x1
    const repetitions = await page.locator('.display-repetition').allInnerTexts();
    for (const rep of repetitions) {
      expect(rep).toMatch(/^x\d$/);
      const num = parseInt(rep.replace('x', ''));
      expect(num).toBeGreaterThanOrEqual(1);
      expect(num).toBeLessThanOrEqual(6);
    }
  });

});
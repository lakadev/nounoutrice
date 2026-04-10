import { test, expect } from '@playwright/test'

const PROD_URL = 'https://lakadev.github.io/nounoutrice/'

test('homepage loads and displays calculator', async ({ page }) => {
  await page.goto(PROD_URL)
  
  // Attendre que l'élément soit rendu (Quasar prend parfois du temps)
  await page.waitForLoadState('networkidle')
  
  // Check title
  await expect(page.locator('text=Nounoutrice')).toBeVisible()
  
  // Check total heures semaine is shown
  await expect(page.locator('text=Total semaine')).toBeVisible()
})

test('calculates hours correctly', async ({ page }) => {
  await page.goto(PROD_URL)
  await page.waitForLoadState('networkidle')
  
  // Default should show 35h (9-16 = 7h * 5 days)
  await expect(page.locator('strong:has-text("35h")')).toBeVisible()
})

test('tarif slider works', async ({ page }) => {
  await page.goto(PROD_URL)
  await page.waitForLoadState('networkidle')
  
  // Default tarif is 4.00
  await expect(page.locator('.text-center.text-h5')).toContainText('4.00')
})

test('toggles change labels', async ({ page }) => {
  await page.goto(PROD_URL)
  await page.waitForLoadState('networkidle')
  
  // Toggle 2 enfants
  await page.getByText('2 enfants').click()
  await expect(page.getByText('2 enfants')).toBeVisible()
  
  // Toggle année complète
  const toggle = page.locator('.q-toggle').first()
  await expect(toggle).toBeVisible()
})

test('monthly cost is calculated', async ({ page }) => {
  await page.goto(PROD_URL)
  await page.waitForLoadState('networkidle')
  
  // Should show monthly cost
  await expect(page.locator('text=Coût mensuel')).toBeVisible()
  await expect(page.locator('text=€/mois')).toBeVisible()
})

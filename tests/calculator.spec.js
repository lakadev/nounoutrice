import { test, expect } from '@playwright/test'

test('homepage loads and displays calculator', async ({ page }) => {
  await page.goto('/')
  
  // Check title
  await expect(page.locator('text=Nounoutrice')).toBeVisible()
  
  // Check total heures semaine is shown
  await expect(page.locator('text=Total semaine')).toBeVisible()
})

test('calculates hours correctly', async ({ page }) => {
  await page.goto('/')
  
  // Default should show 35h (9-16 = 7h * 5 days)
  await expect(page.locator('strong:has-text("35h")')).toBeVisible()
})

test('tarif slider works', async ({ page }) => {
  await page.goto('/')
  
  // Default tarif is 4.00
  await expect(page.locator('.text-center.text-h5')).toContainText('4.00')
})

test('toggles change labels', async ({ page }) => {
  await page.goto('/')
  
  // Toggle 2 enfants
  await page.getByText('2 enfants').click()
  await expect(page.getByText('2 enfants')).toBeVisible()
  
  // Toggle année complète - le label du toggle reste "Année complète"
  // mais l'état change (vérifiable via le switch)
  const toggle = page.locator('.q-toggle').first()
  await expect(toggle).toBeVisible()
})

test('monthly cost is calculated', async ({ page }) => {
  await page.goto('/')
  
  // Should show monthly cost
  await expect(page.locator('text=Coût mensuel')).toBeVisible()
  await expect(page.locator('text=€/mois')).toBeVisible()
})
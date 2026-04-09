# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: calculator.spec.js >> tarif slider works
- Location: tests/calculator.spec.js:20:1

# Error details

```
Error: expect(locator).toContainText(expected) failed

Locator: locator('.text-center.text-h5')
Expected substring: "4.00"
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toContainText" with timeout 5000ms
  - waiting for locator('.text-center.text-h5')

```

# Page snapshot

```yaml
- generic [ref=e2]:
  - heading "404" [level=1] [ref=e3]
  - paragraph [ref=e4]:
    - strong [ref=e5]: There isn't a GitHub Pages site here.
  - paragraph [ref=e6]:
    - text: If you're trying to publish one,
    - link "read the full documentation" [ref=e7] [cursor=pointer]:
      - /url: https://help.github.com/pages/
    - text: to learn how to set up
    - strong [ref=e8]: GitHub Pages
    - text: for your repository, organization, or user account.
  - generic [ref=e9]:
    - link "GitHub Status" [ref=e10] [cursor=pointer]:
      - /url: https://githubstatus.com
    - text: —
    - link "@githubstatus" [ref=e11] [cursor=pointer]:
      - /url: https://twitter.com/githubstatus
  - link [ref=e12] [cursor=pointer]:
    - /url: /
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test'
  2  | 
  3  | test('homepage loads and displays calculator', async ({ page }) => {
  4  |   await page.goto('/')
  5  |   
  6  |   // Check title
  7  |   await expect(page.locator('text=Nounoutrice')).toBeVisible()
  8  |   
  9  |   // Check total heures semaine is shown
  10 |   await expect(page.locator('text=Total semaine')).toBeVisible()
  11 | })
  12 | 
  13 | test('calculates hours correctly', async ({ page }) => {
  14 |   await page.goto('/')
  15 |   
  16 |   // Default should show 35h (9-16 = 7h * 5 days)
  17 |   await expect(page.locator('strong:has-text("35h")')).toBeVisible()
  18 | })
  19 | 
  20 | test('tarif slider works', async ({ page }) => {
  21 |   await page.goto('/')
  22 |   
  23 |   // Default tarif is 4.00
> 24 |   await expect(page.locator('.text-center.text-h5')).toContainText('4.00')
     |                                                      ^ Error: expect(locator).toContainText(expected) failed
  25 | })
  26 | 
  27 | test('toggles change labels', async ({ page }) => {
  28 |   await page.goto('/')
  29 |   
  30 |   // Toggle 2 enfants
  31 |   await page.getByText('2 enfants').click()
  32 |   await expect(page.getByText('2 enfants')).toBeVisible()
  33 |   
  34 |   // Toggle année complète - le label du toggle reste "Année complète"
  35 |   // mais l'état change (vérifiable via le switch)
  36 |   const toggle = page.locator('.q-toggle').first()
  37 |   await expect(toggle).toBeVisible()
  38 | })
  39 | 
  40 | test('monthly cost is calculated', async ({ page }) => {
  41 |   await page.goto('/')
  42 |   
  43 |   // Should show monthly cost
  44 |   await expect(page.locator('text=Coût mensuel')).toBeVisible()
  45 |   await expect(page.locator('text=€/mois')).toBeVisible()
  46 | })
```
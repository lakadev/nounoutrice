# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: calculator.spec.js >> Nounoutrice E2E Tests >> Test 3: Tarif slider works and displays default value
- Location: tests/calculator.spec.js:26:3

# Error details

```
Error: expect(locator).toContainText(expected) failed

Locator: locator('.text-center.text-h5')
Expected substring: "4.00"
Received string:    " Nounoutrice "
Timeout: 5000ms

Call log:
  - Expect "toContainText" with timeout 5000ms
  - waiting for locator('.text-center.text-h5')
    9 × locator resolved to <div data-v-a8f03af2="" class="q-card__section q-card__section--vert bg-primary text-white text-h5 text-center q-pa-md q-mb-lg full-width app-header"> Nounoutrice </div>
      - unexpected value " Nounoutrice "

```

# Page snapshot

```yaml
- main [ref=e5]:
  - generic [ref=e6]:
    - generic [ref=e7]: Nounoutrice
    - generic [ref=e8]:
      - generic [ref=e9]: Plages horaires
      - generic [ref=e10]:
        - button [disabled] [ref=e11]:
          - img [ref=e13]: close
        - generic [ref=e14]:
          - generic [ref=e15]: 09:00 - 16:00
          - slider [ref=e16]:
            - generic [ref=e18]:
              - generic [ref=e21]:
                - img [ref=e22]
                - generic:
                  - generic:
                    - generic: "9"
              - generic [ref=e25]:
                - img [ref=e26]
                - generic:
                  - generic:
                    - generic: "16"
          - generic [ref=e29]:
            - generic [ref=e30]: Début
            - generic [ref=e31]: Fin
        - generic [ref=e32]:
          - slider [ref=e33]:
            - img [ref=e34]
            - generic [ref=e38]: x5
          - generic [ref=e39]: Jours/semaine
      - button [ref=e40] [cursor=pointer]:
        - img [ref=e42]: add
    - generic [ref=e43]:
      - generic [ref=e44]: Tarif net
      - slider [ref=e45] [cursor=pointer]:
        - img [ref=e46]
        - generic [ref=e50]:
          - generic [ref=e51]: "4.00"
          - generic [ref=e52]: €/h
    - generic [ref=e53]:
      - generic [ref=e54]:
        - button [ref=e55] [cursor=pointer]:
          - img [ref=e57]: person
        - generic [ref=e58]: 1 enfant
        - switch [ref=e59] [cursor=pointer]
      - generic [ref=e63]:
        - button [ref=e64] [cursor=pointer]:
          - img [ref=e66]: event
        - generic [ref=e67]: Année complète
        - switch [checked] [ref=e68] [cursor=pointer]
    - generic [ref=e72]:
      - generic [ref=e73]:
        - text: "Total semaine :"
        - strong [ref=e74]: 35h
      - generic [ref=e75]: "Tarif net : 4.00 €/h"
      - generic [ref=e76]: "Coût mensuel : ~607 €/mois"
      - generic [ref=e77]: + 87€ d'indemnités
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | 
  3  | // URL de l'application originale pour la création des tests
  4  | const ORIGINAL_APP_URL = 'https://lakadev.com/nounoutrice/'; 
  5  | // URL de production pour les tests de validation
  6  | const PROD_URL = 'https://lakadev.github.io/nounoutrice/';
  7  | 
  8  | test.describe('Nounoutrice E2E Tests', () => {
  9  | 
  10 |   test('Test 1: Homepage loads and displays header', async ({ page }) => {
  11 |     await page.goto(PROD_URL);
  12 |     await page.waitForLoadState('networkidle');
  13 |     
  14 |     // Check title
  15 |     await expect(page.locator('text=Nounoutrice')).toBeVisible();
  16 |   });
  17 | 
  18 |   test('Test 2: Calculates default weekly hours correctly', async ({ page }) => {
  19 |     await page.goto(PROD_URL);
  20 |     await page.waitForLoadState('networkidle');
  21 |     
  22 |     // Default should show 35h (9-16 = 7h * 5 days)
  23 |     await expect(page.locator('strong:has-text("35h")')).toBeVisible();
  24 |   });
  25 | 
  26 |   test('Test 3: Tarif slider works and displays default value', async ({ page }) => {
  27 |     await page.goto(PROD_URL);
  28 |     await page.waitForLoadState('networkidle');
  29 |     
  30 |     // Default tarif is 4.00
> 31 |     await expect(page.locator('.text-center.text-h5')).toContainText('4.00');
     |                                                        ^ Error: expect(locator).toContainText(expected) failed
  32 |   });
  33 | 
  34 |   test('Test 4: Toggles change labels and functionality', async ({ page }) => {
  35 |     await page.goto(PROD_URL);
  36 |     await page.waitForLoadState('networkidle');
  37 |     
  38 |     // Toggle 2 enfants
  39 |     await page.getByText('2 enfants').click({force: true}); // Utiliser force pour s'assurer du clic
  40 |     await expect(page.getByText('2 enfants')).toBeVisible();
  41 |     
  42 |     // Toggle année complète
  43 |     // Cibler le toggle par son label ou une propriété unique si possible
  44 |     const toggleAnneeComplete = page.locator('label:has-text("Année complète")').locator('..').locator('.q-toggle__inner');
  45 |     await toggleAnneeComplete.click({force: true});
  46 |     await expect(page.getByText('Année incomplète')).toBeVisible();
  47 |   });
  48 | 
  49 |   test('Test 5: Monthly cost is calculated with default values', async ({ page }) => {
  50 |     await page.goto(PROD_URL);
  51 |     await page.waitForLoadState('networkidle');
  52 |     
  53 |     // Should show monthly cost
  54 |     await expect(page.locator('text=Coût mensuel')).toBeVisible();
  55 |     await expect(page.locator('text=€/mois')).toBeVisible();
  56 |   });
  57 | 
  58 | });
  59 | 
```
# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: regressions.spec.js >> Nounoutrice Regressions & Interactions >> Regression: Interaction should NOT generate NaN values on page
- Location: tests/regressions.spec.js:29:3

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Error: locator.boundingBox: Test timeout of 30000ms exceeded.
Call log:
  - waiting for locator('.input-time-range .q-range__track').first()

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
      - generic [ref=e45]:
        - img [ref=e46]
        - generic [ref=e49]: 4.00 €/h
    - generic [ref=e50]:
      - generic [ref=e51]:
        - button [ref=e52] [cursor=pointer]:
          - img [ref=e54]: person
        - generic [ref=e55]: 1 enfant
        - switch [ref=e56] [cursor=pointer]
      - generic [ref=e60]:
        - button [ref=e61] [cursor=pointer]:
          - img [ref=e63]: event
        - generic [ref=e64]: Année complète
        - switch [checked] [ref=e65] [cursor=pointer]
    - generic [ref=e69]:
      - generic [ref=e70]:
        - text: "Total semaine :"
        - strong [ref=e71]: 35h
      - generic [ref=e72]: "Tarif net : 4.00 €/h"
      - generic [ref=e73]: "Coût mensuel : ~607 €/mois"
      - generic [ref=e74]: + 87€ d'indemnités
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | 
  3  | const PROD_URL = 'https://lakadev.github.io/nounoutrice/';
  4  | 
  5  | test.describe('Nounoutrice Regressions & Interactions', () => {
  6  | 
  7  |   test.beforeEach(async ({ page }) => {
  8  |     await page.goto(PROD_URL);
  9  |     await page.waitForLoadState('networkidle');
  10 |   });
  11 | 
  12 |   test('Regression: Shifting hours range should NOT affect repetition value', async ({ page }) => {
  13 |     const repetitionBefore = await page.locator('.display-repetition').innerText();
  14 |     
  15 |     // Simuler un déplacement du slider q-range (clic milieu et drag)
  16 |     const slider = page.locator('.input-time-range .q-range__track').first();
  17 |     const box = await slider.boundingBox();
  18 |     if (box) {
  19 |       await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
  20 |       await page.mouse.down();
  21 |       await page.mouse.move(box.x + box.width / 4, box.y + box.height / 2);
  22 |       await page.mouse.up();
  23 |     }
  24 | 
  25 |     const repetitionAfter = await page.locator('.display-repetition').innerText();
  26 |     expect(repetitionAfter).toBe(repetitionBefore);
  27 |   });
  28 | 
  29 |   test('Regression: Interaction should NOT generate NaN values on page', async ({ page }) => {
  30 |     // Modifier le slider
  31 |     const slider = page.locator('.input-time-range .q-range__track').first();
> 32 |     const box = await slider.boundingBox();
     |                              ^ Error: locator.boundingBox: Test timeout of 30000ms exceeded.
  33 |     if (box) {
  34 |       await page.mouse.click(box.x + 10, box.y + box.height / 2);
  35 |     }
  36 | 
  37 |     // Vérifier l'absence de NaN dans le body
  38 |     const bodyText = await page.innerText('body');
  39 |     expect(bodyText).not.toContain('NaN');
  40 |   });
  41 | 
  42 |   test('Interaction: Clicking on Tarif Gauge should update values', async ({ page }) => {
  43 |     const costBefore = await page.locator('.display-total-mensuel').innerText();
  44 |     
  45 |     // Clic sur la jauge de tarif
  46 |     const gauge = page.locator('.gauge-container').first();
  47 |     const gBox = await gauge.boundingBox();
  48 |     if (gBox) {
  49 |       // Cliquer sur le bord droit pour augmenter le tarif
  50 |       await page.mouse.click(gBox.x + gBox.width - 5, gBox.y + gBox.height / 2);
  51 |     }
  52 | 
  53 |     await page.waitForTimeout(500); // Attendre le calcul
  54 |     const costAfter = await page.locator('.display-total-mensuel').innerText();
  55 |     
  56 |     expect(costAfter).not.toBe(costBefore);
  57 |   });
  58 | 
  59 | });
  60 | 
```
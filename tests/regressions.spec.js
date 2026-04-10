import { test, expect } from '@playwright/test';

const PROD_URL = 'https://lakadev.github.io/nounoutrice/';

test.describe('Nounoutrice Regressions & Interactions', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto(PROD_URL);
    await page.waitForLoadState('networkidle');
  });

  test('Regression: Shifting hours range should NOT affect repetition value', async ({ page }) => {
    const repetitionBefore = await page.locator('.display-repetition').innerText();
    
    // Simuler un déplacement du slider q-range (clic milieu et drag)
    const slider = page.locator('.input-time-range .q-range__track').first();
    const box = await slider.boundingBox();
    if (box) {
      await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
      await page.mouse.down();
      await page.mouse.move(box.x + box.width / 4, box.y + box.height / 2);
      await page.mouse.up();
    }

    const repetitionAfter = await page.locator('.display-repetition').innerText();
    expect(repetitionAfter).toBe(repetitionBefore);
  });

  test('Regression: Interaction should NOT generate NaN values on page', async ({ page }) => {
    // Modifier le slider
    const slider = page.locator('.input-time-range .q-range__track').first();
    const box = await slider.boundingBox();
    if (box) {
      await page.mouse.click(box.x + 10, box.y + box.height / 2);
    }

    // Vérifier l'absence de NaN dans le body
    const bodyText = await page.innerText('body');
    expect(bodyText).not.toContain('NaN');
  });

  test('Interaction: Clicking on Tarif Gauge should update values', async ({ page }) => {
    const costBefore = await page.locator('.display-total-mensuel').innerText();
    
    // Clic sur le knob de tarif (bord droit pour augmenter)
    const gauge = page.locator('.display-tarif-knob');
    const gBox = await gauge.boundingBox();
    if (gBox) {
      await page.mouse.click(gBox.x + gBox.width - 5, gBox.y + gBox.height / 2);
    }

    await page.waitForTimeout(500);
    const costAfter = await page.locator('.display-total-mensuel').innerText();
    
    expect(costAfter).not.toBe(costBefore);
  });

});

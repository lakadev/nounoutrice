import { test, expect } from '@playwright/test';

const PROD_URL = 'https://lakadev.github.io/nounoutrice/';

test.describe('Nounoutrice Regressions & Interactions', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto(PROD_URL);
    await page.waitForLoadState('networkidle');
  });

  test('Regression: Shifting hours range should NOT affect repetition value', async ({ page }) => {
    // Get initial repetition value
    const repetitionBefore = await page.locator('.display-repetition').first().innerText();
    
    // Interact with the q-range slider (click on the track)
    const slider = page.locator('.input-time-range').first();
    const box = await slider.boundingBox();
    if (box) {
      await page.mouse.click(box.x + box.width / 2, box.y + box.height / 2);
    }

    // Wait a bit for reactivity
    await page.waitForTimeout(200);

    // Check repetition hasn't changed
    const repetitionAfter = await page.locator('.display-repetition').first().innerText();
    expect(repetitionAfter).toBe(repetitionBefore);
  });

  test('Regression: Interaction should NOT generate NaN values on page', async ({ page }) => {
    // Modify the slider
    const slider = page.locator('.input-time-range').first();
    const box = await slider.boundingBox();
    if (box) {
      await page.mouse.click(box.x + box.width / 2, box.y + box.height / 2);
    }

    await page.waitForTimeout(200);

    // Check there is no NaN in the body
    const bodyText = await page.innerText('body');
    expect(bodyText).not.toContain('NaN');
  });

  test('Interaction: Clicking on Tarif Gauge should update values', async ({ page }) => {
    const costBefore = await page.locator('.display-total-mensuel').innerText();
    
    // Click on the tarif knob (right edge to increase)
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

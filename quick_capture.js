import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.setViewportSize({ width: 375, height: 812 }); // Format mobile comme ta capture
  await page.goto('https://lakadev.github.io/nounoutrice/');
  await page.waitForTimeout(2000); // Attendre le rendu Quasar
  await page.screenshot({ path: '/data/.openclaw/workspace/nounoutrice_prod.png' });
  await browser.close();
  console.log('Capture sauvegardée sous /data/.openclaw/workspace/nounoutrice_prod.png');
})();

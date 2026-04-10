import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto('https://lakadev.com/nounoutrice/');
  await page.waitForTimeout(2000); 
  await page.screenshot({ path: '/data/.openclaw/workspace/original_capture.png' });
  await browser.close();
  console.log('Capture de lakadev.com/nounoutrice sauvegardée sous /data/.openclaw/workspace/original_capture.png');
})();

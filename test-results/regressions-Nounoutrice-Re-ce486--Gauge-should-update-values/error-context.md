# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: regressions.spec.js >> Nounoutrice Regressions & Interactions >> Interaction: Clicking on Tarif Gauge should update values
- Location: tests/regressions.spec.js:42:3

# Error details

```
Error: Channel closed
```

```
Error: locator.boundingBox: Target page, context or browser has been closed
Call log:
  - waiting for locator('.gauge-container').first()

```

```
Error: browserContext.close: Target page, context or browser has been closed
```
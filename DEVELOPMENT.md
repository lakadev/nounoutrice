# Nounoutrice - Development Guidelines

> Read this file at the start of each development session.

## Project

**Childcare rate calculator**
- Stack: Vue 3 + Quasar, Pinia, Vite, Playwright
- Deploy: GitHub Pages (`/nounoutrice/`)
- Repo: `https://github.com/lakadev/nounoutrice.git`

---

## Available Tools

### ✅ Playwright (npm)
Works for E2E tests and screenshots:```bash
cd /data/.openclaw/workspace/dev/nounoutrice/source
npx playwright test
npx playwright screenshot --viewport-size=390,844 "https://example.com" /tmp/screenshot.png
```

### ✅ Crawl4AI
Installed and ready for web scraping:
```bash
/data/.local/bin/crwl crawl "https://example.com" -o markdown
```
Options:
- `-o markdown` → markdown output
- `-o json` → structured output
- `-c "key=value"` → crawler parameters
- `--deep-crawl bfs|dfs` → crawl multiple pages

### ❌ Browser Tool OpenClaw
**Does NOT work** on this system (CDP timeout). Use Playwright or Crawl4AI instead.

### ✅ OpenRouter Models
Configured in `/data/.openclaw/openclaw.json`:
- `openrouter/auto` → OpenRouter (Auto)
- `anthropic/claude-sonnet-4.6` → Claude Sonnet 4.6
- `anthropic/claude-opus-4.6` → Claude Opus 4.6
- `anthropic/claude-haiku-4.5` → Claude Haiku 4.5

---

## Mandatory Workflow

1. **Read relevant files in full**
2. **List issues found** (written diagnosis)
3. **Numbered fix plan**
4. **Apply**, then `npm run build` to verify

> ⚠️ Never fix without reading the code first.

---

## Quasar Pitfalls

### q-range
- Only accepts `{min, max}`
- Store holds `{min, max, repetition}`
- **Never pass full object as v-model** → causes NaN, repetition mutation
- Use a writable computed isolating `{min, max}`

### q-knob
- `readonly` makes component **fully non-interactive**, not just write-protected
- Remove `readonly` if user needs to modify the value

### v-model + function call
- `v-model="fn(i)"` is **forbidden**
- Pre-instantiate computeds instead

---

## E2E Tests

### Selectors
- `.display-tarif` → rate display
- `.display-tarif-knob` → rate gauge/knob
- **Never use** `.text-center.text-h5` or `.gauge-container`

### URL Configuration
- `localhost` in dev
- GitHub Pages in CI
- Configure via **env/Playwright config**, never hardcode

---

## UI

- **Single header only** (duplicate = bug in `App.vue` or child)
- **Mobile-first**: 390×844 viewport
- `tarifHeuresSup.toFixed(2)` → ensure **never NaN**

---

## Git

- **Never commit** `node_modules/` or `dist/`
- Use **descriptive commit messages**

---

## Nounoutrice Logic

### Calculation Formulas
- **Heures sup mensuelles**: `((max - min) * 4.33)` + `((repetition - 1) * (max - min) * 4.33 / 2)`
- **Indemnités**: `(tarif * heuresSup * 1.5)` — beware: NO extra `* 4`
- ** deuxEnfants**: Apply coefficient `×1.5`

### Repetition Limit
- Max **6 days** per time slot
- Use: `maxRepetitionFor(index)` function

---

## Quick Reference

| Issue | Solution |
|-------|----------|
| q-range NaN | Writable computed for `{min, max}` only |
| q-knob not interactive | Remove `readonly` |
| v-model function call | Pre-instantiate computeds |
| Test selector fails | Use `.display-*` classes |
| Duplicate header | Check App.vue + IndexPage.vue |
| toFixed NaN | Guard with `Number()?.toFixed()` |
| Indemnités wrong | Check: no extra `* 4` factor |
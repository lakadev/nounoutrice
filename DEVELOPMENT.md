# Nounoutrice - Development Guidelines

> Read this file at the start of each development session.

## Project

**Childcare rate calculator**
- Stack: Vue 3 + Quasar, Pinia, Vite, Playwright
- Deploy: GitHub Pages (`/nounoutrice/`)

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

## Quick Reference

| Issue | Solution |
|-------|----------|
| q-range NaN | Writable computed for `{min, max}` only |
| q-knob not interactive | Remove `readonly` |
| v-model function call | Pre-instantiate computeds |
| Test selector fails | Use `.display-*` classes |
| Duplicate header | Check App.vue + IndexPage.vue |
| toFixed NaN | Guard with `Number()?.toFixed()` |
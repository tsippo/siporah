# Security

## What protects the site (in the code)

- **No attack surface for visitors**: no forms, no database, no logins for visitors,
  no visitor input shown on pages. Pages are static files.
- **Security headers** on every response (`next.config.ts`): HTTPS only (HSTS), no
  framing (clickjacking), no MIME sniffing, a strict referrer policy, camera/mic/
  location blocked, and a Content Security Policy that lets the website load only its
  own files. The framework name is not advertised.
- **Content editor** (`/keystatic`): only people with write access to the GitHub repo
  can log in. It is off on the live site until its keys are set, never indexed, and its
  CSP only adds GitHub and the editor's font.
- **External links** (Amazon, Instagram) open with `noopener noreferrer`.
- **Automatic checks** on every pull request (`.github/workflows/checks.yml`): known
  vulnerabilities (`npm audit`), lint, types, tests, build.
- **Dependabot** (`.github/dependabot.yml`) proposes package updates weekly and
  security fixes immediately.
- **Tests** (`src/__tests__/security.test.ts`) fail if a header is removed or weakened.

## Checklist for the account owners (do once)

The code can't protect against a stolen password. These matter most:

- [ ] **GitHub: two-factor authentication** (Settings → Password and authentication →
      Enable 2FA). Also for the author's GitHub account once she has one.
- [ ] **Vercel: two-factor authentication** (Account Settings → Authentication).
- [ ] **Email account** behind GitHub/Vercel: 2FA too (whoever owns the email can
      reset the other passwords).
- [ ] **GitHub repo → Settings → Branches → Add rule for `main`**: require a pull
      request and the "Checks" status check before merging.
- [ ] **GitHub repo → Settings → Code security**: turn on Dependabot alerts and
      security updates (and secret scanning / push protection if offered).
- [ ] **Keep the repo private**, and only give **Write** access to people who edit.
- [ ] **Never commit `.env` files** (they are git-ignored) and never paste the
      Keystatic keys anywhere except Vercel's Environment Variables.
- [ ] **Vercel → Settings → Deployment Protection**: keep it on for preview links.
- [ ] If a key ever leaks: in GitHub → Developer settings → GitHub Apps → "Tsippo
      editor", generate a new client secret, update it in Vercel, and redeploy.

## Reporting a problem

Email tsippo.travel@gmail.com.

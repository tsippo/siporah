# Content editor (Keystatic)

The author edits the site's texts, the book details and the author photo at
**`/keystatic`** (e.g. `https://tsippo.vercel.app/keystatic`). Keystatic is free
and open source; there is no extra service. Every save becomes a commit in this
GitHub repo, and Vercel republishes the site in 1–2 minutes.

What is editable:

| In the editor | Stored in |
| --- | --- |
| Texts – Nederlands / English (every text on the site) | `src/app/[lang]/dictionaries/nl.json`, `en.json` |
| Book & author photo (titles, Amazon links, covers, author photo) | `src/content/book.json`, images in `public/images/covers/…`, `public/images/author/` |

Layout, animations and the positions on the map stay in code.

## Trying it locally

`npm run dev` and open http://localhost:3000/keystatic. In development it saves
straight to the files on disk, so you can check changes with `git diff`.

## One-time setup for the live site

The live site must already be on Vercel.

1. **Create the GitHub App (on your computer).**
   - Create a file `.env.local` with the line `NEXT_PUBLIC_KEYSTATIC_STORAGE=github`.
   - Run `npm run dev` and open http://127.0.0.1:3000/keystatic.
   - Click **Create GitHub App**. When it asks for the deployed URL, enter the live
     address (e.g. `https://tsippo.vercel.app`). Name the app e.g. "Tsippo editor".
   - Install it on **only** the `siporah` repository.
   - Keystatic writes four values into `.env`. Git ignores this file; never commit it:
     `KEYSTATIC_GITHUB_CLIENT_ID`, `KEYSTATIC_GITHUB_CLIENT_SECRET`,
     `KEYSTATIC_SECRET`, `NEXT_PUBLIC_KEYSTATIC_GITHUB_APP_SLUG`.
2. **Add those four values in Vercel:** Project → Settings → Environment Variables
   (Production), then Deployments → ⋯ → **Redeploy**.
   Until they are set, `/keystatic` on the live site says "not set up yet" and the rest
   of the site works normally.
3. **Callback address.** In GitHub → Settings → Developer settings → GitHub Apps →
   "Tsippo editor", check that the Callback URLs include
   `https://<live address>/api/keystatic/github/oauth/callback`
   (and `http://127.0.0.1:3000/api/keystatic/github/oauth/callback` for local use).
4. **Give the author access.** She creates a free account at https://github.com/signup.
   Then in the repo: Settings → Collaborators → **Add people** → her username, role
   **Write**. She accepts the email invitation.
5. Remove `NEXT_PUBLIC_KEYSTATIC_STORAGE=github` from `.env.local` again, so local
   development goes back to saving on disk.

## Safety

- The author should always stay on the `main` branch in the editor's branch menu (top
  left). Saves on another branch don't go live; the editor then offers a pull request.
  If that happens: merge that pull request, or close it if the change isn't wanted.
- The editor commits straight to `main`. Don't add branch rules that require a pull
  request or status checks on `main`, or her saves will be refused
  (see `docs/security.md`).
- `src/__tests__/cms.test.ts` fails if a text on the site has no field in the editor
  (a missing field would be removed from the file on save). The text fields are
  generated from `nl.json`, so a new text is picked up automatically.
- Images must stay under the folder their field points to (`/images/covers/<lang>/`),
  or the editor shows them as empty and would erase them on save.
- Every change is a commit, so anything can be undone from GitHub.

---

# Handleiding voor Mickey

> **De belangrijkste regel:** laat het menuutje **linksboven** altijd op **main** staan
> en klik nooit op **New branch**. Dan komt alles wat je bewaart direct op de website.

1. Ga naar **`<website>/keystatic`** en klik **Log in with GitHub**.
   Linksboven staat **main**. Zo hoort het; daar hoef je niets aan te doen.
2. Links zie je:
   - **Texts – Nederlands** en **Texts – English**: alle teksten van de website,
     per onderdeel (bovenaan de homepage, het fotoalbum, het boek, Wie ben ik?, …).
   - **Book & author photo**: de titels, de Amazon-links, de omslagen en jouw foto.
3. Pas aan wat je wilt en klik rechtsboven op **Save**.
4. Na **1 à 2 minuten** staat de wijziging op de website. Ververs de pagina om het te zien.

Tips:
- Verander je een tekst in het Nederlands, vergeet dan de Engelse versie niet.
- Foto's: kies een bestand met **Choose file**. Omslag rechtop (ongeveer 2:3),
  jouw foto rechtop (ongeveer 3:4).
- Iets misgegaan? Geen zorgen: elke wijziging wordt bewaard en kan teruggezet worden.
- Zie je ineens **Create pull request**, of staat je wijziging na een paar minuten nog
  niet op de website? Dan staat het menuutje linksboven waarschijnlijk niet op **main**.
  Bewaar niets meer en laat het even weten; het is in een paar tellen opgelost.

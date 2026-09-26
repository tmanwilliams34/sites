# BackyardMechanic — Website Setup Guide

A simple, free-to-host website for your moped service business: services + prices, a live
availability schedule (Hawaii time), and a request form that opens a pre-filled email.

---

## 1. How it works (the big picture)

| File | Language | What it does |
|---|---|---|
| `index.html` | HTML | The page structure: header, services, hours, request form |
| `styles.css` | CSS | All the colors, spacing, and mobile layout |
| `script.js` | JavaScript | **Your data lives here** (prices, hours, email) and it builds the cards, the week grid, the "Open now" badge, and the email request |
| `serve.py` | Python | Runs the site on your laptop so you can preview it |

This is a **static site**: no database, no server to maintain, no monthly cost. The request form
uses a `mailto:` link, which opens the customer's email app with everything filled in, so you get
a normal email in your inbox.

---

## 2. Tools to install (one time)

1. **VS Code** (code editor): https://code.visualstudio.com
2. **Python 3** (for the preview server): https://www.python.org/downloads — on Windows, check
   *"Add Python to PATH"* during install. Check it worked: open a terminal and run `python --version`.
3. **A GitHub account** (free hosting): https://github.com
4. **Git** (optional but recommended): https://git-scm.com

---

## 3. Customize it

Open `script.js` in VS Code. Everything you need to change is at the top:

```js
const CONFIG = {
  businessName: "BackyardMechanic",   // your shop name
  email: "you@example.com",             // where requests go
  mobileFee: "$10–15",
  ...
};
```

- **Hours** → edit `AVAILABILITY`. Days are numbers (0 = Sunday … 6 = Saturday), hours are 24-hour.
  `6: [[14, 17]]` means Saturday 2–5 PM. Half hours work too: `[17.5, 19]` = 5:30–7 PM.
- **Prices / services** → edit the `SERVICES` lists. Copy a line, change the text, save. The
  cards and the form dropdown update automatically.
- **Colors** → top of `styles.css`, the `:root` section. Change `--primary` and `--accent`.

---

## 4. Preview on your laptop

Open a terminal in the `moped-site` folder (in VS Code: *Terminal → New Terminal*) and run:

```bash
python serve.py        # on Mac/Linux you may need: python3 serve.py
```

Your browser opens `http://localhost:8000`. Edit a file, save, refresh the browser to see the
change. Press `Ctrl+C` in the terminal to stop.

> You can also just double-click `index.html` — it works too. The Python server is closer to how
> the real site behaves.

**Test checklist before going live**
- [ ] Your real email is in `CONFIG`
- [ ] Submit the form — does your email app open with the details filled in?
- [ ] Shrink the browser window narrow (or open on your phone) — does it still look right?
- [ ] "Open now / Closed" badge matches the current Hawaii time

---

## 5. Put it online for free (GitHub Pages)

**Easiest way (no Git commands):**
1. On GitHub, click **New repository**. Name it e.g. `backyardmechanic`. Set it to **Public**.
   Click **Create repository**.
2. Click **uploading an existing file**, drag in `index.html`, `styles.css`, `script.js`
   (you can skip `serve.py` and this README, or include them — they don't hurt). Click **Commit changes**.
3. Go to **Settings → Pages**. Under *Build and deployment*, set Source = **Deploy from a branch**,
   Branch = **main**, folder = **/ (root)**. Click **Save**.
4. Wait 1–2 minutes and refresh. Your link appears at the top:
   `https://YOUR-USERNAME.github.io/backyardmechanic/`

**Git way (better long-term, since you're an IT major):**
```bash
cd moped-site
git init
git add .
git commit -m "First version of moped site"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/backyardmechanic.git
git push -u origin main
```
Then do step 3 above. To update later: edit → `git add .` → `git commit -m "update prices"` →
`git push`. The live site updates in about a minute.

**Optional custom domain** (~$12/year, e.g. `backyardmechanic.com`): buy it from Porkbun, Namecheap, or
Cloudflare, then follow GitHub's guide: *Settings → Pages → Custom domain*.

---

## 6. Getting customers to it

- Make a QR code of your link (free at many QR sites) and put it on a flyer for BYUH boards,
  the laundromat, and near moped parking.
- Put the link in your Instagram/Facebook bio and your phone's text signature.
- Create a free **Google Business Profile** so you show up for "moped repair Laie" on Google Maps.

---

## 7. Possible upgrades later

| Upgrade | Why | How |
|---|---|---|
| Real form submissions (no email app needed) | Some people don't have an email app set up on their phone | Free services like Formspree or Web3Forms — change the form's `action`, a few lines of JS |
| Booking calendar | Customers pick an exact slot | Embed a free Calendly or Cal.com page |
| Python backend | Store requests, send you a text | Flask app on Render or PythonAnywhere — good portfolio project |
| Photos | Builds trust | Add before/after shots of carb cleans, etc. |

# [respondr] – Assam Campus Merch Survey

A production-ready, mobile-first survey web app built with React, Vite, and Tailwind CSS for recording student preferences about college T-shirts and streetwear merchandise across all **35 districts of Assam**.

Featuring zero-custom-backend architecture: all student responses post directly to Google Sheets via Google Apps Script.

---

## 🎨 Visual Identity & Streetwear Vibe
- **Color Palette:**
  - **Gamosa Red (`#dc2626` / `#93000b`)**: Primary brand accents, action highlights, and traditional weave borders.
  - **Muga Silk Gold (`#fe932c` / `#904d00` / `#ffdcc3`)**: Exclusive badges, drop pass highlights, and price sweet-spot tags.
  - **Assam Tea Green (`#00825a` / `#85f8c4`)**: Success indicators, verified campus status, and affirmative selections.
  - **Carbon Black & Mist White (`#131b2e` & `#faf8ff`)**: Editorial streetwear backdrop.
- **Typography:**
  - **Display / Headings:** Sora font (heavy geometric aesthetic).
  - **Body Text:** Plus Jakarta Sans (ultra-clean readability).
- **Assam Cultural Motifs:**
  - Traditional Assamese diamond weave pattern dividers (*Gamosa par*).
  - Jaapi and Gamosa streetwear seal graphics.
  - Live pulse tickers with campus quotes from Cotton University, Dibrugarh University, AEC Jalukbari, Tezpur University, and Silchar colleges.

---

## 🚀 Survey Flow
1. **Landing Page:**
   - Drop 001 lookbook visual with oversized Brahmaputra Acid Wash sample card.
   - Live voting counter (2,480+ voted across 35 Assam districts).
   - "Takes under 2 mins" indicator.
   - Quick access to the Google Sheets Webhook settings and Apps Script code.
2. **Step 0: Campus Setup:**
   - District selection with bottom sheet modal covering all **35 Assam districts** with zone filters (Upper Assam, Lower Assam, Central & Hills, Barak Valley).
   - Searchable autocomplete college selector.
   - "My college isn't listed" checkbox with custom text input.
   - Study year selector (1st Fresh, 2nd Soph, 3rd Junior, 4th Senior, 5th+ PG/PhD).
3. **Q1 – Q14: Progressive Drop Voting:**
   - Kinetic progress header: Question X of 14, ~time left, % complete, and cohort badge.
   - Single-select cards with tags (Sweet Spot, Gen-Z Fav).
   - Multi-select chips with strict limit enforcement (e.g. Q7 allows max 3 with live counter).
   - Inline expanders for custom styles and garments with "Other (Specify)".
   - Q11 long-text input with circular SVG progress meter and character limit counter.
   - Visual shake animation and prompt if a required question is skipped.
4. **Review & Lock Ballot:**
   - Bento box summary of all choices.
   - One-click "Edit All" jumping back to any question.
   - Early Bird Perk voucher reminder (₹150 off at campus fest drop).
   - Anti-spam hidden honeypot and minimum time-on-form check.
5. **Thank You & Digital Street Pass:**
   - Canvas confetti burst.
   - Digital Street Pass ID generator (`#AS-2026-[DISTRICT]-[ID]`) with one-click copy.
   - WhatsApp, Telegram, and Link sharing buttons.
   - Live district heatmap standings.
   - "Submit Another Response for a Friend" button.

---

## 📊 Google Sheets Setup Guide (Apps Script Backend)

The backend code is contained in [`Code.gs`](./Code.gs).

### Step 1: Create the Google Sheet
1. Open [Google Sheets](https://sheets.new) in your browser.
2. Title it: **"[respondr] Assam Campus Merch Survey Responses"**.

### Step 2: Add the Apps Script Code
1. In the Google Sheets menu, click **Extensions > Apps Script**.
2. Erase any default code in the script editor.
3. Open [`Code.gs`](./Code.gs) from this repository, copy its entire contents, and paste it into the Apps Script editor.
4. Click the **Save** (disk) icon or press `Ctrl + S` (`Cmd + S`).

### Step 3: Deploy as a Web App
1. In the top right of Apps Script, click **Deploy > New deployment**.
2. Click the gear icon next to *Select type* and choose **Web app**.
3. Fill in the deployment configuration:
   - **Description:** `RespondR Survey Webhook v1`
   - **Execute as:** `Me (your email address)`
   - **Who has access:** <ins>**Anyone**</ins> *(Crucial: This permits the frontend to POST responses without requiring user Google sign-in)*.
4. Click **Deploy**.
5. When prompted, click **Authorize access** and approve with your Google account.
6. Copy the generated **Web app URL** (looks like `https://script.google.com/macros/s/AKfycb.../exec`).

### Step 4: Configure the Frontend
Create a `.env` file in the root directory (or copy `.env.example`):
```env
VITE_SHEETS_WEBHOOK_URL="https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec"
```
*(Note: You can also test and update the Webhook URL directly inside the app UI by clicking the **"Sheets Sync"** button in the header!)*

### Step 5: Test the Integration
You can test the endpoint in your terminal:
```bash
curl -L -X POST "https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec" \
  -H "Content-Type: text/plain;charset=utf-8" \
  -d '{"sessionId":"TEST-001","district":"Kamrup Metropolitan","college":"Cotton University","q1":"Definitely yes"}'
```
You will immediately see a new row populated in the **"Responses"** tab of your Google Sheet!

---

## 📈 Auto-Updating Analytics ("Summary" Tab)

In your Google Sheet, click the **`+`** icon at the bottom to add a second tab named **`Summary`**. Paste these formulas into cells to get live metrics:

| Metric | Formula |
|---|---|
| **Total Student Votes** | `=COUNTA(Responses!A2:A)` |
| **Top 10 Districts** | `=QUERY(Responses!A2:E, "SELECT C, count(A) WHERE C is not null GROUP BY C ORDER BY count(A) desc LIMIT 10 LABEL count(A) 'Total Votes'")` |
| **Top Colleges** | `=QUERY(Responses!A2:E, "SELECT D, count(A) WHERE D is not null GROUP BY D ORDER BY count(A) desc LIMIT 15 LABEL count(A) 'Votes'")` |
| **Q1 Purchase Intent** | `=QUERY(Responses!G2:G, "SELECT G, count(G) WHERE G is not null GROUP BY G LABEL count(G) 'Responses'")` |
| **Preferred Cut (Q5)** | `=QUERY(Responses!M2:M, "SELECT M, count(M) WHERE M is not null GROUP BY M LABEL count(M) 'Votes'")` |
| **Price Sensitivity (Q6)** | `=QUERY(Responses!N2:N, "SELECT N, count(N) WHERE N is not null GROUP BY N LABEL count(N) 'Votes'")` |

---

## 💻 Local Development

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start development server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) to view the survey.

3. **Build for production:**
   ```bash
   npm run build
   ```

---

## 🌐 Deployment Options

### Deploy to GitHub Pages (Why Blank Page Happens & How to Fix It)

> ⚠️ **Why does a blank page appear on GitHub Pages?**
> A blank page on GitHub Pages is almost always caused by one of two things:
> 1. **Deploying the raw source instead of the build:** In GitHub **Settings > Pages**, if the Source is left as *"Deploy from a branch"* pointing to `main / (root)`, GitHub Pages serves raw source code (`src/main.tsx`). Web browsers cannot execute uncompiled TypeScript/JSX, so the page is blank!
> 2. **Base path mismatch:** Asset links pointing to `/assets/...` instead of the repository name subpath (`/<repo-name>/assets/...`).

We have included automated fixes for both:
- Added `.github/workflows/deploy.yml` which automatically builds `npm run build` and deploys the compiled `dist/` directory.
- Configured dynamic base URL in `vite.config.ts` so all assets and routes resolve properly on GitHub Pages.
- Added automatic `404.html` SPA fallback copying during build.
- Added React `ErrorBoundary` so any runtime glitch displays a friendly recovery UI instead of a blank white screen.

#### Recommended Method: Automated GitHub Actions
1. In your GitHub repository, click on **Settings** (tab at the top).
2. On the left sidebar, click **Pages**.
3. Under **Build and deployment > Source**, click the dropdown and select **GitHub Actions** (NOT "Deploy from a branch").
4. Under **Settings > Actions > General > Workflow permissions**, make sure **Read and write permissions** is selected.
5. Push to `main` (or go to the **Actions** tab, click **Deploy to GitHub Pages**, and click **Run workflow**). Your site will build and publish automatically!

#### Alternative Method: One-Click CLI Deploy (`gh-pages`)
If you prefer deploying from your terminal without GitHub Actions:
1. In your project folder, run:
   ```bash
   npm run deploy
   ```
2. In GitHub repository **Settings > Pages**, select:
   - **Source:** Deploy from a branch
   - **Branch:** `gh-pages`
   - **Folder:** `/ (root)`
3. Save, and your built app will be live within 1–2 minutes.

### Deploy to Vercel
1. Push your repository to GitHub or GitLab.
2. Go to [Vercel](https://vercel.com) and click **"Add New Project"**.
3. Import your repository.
4. Under **Environment Variables**, add:
   - Name: `VITE_SHEETS_WEBHOOK_URL`
   - Value: `https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec`
5. Click **Deploy**.

### Deploy to Netlify
1. Go to [Netlify](https://www.netlify.com) and click **"Add new site" > "Import an existing project"**.
2. Select your repository.
3. Build command: `npm run build`
4. Publish directory: `dist`
5. Under **Environment variables**, set `VITE_SHEETS_WEBHOOK_URL`.
6. Click **Deploy Site**.

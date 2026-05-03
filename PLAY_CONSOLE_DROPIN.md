# Play Console drop-in package — IRIS Women's Wellness

> **Goal:** when you open Play Console, paste each block below into the matching field. ~30 min total.
> **Pre-req:** Mojjo AB Play Developer account (already exists — `developers/7149342477744999813`).

---

## Step 1 — Create the app

`Play Console → All apps → Create app`

| Field | Value |
|---|---|
| App name | `IRIS - Women's Wellness` |
| Default language | English (United States) — `en-US` |
| App or game | App |
| Free or paid | Free |
| Declarations | ☑ Developer Program Policies &nbsp;&nbsp; ☑ US export laws |

Click **Create app**.

---

## Step 2 — Set up app

You'll see "App setup" tasks on the dashboard. Do them in this order.

### 2.1 Privacy policy

`App content → Privacy policy`

```
https://iris-eye-insights.lovable.app
```

### 2.2 Ads

`App content → Ads`

> **Does your app contain ads?** → **No**

### 2.3 App access

`App content → App access`

> **All or some functionality is restricted?** → **All functionality is available without special access**
> *(IRIS doesn't require login to access core features.)*

### 2.4 Content rating (IARC questionnaire)

`App content → Content rating → Start questionnaire`

| Question | Answer |
|---|---|
| Email address | `jenny.nirs@mojjo.se` |
| Category | **Reference, News, or Educational** |
| Violence | None |
| Sexuality | None |
| Language | None |
| Controlled substances | None |
| **Does your app feature User-Generated Content (UGC) and online interactivity?** | **Yes** |
| └ UGC moderation tools? | Yes (auto-hide on 3 reports, rate-limited 3 posts/user/day) |
| └ Block users? | No (anonymous content, no user identifiers) — note in optional comment |
| └ Report content? | Yes |
| └ Privacy policy URL provided? | Yes |
| Gambling | None |
| Sensitive content / health themes | Mentions menstrual / reproductive health (educational context) |
| Miscellaneous | None |

Expected outcome: **PEGI 12 / ESRB Teen** equivalents (similar to Apple's 13+).

### 2.5 Target audience and content

`App content → Target audience and content`

| Question | Answer |
|---|---|
| Target age | **18 and over** |
| Children appeal | No |
| Designed for families | No |

### 2.6 News app

`App content → News apps` → **Not a news app**

### 2.7 COVID-19 contact tracing & status apps

→ **No** to both.

### 2.8 Government app

→ **No**.

### 2.9 Health app

`App content → Health apps`

| Question | Answer |
|---|---|
| Is your app a health app? | **Yes** |
| Health app category | Wellness / lifestyle (NOT diagnostic, NOT a medical device) |
| In-app disclaimer about not being a medical device? | Yes — present in scan results, doctor PDF, and onboarding |

### 2.10 Data safety

`App content → Data safety → Manage`

**Top-level:**

| Question | Answer |
|---|---|
| Does your app collect or share any of the required user data types? | **Yes** |
| Is all of the user data collected by your app encrypted in transit? | **Yes** (HTTPS) |
| Do you provide a way for users to request that their data be deleted? | **Yes** — both in-app (Profile → Delete Account) **and** at `https://iris-wellness.mojjo.se/delete-account` |

**Data types (3 to declare, all NOT shared with third parties, all OPTIONAL):**

| Category | Specific type | Collected | Shared | Required? | Purposes | Data optional notes |
|---|---|---|---|---|---|---|
| Health & fitness | Other health-and-fitness info | Yes | No | Optional | App functionality, Analytics | User opts into cloud sync; default is local-only |
| App activity | Other actions | Yes | No | Optional | Analytics | Anonymous event counters only |
| App activity | User-generated content | Yes | No | Optional | App functionality | Daily check-in notes; opt-in to sync |

**Data types you MUST NOT tick (the app does NOT collect):**
Personal info • Financial info • Location • Web browsing • Search history • Files & docs • Calendar • Contacts • Messages • **Photos or videos** • Audio • Health Connect • Device or other IDs • Crash logs (will become Yes once you wire Sentry — leave No for now).

### 2.11 Government developer disclosure

→ Not a government app, no disclosure needed.

### 2.12 Financial features

→ None.

---

## Step 3 — Main store listing

`Grow → Store listing → Main store listing` (English – US)

### App name (max 30)
```
IRIS - Women's Wellness
```

### Short description (max 80)
```
Privacy-first iris scanning wellness tracker for every life stage.
```

### Full description (max 4000)

```
Your eyes are part of your daily wellness ritual.

IRIS is a privacy-first wellness tracker that uses visual patterns from your eyes to deliver personalized wellness insights — all processed on your device. No photos are stored. No data leaves your phone unless you choose to share it.

WHAT MAKES IRIS DIFFERENT
Unlike traditional period trackers, IRIS combines visual wellness patterns from your eyes with daily check-ins to build a complete picture of your wellness across your entire cycle.

YOUR DAILY WELLNESS IN 10 SECONDS
Scan your eye. Get six estimated wellness scores: energy, stress, recovery, hydration, fatigue, and inflammation. Track trends over 7, 30, and 90 days.

CYCLE-AWARE COACHING
Smart coaching tips adapt to your current phase — menstrual, follicular, ovulation, or luteal. IRIS learns your patterns and suggests nutrition, movement, skincare, and recovery strategies tailored to you.

EVERY LIFE STAGE
Whether you have a regular cycle, are pregnant, postpartum, or navigating perimenopause and menopause — IRIS adapts symptom tracking, insights, and coaching to your stage of life.

DAILY CHECK-IN
Log mood, energy, sleep, symptoms, and lifestyle factors. IRIS cross-references your check-in with your scan data to surface patterns you might miss.

SHARE WITH YOUR DOCTOR
Generate a professional PDF wellness report with cycle summaries, 30-day averages, symptom patterns, and trend analysis to share with your healthcare provider if you choose.

PRIVACY BY DESIGN
- Photos analyzed on-device and immediately discarded
- Only numerical wellness scores are stored
- Server sync is opt-in with explicit consent
- No ads. No third-party data sharing.

ALSO INCLUDES
- Cycle calendar with phase predictions
- Partner mode for sharing phase info with loved ones
- Gamification: streaks, milestones, monthly progress
- Community tips from other women in your phase
- Available in 9 languages

IMPORTANT: IRIS is a wellness tool only, not a medical device. Wellness scores are estimates for personal awareness and are not medical diagnoses, assessments, or treatment recommendations. Always consult a qualified healthcare provider for medical concerns.
```

### Graphics

| Asset | Source | Path |
|---|---|---|
| App icon (512×512 PNG, no alpha) | Generated | `expo/assets/images/icon-512.png` |
| Feature graphic (1024×500 PNG/JPG) | **You — pick from Canva drafts** | See "Outstanding tasks" below |
| Phone screenshots (min 2, recommend 5–8, 16:9 or 9:16, min 320 px short side) | **You — capture on iPhone or Android emulator** | See "Outstanding tasks" |
| 7" tablet screenshots | Optional | — |
| 10" tablet screenshots | Optional | — |

### Categorization

| Field | Value |
|---|---|
| App category | **Health & Fitness** |
| Tags (up to 5) | Period Tracker, Cycle Tracking, Self Care, Wellness, Women's Health |

### Contact details

| Field | Value |
|---|---|
| Email | `jenny.nirs@mojjo.se` |
| Phone | `+46701993032` |
| Website | `https://iris-wellness.mojjo.se` |

---

## Step 4 — Swedish translation

`Grow → Store listing → Manage translations → Add translation → Swedish (sv-SE)`

### App name (max 30)
```
IRIS – Kvinnohälsa
```

### Short description (max 80)
```
Integritetsfokuserad iris-skanning och cykelkoll – för varje livsfas.
```

### Full description (max 4000)

```
Dina ögon är en del av din dagliga hälsorutin.

IRIS är en integritetsfokuserad app för välmående som använder visuella mönster i dina ögon för att ge personliga insikter — allt analyseras direkt på din enhet. Inga foton sparas. Inga data lämnar din telefon om du inte väljer att dela dem.

VAD GÖR IRIS ANNORLUNDA
Till skillnad från traditionella menskalendrar kombinerar IRIS visuella välmåendemönster från dina ögon med dagliga incheckningar för att ge en helhetsbild över hela din cykel.

DIN DAGLIGA VÄLMÅENDE PÅ 10 SEKUNDER
Skanna ditt öga. Få sex uppskattade välmåendepoäng: energi, stress, återhämtning, hydrering, trötthet och inflammation. Följ trender över 7, 30 och 90 dagar.

CYKELANPASSAD COACHING
Smarta coaching-tips anpassas efter din nuvarande fas — mens, follikulärfas, ägglossning eller lutealfas. IRIS lär sig dina mönster och föreslår kost, rörelse, hudvård och återhämtningsstrategier som passar just dig.

VARJE LIVSFAS
Oavsett om du har en regelbunden cykel, är gravid, postpartum eller navigerar i klimakteriet — IRIS anpassar symtomspårning, insikter och coaching efter din livsfas.

DAGLIG INCHECKNING
Logga humör, energi, sömn, symtom och livsstilsfaktorer. IRIS jämför din incheckning med dina skanningar och hjälper dig se mönster du annars hade missat.

DELA MED DIN LÄKARE
Skapa en professionell PDF-rapport med cykelsammanfattning, 30-dagars välmåendegenomsnitt, symtomfrekvens och trendanalys att dela med din vårdgivare om du vill.

INTEGRITET PÅ FÖRSTA PLATS
- Foton analyseras på enheten och raderas omedelbart
- Endast numeriska välmåendepoäng sparas
- Synkronisering till server är frivillig och kräver ditt samtycke
- Inga annonser. Ingen tredjepartsdelning.

INKLUDERAR ÄVEN
- Cykelkalender med fasprediktioner
- Partnerläge för att dela fasinformation med någon du litar på
- Gamification: streaks, milstolpar och månatlig progress
- Communitytips från andra kvinnor i din fas
- Tillgängligt på 9 språk

VIKTIGT: IRIS är ett verktyg för välmående, inte en medicinsk produkt. Välmåendepoängen är uppskattningar för personlig medvetenhet och utgör inte medicinska diagnoser, bedömningar eller behandlingsrekommendationer. Kontakta alltid en kvalificerad vårdgivare vid medicinska frågor.
```

---

## Step 5 — Subscriptions

`Monetize → Products → Subscriptions → Create subscription`

### Product 1 — Monthly

| Field | Value |
|---|---|
| Product ID | `iris_monthly` |
| Name | IRIS Premium Monthly |
| Description | Unlock advanced cycle insights, doctor PDF exports, and unlimited scan history. |
| Default base plan | Auto-renewing, monthly |
| Price | 49 SEK / $4.99 |
| Free trial | 7 days (recommended) |

### Product 2 — Annual

| Field | Value |
|---|---|
| Product ID | `iris_annual` |
| Name | IRIS Premium Annual |
| Description | One year of IRIS Premium — save 50% vs. monthly. |
| Default base plan | Auto-renewing, annual |
| Price | 299 SEK / $29.99 |
| Free trial | 7 days |

### Then in RevenueCat

1. Add Android app, package `se.mojjo.iris_wellness`.
2. **API access:** in Play Console → `Setup → API access`, link to a Google Cloud project, create a service account, grant the service account the role **Service Account User** + Play Console role **Finance** (View financial data, orders, and cancellation survey responses).
3. Download the JSON key, upload to RevenueCat → Project settings → Apps → Android.
4. Map products `iris_monthly` and `iris_annual` to your existing RevenueCat offerings.

---

## Step 6 — Internal testing track (recommended first)

`Test and release → Testing → Internal testing → Create new release`

1. Upload the `.aab` produced by Rork's Android build.
2. Add testers (up to 100) by email.
3. Click **Save** then **Review release** → **Start rollout to Internal testing**.
4. Testers get an opt-in URL. They install via Play Store (no APK sideload).

When happy → promote to **Closed testing** → **Open testing** → **Production**.

---

## Outstanding tasks — only you can do these

| # | Task | Why only you | Estimated time |
|---|---|---|---|
| 1 | Trigger Android build from Rork to produce the `.aab` | Only you have Rork credentials | 5 min trigger + ~30 min build queue |
| 2 | Choose & resize a feature graphic (1024×500 PNG/JPG) — pick from the 4 Canva candidates I generated, then resize | Visual / brand judgment call | 15 min |
| 3 | Capture 5–8 phone screenshots of the running app (Home, Scan, Insights, Calendar, Profile) | Need a real running app + UX framing decisions | 30 min |
| 4 | Deploy `expo/legal/delete-account.html` to `iris-wellness.mojjo.se/delete-account` (or wherever your web host is) | Web infrastructure access | 10 min |
| 5 | Pay the $25 one-time Play Console developer fee — *already done* if Mojjo AB account is active | Payment authorization | — |
| 6 | Click through Play Console UI to paste everything from this document | Browser automation blocked from Play Console | 30 min |
| 7 | Set up Google Cloud service account for RevenueCat → Play Store integration | Google account + cloud project authorization | 15 min |
| 8 | Submit for review (final button) | Legal sign-off | 1 min |

**Everything else (code, copy, content, audit) is already done.**

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
| Declarations | [x] Developer Program Policies &nbsp;&nbsp; [x] US export laws |

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

## Step 4b — German translation (Deutschland)

`Grow → Store listing → Manage translations → Add translation → German (de-DE)`

### App name (max 30)
```
IRIS – Frauenwellness
```

### Short description (max 80)
```
Datenschutzfreundliches Iris-Scannen für jede Lebensphase.
```

### Full description (max 4000)

```
Deine Augen sind Teil deiner täglichen Wellness-Routine.

IRIS ist ein datenschutzorientierter Wellness-Tracker, der visuelle Muster deiner Augen nutzt, um personalisierte Wellness-Einblicke zu liefern – alles wird auf deinem Gerät verarbeitet. Keine Fotos werden gespeichert. Keine Daten verlassen dein Telefon, es sei denn, du wählst es.

WAS MACHT IRIS ANDERS
Im Gegensatz zu klassischen Periodentrackern kombiniert IRIS visuelle Wellness-Muster aus deinen Augen mit täglichen Check-ins, um ein vollständiges Bild deiner Wellness über deinen gesamten Zyklus zu schaffen.

DEIN TÄGLICHES WELLNESS IN 10 SEKUNDEN
Scanne dein Auge. Erhalte sechs geschätzte Wellness-Werte: Energie, Stress, Erholung, Hydration, Müdigkeit und Reizung. Verfolge Trends über 7, 30 und 90 Tage.

ZYKLUSBEWUSSTES COACHING
Smarte Coaching-Tipps passen sich deiner aktuellen Phase an – Menstruation, Follikel, Eisprung oder Lutealphase. IRIS lernt deine Muster und schlägt Ernährung, Bewegung, Hautpflege und Erholungsstrategien vor, die zu dir passen.

JEDE LEBENSPHASE
Ob du einen regelmäßigen Zyklus hast, schwanger bist, postpartum bist oder dich in den Wechseljahren befindest – IRIS passt Symptomverfolgung, Einblicke und Coaching deiner Lebensphase an.

TÄGLICHES CHECK-IN
Erfasse Stimmung, Energie, Schlaf, Symptome und Lifestyle-Faktoren. IRIS gleicht dein Check-in mit deinen Scan-Daten ab und zeigt Muster, die du sonst übersehen würdest.

TEILE MIT DEINER ÄRZTIN
Erstelle einen professionellen PDF-Wellness-Bericht mit Zyklusübersicht, 30-Tage-Durchschnitten, Symptomhäufigkeit und Trendanalyse, den du mit deiner Gesundheitsanbieterin teilen kannst, wenn du möchtest.

DATENSCHUTZ ALS GRUNDLAGE
- Fotos werden auf dem Gerät analysiert und sofort verworfen
- Nur numerische Wellness-Werte werden gespeichert
- Server-Synchronisation ist freiwillig und erfordert deine Einwilligung
- Keine Werbung. Keine Weitergabe an Dritte.

ENTHÄLT AUSSERDEM
- Zykluskalender mit Phasenvorhersagen
- Partnermodus zum Teilen von Phaseninformationen mit nahestehenden Personen
- Gamification: Streaks, Meilensteine, monatlicher Fortschritt
- Community-Tipps von anderen Frauen in deiner Phase
- In 9 Sprachen verfügbar

WICHTIG: IRIS ist nur ein Wellness-Werkzeug, kein Medizinprodukt. Wellness-Werte sind Schätzungen für persönliches Bewusstsein und stellen keine medizinischen Diagnosen, Bewertungen oder Behandlungsempfehlungen dar. Konsultiere bei medizinischen Fragen immer eine qualifizierte Gesundheitsanbieterin.
```

---

## Step 4c — French translation (France)

`Grow → Store listing → Manage translations → Add translation → French (fr-FR)`

### App name (max 30)
```
IRIS – Bien-être féminin
```

### Short description (max 80)
```
Suivi bien-être confidentiel par scan d'iris, pour chaque étape de vie.
```

### Full description (max 4000)

```
Tes yeux font partie de ton rituel bien-être quotidien.

IRIS est un tracker bien-être respectueux de la vie privée qui utilise les motifs visuels de tes yeux pour offrir des aperçus personnalisés — tout est traité sur ton appareil. Aucune photo n'est stockée. Aucune donnée ne quitte ton téléphone à moins que tu ne choisisses de la partager.

CE QUI REND IRIS UNIQUE
Contrairement aux suivis de cycle classiques, IRIS combine les motifs visuels de bien-être de tes yeux avec des check-ins quotidiens pour créer une vision complète de ton bien-être sur tout ton cycle.

TON BIEN-ÊTRE QUOTIDIEN EN 10 SECONDES
Scanne ton œil. Obtiens six scores estimés de bien-être : énergie, stress, récupération, hydratation, fatigue et inflammation. Suis les tendances sur 7, 30 et 90 jours.

COACHING ADAPTÉ AU CYCLE
Des conseils intelligents s'adaptent à ta phase actuelle — menstruelle, folliculaire, ovulation ou lutéale. IRIS apprend tes habitudes et propose nutrition, mouvement, soins de la peau et stratégies de récupération qui te conviennent.

CHAQUE ÉTAPE DE LA VIE
Que tu aies un cycle régulier, sois enceinte, en post-partum ou en péri-ménopause / ménopause, IRIS adapte le suivi des symptômes, les analyses et le coaching à ta phase de vie.

CHECK-IN QUOTIDIEN
Note humeur, énergie, sommeil, symptômes et facteurs liés au mode de vie. IRIS croise ton check-in avec tes scans pour révéler des tendances que tu pourrais manquer.

PARTAGE AVEC TON MÉDECIN
Génère un rapport PDF professionnel de bien-être avec résumé de cycle, moyennes sur 30 jours, fréquence des symptômes et analyse de tendances à partager avec ton soignant si tu le souhaites.

CONFIDENTIALITÉ DÈS LA CONCEPTION
- Les photos sont analysées sur l'appareil et immédiatement supprimées
- Seuls les scores numériques de bien-être sont stockés
- La synchronisation serveur est facultative et nécessite ton consentement
- Pas de pubs. Pas de partage avec des tiers.

INCLUT ÉGALEMENT
- Calendrier du cycle avec prédictions de phases
- Mode partenaire pour partager les infos de phase avec un proche
- Gamification : streaks, jalons, progression mensuelle
- Conseils communautaires d'autres femmes dans ta phase
- Disponible en 9 langues

IMPORTANT : IRIS est uniquement un outil de bien-être, pas un dispositif médical. Les scores sont des estimations pour ta propre conscience et ne constituent pas un diagnostic, une évaluation ou une recommandation de traitement médical. Consulte toujours un professionnel de santé qualifié pour toute question médicale.
```

---

## Step 4d — Spanish translation (España)

`Grow → Store listing → Manage translations → Add translation → Spanish (es-ES)`

### App name (max 30)
```
IRIS – Bienestar femenino
```

### Short description (max 80)
```
Escaneo de iris privado y bienestar para cada etapa de tu vida.
```

### Full description (max 4000)

```
Tus ojos son parte de tu rutina diaria de bienestar.

IRIS es un seguimiento del bienestar centrado en la privacidad que usa los patrones visuales de tus ojos para ofrecerte ideas personalizadas — todo se procesa en tu dispositivo. No se guardan fotos. Tus datos no salen del teléfono salvo que tú elijas compartirlos.

LO QUE HACE A IRIS DIFERENTE
A diferencia de los seguimientos de ciclo tradicionales, IRIS combina los patrones visuales de tus ojos con check-ins diarios para construir una imagen completa de tu bienestar a lo largo de todo tu ciclo.

TU BIENESTAR DIARIO EN 10 SEGUNDOS
Escanea tu ojo. Obtén seis puntuaciones estimadas de bienestar: energía, estrés, recuperación, hidratación, fatiga e inflamación. Sigue tendencias a 7, 30 y 90 días.

COACHING AJUSTADO AL CICLO
Los consejos inteligentes se adaptan a tu fase actual — menstrual, folicular, ovulación o lútea. IRIS aprende tus patrones y sugiere nutrición, movimiento, cuidado de la piel y estrategias de recuperación a tu medida.

CADA ETAPA DE LA VIDA
Tengas un ciclo regular, estés embarazada, en posparto o atravesando perimenopausia o menopausia, IRIS adapta el seguimiento de síntomas, las observaciones y el coaching a tu etapa.

CHECK-IN DIARIO
Registra ánimo, energía, sueño, síntomas y factores de estilo de vida. IRIS cruza tu check-in con tus escaneos y descubre patrones que de otra forma pasarías por alto.

COMPÁRTELO CON TU MÉDICO
Genera un informe profesional en PDF con resumen del ciclo, promedios de 30 días, frecuencia de síntomas y análisis de tendencias para compartirlo con tu profesional sanitario si lo deseas.

PRIVACIDAD POR DISEÑO
- Las fotos se analizan en el dispositivo y se descartan inmediatamente
- Solo se almacenan puntuaciones numéricas
- La sincronización con el servidor es opcional y requiere tu consentimiento
- Sin publicidad. Sin compartir datos con terceros.

INCLUYE ADEMÁS
- Calendario del ciclo con predicciones de fase
- Modo pareja para compartir información de fase con personas cercanas
- Gamificación: rachas, logros, progreso mensual
- Consejos comunitarios de otras mujeres en tu fase
- Disponible en 9 idiomas

IMPORTANTE: IRIS es solo una herramienta de bienestar, no un producto sanitario. Las puntuaciones son estimaciones para tu propia conciencia y no constituyen diagnóstico, evaluación ni recomendación de tratamiento médico. Consulta siempre con un profesional sanitario cualificado en caso de dudas médicas.
```

---

## Step 4e — Italian translation (Italia)

`Grow → Store listing → Manage translations → Add translation → Italian (it-IT)`

### App name (max 30)
```
IRIS – Benessere femminile
```

### Short description (max 80)
```
Scansione iride orientata alla privacy per ogni fase della vita.
```

### Full description (max 4000)

```
I tuoi occhi fanno parte del tuo rituale quotidiano di benessere.

IRIS è un tracker del benessere orientato alla privacy che usa i pattern visivi dei tuoi occhi per offrire spunti personalizzati: tutto viene elaborato sul tuo dispositivo. Nessuna foto viene salvata. Nessun dato lascia il telefono se non scegli di condividerlo.

COSA RENDE IRIS DIVERSA
A differenza dei tradizionali calendari del ciclo, IRIS combina i pattern visivi del benessere dei tuoi occhi con il check-in quotidiano per costruire un quadro completo del tuo benessere lungo l'intero ciclo.

IL TUO BENESSERE QUOTIDIANO IN 10 SECONDI
Scansiona l'occhio. Ottieni sei punteggi stimati di benessere: energia, stress, recupero, idratazione, stanchezza e infiammazione. Segui le tendenze a 7, 30 e 90 giorni.

COACHING CONSAPEVOLE DEL CICLO
Suggerimenti smart si adattano alla tua fase attuale: mestruale, follicolare, ovulazione o luteale. IRIS impara i tuoi pattern e suggerisce alimentazione, movimento, cura della pelle e strategie di recupero su misura.

OGNI FASE DELLA VITA
Che tu abbia un ciclo regolare, sia incinta, postpartum o stia attraversando perimenopausa o menopausa, IRIS adatta tracciamento dei sintomi, insights e coaching alla tua fase.

CHECK-IN QUOTIDIANO
Registra umore, energia, sonno, sintomi e fattori di stile di vita. IRIS incrocia il check-in con i tuoi scan e fa emergere pattern che altrimenti perderesti.

CONDIVIDI CON IL TUO MEDICO
Genera un report PDF professionale con riepilogo del ciclo, medie a 30 giorni, frequenza dei sintomi e analisi delle tendenze, da condividere con la tua professionista sanitaria se vuoi.

PRIVACY COME PRINCIPIO
- Le foto vengono analizzate sul dispositivo e immediatamente eliminate
- Vengono memorizzati solo i punteggi numerici di benessere
- La sincronizzazione con il server è facoltativa e richiede il tuo consenso
- Niente pubblicità. Nessuna condivisione con terze parti.

INCLUDE INOLTRE
- Calendario del ciclo con previsioni di fase
- Modalità partner per condividere informazioni di fase con persone care
- Gamification: streak, traguardi, progresso mensile
- Consigli della community da altre donne nella tua fase
- Disponibile in 9 lingue

IMPORTANTE: IRIS è solo uno strumento di benessere, non un dispositivo medico. I punteggi sono stime per la consapevolezza personale e non costituiscono diagnosi, valutazioni o raccomandazioni mediche di trattamento. Consulta sempre un professionista sanitario qualificato per dubbi medici.
```

---

## Step 4f — Polish translation (Polska)

`Grow → Store listing → Manage translations → Add translation → Polish (pl-PL)`

### App name (max 30)
```
IRIS – Wellness dla kobiet
```

### Short description (max 80)
```
Skanowanie tęczówki dbające o prywatność, na każdym etapie życia.
```

### Full description (max 4000)

```
Twoje oczy są częścią Twojej codziennej rutyny dbania o samopoczucie.

IRIS to tracker wellness skupiony na prywatności, który wykorzystuje wzorce wizualne Twoich oczu, aby dostarczać spersonalizowane spostrzeżenia — wszystko jest przetwarzane na Twoim urządzeniu. Żadne zdjęcia nie są zapisywane. Żadne dane nie opuszczają Twojego telefonu, chyba że sama zdecydujesz się je udostępnić.

CO WYRÓŻNIA IRIS
W przeciwieństwie do tradycyjnych kalendarzy menstruacyjnych, IRIS łączy wizualne wzorce wellness z Twoich oczu z codziennymi check-inami, by zbudować pełny obraz Twojego samopoczucia w całym cyklu.

TWOJE CODZIENNE WELLNESS W 10 SEKUND
Zeskanuj oko. Otrzymaj sześć szacunkowych ocen: energia, stres, regeneracja, nawodnienie, zmęczenie i podrażnienie. Śledź trendy w okresach 7, 30 i 90 dni.

COACHING DOPASOWANY DO CYKLU
Inteligentne wskazówki dostosowują się do bieżącej fazy — menstruacyjnej, folikularnej, owulacyjnej lub lutealnej. IRIS uczy się Twoich wzorców i proponuje strategie żywienia, ruchu, pielęgnacji skóry i regeneracji dopasowane do Ciebie.

KAŻDY ETAP ŻYCIA
Czy masz regularny cykl, jesteś w ciąży, po porodzie lub w okresie peri- lub menopauzy — IRIS dopasowuje śledzenie objawów, spostrzeżenia i coaching do Twojego etapu życia.

CODZIENNY CHECK-IN
Notuj nastrój, energię, sen, objawy i czynniki stylu życia. IRIS porównuje check-in z danymi ze skanu i ujawnia wzorce, które inaczej mogłabyś przegapić.

UDOSTĘPNIJ LEKARZOWI
Wygeneruj profesjonalny raport PDF z podsumowaniem cyklu, średnimi z 30 dni, częstotliwością objawów i analizą trendów do udostępnienia lekarzowi, jeśli chcesz.

PRYWATNOŚĆ PRZEMYŚLANA OD POCZĄTKU
- Zdjęcia są analizowane na urządzeniu i natychmiast usuwane
- Przechowywane są tylko liczbowe oceny wellness
- Synchronizacja z serwerem jest opcjonalna i wymaga Twojej zgody
- Bez reklam. Bez udostępniania danych podmiotom trzecim.

ZAWIERA RÓWNIEŻ
- Kalendarz cyklu z predykcją fazy
- Tryb partnera do udostępniania informacji o fazie bliskim osobom
- Gamifikacja: streaki, kamienie milowe, miesięczne postępy
- Wskazówki społeczności od innych kobiet w Twojej fazie
- Dostępne w 9 językach

WAŻNE: IRIS jest wyłącznie narzędziem wellness, a nie wyrobem medycznym. Oceny są szacunkami dla osobistej świadomości, a nie diagnozami medycznymi, oceną stanu zdrowia ani rekomendacjami leczenia. Zawsze konsultuj się z wykwalifikowanym specjalistą w sprawach zdrowotnych.
```

---

## Step 4g — Portuguese translation (Brasil)

`Grow → Store listing → Manage translations → Add translation → Portuguese (Brazil) (pt-BR)`

### App name (max 30)
```
IRIS – Bem-estar feminino
```

### Short description (max 80)
```
Escaneamento de íris com privacidade, para cada fase da sua vida.
```

### Full description (max 4000)

```
Seus olhos fazem parte do seu ritual diário de bem-estar.

IRIS é um app de bem-estar centrado na privacidade que usa padrões visuais dos seus olhos para entregar insights personalizados — tudo é processado no seu dispositivo. Nenhuma foto é armazenada. Nenhum dado sai do seu celular a menos que você escolha compartilhar.

O QUE TORNA O IRIS DIFERENTE
Diferente dos calendários menstruais tradicionais, o IRIS combina padrões visuais de bem-estar dos seus olhos com check-ins diários para construir um retrato completo do seu bem-estar ao longo do ciclo.

SEU BEM-ESTAR DIÁRIO EM 10 SEGUNDOS
Escaneie o olho. Receba seis pontuações estimadas: energia, estresse, recuperação, hidratação, fadiga e inflamação. Acompanhe tendências em 7, 30 e 90 dias.

COACHING ADAPTADO AO CICLO
Dicas inteligentes se adaptam à sua fase atual — menstrual, folicular, ovulatória ou lútea. O IRIS aprende seus padrões e sugere nutrição, movimento, cuidados com a pele e estratégias de recuperação sob medida.

CADA FASE DA VIDA
Se você tem ciclo regular, está grávida, pós-parto ou atravessando perimenopausa ou menopausa, o IRIS adapta o rastreamento de sintomas, insights e coaching à sua fase.

CHECK-IN DIÁRIO
Registre humor, energia, sono, sintomas e fatores de estilo de vida. O IRIS cruza seu check-in com seus escaneamentos e revela padrões que você poderia perder.

COMPARTILHE COM SUA MÉDICA
Gere um relatório profissional em PDF com resumo do ciclo, médias de 30 dias, frequência dos sintomas e análise de tendências para compartilhar com sua profissional de saúde, se quiser.

PRIVACIDADE COMO PRINCÍPIO
- As fotos são analisadas no dispositivo e descartadas imediatamente
- Apenas as pontuações numéricas de bem-estar são armazenadas
- A sincronização com o servidor é opcional e requer seu consentimento
- Sem anúncios. Sem compartilhamento com terceiros.

TAMBÉM INCLUI
- Calendário do ciclo com previsão de fases
- Modo parceiro para compartilhar informações de fase com pessoas próximas
- Gamificação: sequências, marcos, progresso mensal
- Dicas da comunidade de outras mulheres na sua fase
- Disponível em 9 idiomas

IMPORTANTE: o IRIS é apenas uma ferramenta de bem-estar, não um dispositivo médico. As pontuações são estimativas para sua consciência pessoal e não constituem diagnóstico, avaliação ou recomendação médica de tratamento. Sempre consulte uma profissional de saúde qualificada em caso de dúvidas médicas.
```

---

## Step 4h — Dutch translation (Nederland)

`Grow → Store listing → Manage translations → Add translation → Dutch (nl-NL)`

### App name (max 30)
```
IRIS – Vrouwenwelzijn
```

### Short description (max 80)
```
Privacyvriendelijke iris-scan en cyclus-app voor elke levensfase.
```

### Full description (max 4000)

```
Je ogen zijn deel van je dagelijkse welzijnsroutine.

IRIS is een privacy-georiënteerde welzijnstracker die visuele patronen in je ogen gebruikt om gepersonaliseerde inzichten te bieden — alles wordt op je apparaat verwerkt. Geen foto's worden opgeslagen. Geen gegevens verlaten je telefoon, tenzij je daar zelf voor kiest.

WAT IRIS ANDERS MAAKT
In tegenstelling tot traditionele cyclus-apps combineert IRIS visuele welzijnspatronen uit je ogen met dagelijkse check-ins om een compleet beeld van je welzijn over je hele cyclus te bouwen.

JOUW DAGELIJKSE WELZIJN IN 10 SECONDEN
Scan je oog. Krijg zes geschatte welzijnsscores: energie, stress, herstel, hydratatie, vermoeidheid en irritatie. Volg trends over 7, 30 en 90 dagen.

CYCLUS-BEWUSTE COACHING
Slimme tips passen zich aan je huidige fase aan — menstruatie, folliculair, ovulatie of luteaal. IRIS leert je patronen kennen en suggereert voeding, beweging, huidverzorging en herstelstrategieën die bij je passen.

ELKE LEVENSFASE
Of je nu een regelmatige cyclus hebt, zwanger bent, postpartum of in de overgang zit — IRIS past symptoomregistratie, inzichten en coaching aan je levensfase aan.

DAGELIJKSE CHECK-IN
Leg stemming, energie, slaap, symptomen en leefstijlfactoren vast. IRIS koppelt je check-in aan je scangegevens en brengt patronen aan het licht die je anders zou missen.

DEEL MET JE ARTS
Genereer een professioneel pdf-welzijnsrapport met cyclusoverzicht, 30-dagen-gemiddelden, symptoomfrequentie en trendanalyse om te delen met je zorgverlener, als je dat wilt.

PRIVACY VAN DE GROND AF
- Foto's worden op het apparaat geanalyseerd en direct verwijderd
- Alleen numerieke welzijnsscores worden bewaard
- Server-synchronisatie is optioneel en vereist jouw toestemming
- Geen advertenties. Geen delen met derden.

OOK INBEGREPEN
- Cycluskalender met fasevoorspellingen
- Partnermodus om fase-informatie te delen met dierbaren
- Gamification: streaks, mijlpalen, maandelijkse voortgang
- Communitytips van andere vrouwen in jouw fase
- Beschikbaar in 9 talen

BELANGRIJK: IRIS is alleen een welzijnstool, geen medisch hulpmiddel. De welzijnsscores zijn schattingen voor persoonlijk inzicht en zijn geen medische diagnose, beoordeling of behandeladvies. Raadpleeg altijd een gekwalificeerde zorgverlener bij medische vragen.
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

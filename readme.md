# Vefforritun 2 — Verkefni 5

Þetta er mitt verkefni í Vefforritun 2 þar sem ég byggi framenda með Next.js og tengi hann við headless CMS.

## Yfirlit

Verkefnið inniheldur:

- Forsíðu með efni sem er hægt að stilla í CMS
- Síðu með lista af færslum (greinum / fréttum)
- Staka síðu fyrir færslu sem byggist á slugi

Tæknileg uppsetning:

- Next.js með App Router
- TypeScript
- Sass fyrir stíl
- Verklegt CMS-lag sem er tilbúið fyrir DatoCMS

## Reynsla

Ég notaði þetta verkefni til að setja upp:

- React / Next.js framenda með server-side rendering og static generation
- Flæði fyrir að sækja efni úr headless CMS
- Einfaldan og skýran stílhönnun með Sass

## Keyra verkefnið

1. Settu upp pakkana með:

```bash
npm install
```

2. Keyrðu þróunarþjóninn:

```bash
npm run dev
```

3. Opnaðu síðan:

```text
http://localhost:3000
```

## CMS tenging

Appið er byggt svo það vinni með CMS API. Núna notar það fallback-gögn þegar engar umhverfisbreytur eru stilltar, en það er tilbúið fyrir raunverulegt CMS.

### Stilltu umhverfisbreytur

Bættu við í `env.local` eða í Vercel stillingum:

```bash
CMS_API_URL=https://graphql.datocms.com/
CMS_API_TOKEN=your_datocms_read_only_token
```

> Athugaðu: ef þú notar ekki DatoCMS þarf að uppfæra `lib/cms.ts` með réttri API tengingu.

## Notkun

- `npm run dev` — keyrir þróunarþjón
- `npm run build` — byggir verkefnið fyrir framleiðslu
- `npm run start` — keyrir byggða útgáfu
- `npm run lint` — keyrir ESLint

## Hýsing

Ég mæli með að hýsa verkefnið á Vercel og bæta við sömu umhverfisbreytunum þar.

> Þetta repo er tilbúið til að skila og inniheldur grunnvirkni fyrir Next.js og CMS. Ef þú vilt getur þú breytt `lib/cms.ts` til að tengja beint við DatoCMS eða annað CMS.


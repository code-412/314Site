# 314 Site

Portfolio site for a freelance design studio. Four pages, no backend, no nonsense.

## Stack

- Next.js 15 (App Router)
- TypeScript (strict)
- Tailwind CSS v4

## Running locally

```bash
npm install
npm run dev
```

Opens on `localhost:3000`.

## Structure

```
src/
├── app/(site)/        ← pages inside the site shell (Header + Footer)
├── components/
│   ├── layout/        ← Header, Footer, Nav, Container
│   ├── ui/            ← Button, LinkButton, Badge, Input
│   └── sections/      ← Hero, AboutShort, ServicesPreview, FeaturedWorks, Cta
├── constants/         ← all static data (nav, services, works)
├── types/             ← shared TypeScript types
└── lib/utils.ts       ← cn() helper
```

## Pages

| Route | Description |
|---|---|
| `/` | Home — hero, about, services preview, featured work, CTA |
| `/services` | Full services list |
| `/work` | All projects |
| `/work/[slug]` | Single project |
| `/contact` | Contact form (client-side only, logs to console) |

Images are placeholders — drop real ones into `public/images/works/` matching the filenames in `src/constants/works.ts`.

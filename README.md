# Athena

> "I named this project Athena after the Greek goddess of wisdom, since I have always been fascinated by Greek mythology ever since I read the Percy Jackson series when I was in my 6th grade. I want Athena to be just that, a personification of wisdom, a companion for your academic needs."

## Overview
Early landing page scaffold using Vite + Tailwind.

## Dev

Install deps and run:

```bash
npm install
npm run dev
```

## Notes
- React used for overall app shell & routing
- Tailwind for rapid styling. The `@tailwind` directives resolve during the Vite build via PostCSS.

## Next Ideas
- Drag & drop or upload handwritten note images (PNG/JPG/PDF)
- OCR pipeline (Tesseract / external API) -> vector store indexing
- AI summary & node graph generation persisted to local DB (SQLite or LiteFS edge)
- Auth (Clerk / Supabase)
- Shareable public note collections with smart search facets

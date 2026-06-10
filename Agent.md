# Agent Notes for KINETI X

## High-Level Understanding

This repo is a React + Vite frontend app for the KINETI X brand. It is built as a landing page / informational site with a contact form, feature steps, pricing and FAQ pages, and a footer with internal navigation.

## What the Agent Should Know

- `src/main.jsx` is the actual React entry point.
- `src/App.jsx` currently renders a `BrowserRouter` and static section components.
- `src/componente/Layout.jsx` contains a router layout pattern with `<Outlet />`, but it is not currently used in the live render.
- Page files exist under `src/Page/` and appear intended for route-driven navigation.
- `Footer.jsx` and `ContactUs.jsx` already use `react-router-dom` `Link` components.
- Styling is implemented with Tailwind CSS utility classes.

## Key Directives for Working in This Repo

- Preserve the Tailwind-based class structure when modifying UI components.
- Keep `App.jsx` routing changes deliberate: the app currently shows several sections directly rather than switching routes.
- Use `npm run dev` for local development and `npm run build` for production builds.
- Run `npm run lint` after edits to keep ESLint compliance.

## Recommended Agent Actions

1. Confirm the root route and navigation behavior before adding new pages.
2. Review `package.json` if adding or removing packages; React Router is already present.
3. Keep the UI responsive: the app uses grid layouts and mobile-first Tailwind classes.
4. Treat `Router` in `package.json` as likely unused and avoid relying on it unless it is intentionally required.

## Suggested Improvements (Not Applied Yet)

- Wire `src/Page/*` components into a real route configuration if page navigation is desired.
- Use `Layout.jsx` with `RouterProvider` and nested routes for cleaner structure.
- Remove unused or stray dependencies from `package.json` if they are not needed.

## Design System

### Theme Colors

- Primary Neon: #C3FF51
- Hover Neon: #D3FE51
- Background: #E4E6EB
- Dark Card: #080809
- White Card: #FFFFFF
- Cyan Accent: #00E5FF
- Gradient: from-[#00FF41] to-[#00E5FF]
- Text Dark: #1A1A1A
- Border: #CBD5E1

### Typography

- Font: SORA
- Hero: 26px-32px
- H1: 20px-22px
- H2: 16px
- Body: 13px
- Caption: 11px

## Summary for Future Agents

This project is a frontend prototype for a Thai-language shoe rental service brand. The codebase is small, component-driven, and built around a Vite/Tailwind/React toolchain. The current app experience is more page-section-focused than fully route-driven, so route refactoring should be done carefully.
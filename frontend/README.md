# Pesa Cup — Frontend

The web frontend for the **Pesa Cup** tournament platform. Built with React 19 and Vite.

## Tech Stack

| Tool | Purpose |
|------|---------|
| React 19 | UI framework |
| Vite | Dev server & bundler |
| React Router v7 | Client-side routing |
| Axios | HTTP client |
| Lucide React / React Icons | Icons |

## Project Structure

```
src/
├── components/     # Reusable UI components (Header, Footer, Hero, Fixtures, Standings, etc.)
├── pages/          # Route-level page components (Home, Standings, Gallery, Contact, Scorers)
├── assets/         # Static assets (images, etc.)
├── css/            # Global stylesheets
└── App.jsx         # Root component with route definitions
```

## Routes

| Path | Page |
|------|------|
| `/` | Home |
| `/fixtures` | Fixtures |
| `/standings` | Standings |
| `/gallery` | Gallery |
| `/gallery/:categoryId` | Gallery Category |
| `/contact` | Contact |

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) ≥ 18 **or** [Bun](https://bun.sh/)

### Install & Run

```bash
# with npm
npm install
npm run dev

# with bun
bun install
bun run dev
```

The dev server starts at **http://localhost:5173**.

### Other Commands

```bash
npm run build    # Production build → dist/
npm run preview  # Preview production build locally
npm run lint     # Run ESLint
```

## Docker

A `dockerfile` is included for containerised development using Bun.

```bash
docker build -t pesa-cup-frontend .
docker run -p 5173:5173 pesa-cup-frontend
```

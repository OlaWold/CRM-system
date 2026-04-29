# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project context

A bilingual codebase: code identifiers are English, but user-facing strings, validation messages, commit messages, and docs are Norwegian. Match that convention when adding new UI text or error messages.

## Repo layout

Two apps in one repo, with the Spring Boot backend rooted at the repository root (not in a `backend/` directory, despite what the README's `cd backend` step suggests):

- **Backend** — Spring Boot 4 / Java 21 at the repo root. Sources under `src/main/java/com/example/crmproject/`. Maven wrapper (`./mvnw`) at the root.
- **Frontend** — React 19 + Vite + TypeScript in `frontend/`. Path alias `@/` → `frontend/src/`.

## Commands

Backend (run from repo root):
```bash
./mvnw spring-boot:run          # dev server on :8080
./mvnw test                     # run tests
./mvnw -Dtest=ClassName test    # single test class
./mvnw package                  # build jar to target/
```

Frontend (run from `frontend/`):
```bash
npm install
npm run dev                     # vite dev server on :5173
npm run build                   # tsc -b && vite build
npm run lint                    # eslint
```

## Architecture

### Backend

Per-domain package layout — each domain (`Customer`, `Tickets`, `Notes`, `Contact`) is a self-contained package with `Entity`, `Repository`, `Service`, `Controller` side by side. Follow this convention when adding new domains.

Entity model:
- `Customer` 1—N `Tickets` 1—N `Notes`. `Tickets.customer` is `@ManyToOne(LAZY)`; `Notes.ticket` is `@ManyToOne` (eager).
- `Customer` 1—N `Contact`. `Contact.customer` is `@ManyToOne(LAZY)`. Customer keeps its own `firstName`/`lastName`/`email`/`phone` as the "main contact" — Contact entries are additional people. These overlap; deduplicate only if asked.
- Each entity has both an internal `id` (DB PK, auto-generated) and a human-facing sequential number (`customerNo`, `ticketNo`) computed in the service via `findMax...() + 1`. Preserve this pattern — frontend filters/searches use the human numbers.
- Create requests use nested `record CreateXRequest` types inside the entity class with `@NotBlank` / `@Email` validation, applied via `@Valid` in controllers.
- `Tickets.TicketStatus` enum (`OPEN`, `IN_PROGRESS`, `WAITING`, `CLOSED`) is stored as `EnumType.STRING`. `setStatus(null)` defaults to `OPEN`.
- Hibernate `ddl-auto=update` — schema is auto-migrated on boot, no migration tool. Be cautious about renaming columns.

REST surface:
- All endpoints under `/api/v1/`. Controllers map `customers`, `tickets`, and `tickets/{id}/notes` (notes are nested under tickets).
- CORS is configured globally in `CorsConfig` for `http://localhost:5173` on `/api/v1/**`. Some controllers also redundantly carry `@CrossOrigin` annotations — both exist; either works.
- `PageSerializationMode.VIA_DTO` is enabled globally (see `CrmProjectApplication`) so paged responses serialize stably.

### Frontend

- Routing in `App.tsx` uses `react-router-dom` v7 with a single `MainLayout` shell. Pages live in `src/pages/`; per-domain feature components live in `src/components/Customers/` and `src/components/Tickets/`.
- shadcn/ui (`new-york` style, neutral base) generates primitives into `src/components/ui/`. Icon library is `lucide-react`. Don't hand-edit ui primitives — re-run shadcn add.
- Forms use `react-hook-form`. Validation messages are Norwegian (e.g. `"Org.nummer må være 9 siffer"`).
- API access: components currently `fetch("http://localhost:8080/api/v1/...")` directly with absolute URLs. A Vite proxy is also configured (`/api` → `:8080`) — prefer relative `/api/...` for new code so it works behind the proxy.

### Database

PostgreSQL on `localhost:5433`, database `crm_project`. Credentials live in `src/main/resources/application.properties` (committed — this is dev-only). Bring your own postgres; there is no docker-compose.

## Conventions worth knowing

- Norwegian for any user-visible string, including controller-thrown error messages (`"Fant ikke kunde med id ..."`).
- Error handling is intentionally sparse — services throw `RuntimeException` / `IllegalArgumentException` / `orElseThrow()` and let Spring surface defaults. Don't add global exception handlers unless asked.
- Customer search (`/customers/search?q=`) tries to parse `q` as a number first (matches `customerNo`) and falls back to case-insensitive company-name contains. Preserve this dual behavior.

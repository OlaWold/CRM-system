# CRM-system med AI

Et webbasert CRM med innebygd AI-assistanse; sammendrag av kundeaktivitet, svarforslag på saker, og automatisk håndtering av innkommende e-post som tickets. AI-modellen kjører lokalt via [Ollama](https://ollama.com), så ingen kundedata sendes til skytjenester.

## AI-funksjoner

- **AI-sammendrag på kundekortet** — én klikk gir et kort sammendrag av kundens tickets, avtaler, kontakter og produkter, slik at en saksbehandler raskt får oversikt.
- **AI-assistent på tickets** — sammendrag av sakshistorikken og forslag til svar til kunden (kun aktive saker). Svaret kan kopieres direkte til en e-post.
- **Innkommende e-post → ticket** — IMAP-poller leser uleste mail, matcher avsenderen mot eksisterende kontakter eller kunder, og oppretter ticket på riktig kunde. Ukjente avsendere havner i en egen "Innkommende"-liste for manuell tildeling.

Hele AI-stacken er valgfri — appen fungerer fint uten Ollama, men da uten sammendrag og svarforslag.

## Funksjonalitet for øvrig

- kunder med søk på navn/kundenummer
- flere kontaktpersoner pr. kunde
- tickets med status (Åpen, Pågår, Venter, Lukket), notater og kontakthistorikk
- produktkatalog med kobling kunde-produkt
- aktivitetskalender med møter, telefonsamtaler, oppgaver pr. kunde
- dashboard med statistikk, ukesgraf og aktivitetsfeed
- mørk modus

## Teknologistack

**Frontend**
- React 19, TypeScript, Vite
- Tailwind CSS, shadcn/ui
- Inline SVG-graf (ingen ekstern chart-lib)

**Backend**
- Java 21, Spring Boot 4
- Spring Data JPA / Hibernate
- Spring Validation, Spring Mail (Jakarta Mail)
- RestClient mot Ollama

**Database**
- PostgreSQL

**AI**
- Ollama (lokal LLM, default `llama3.2` 3B; anbefalt `qwen2.5:7b` for bedre norsk)

## Kom i gang

### Forutsetninger

- Java 21
- Node.js 20+ og npm
- Docker (anbefalt — kjører Postgres og Ollama lokalt)

### Rask oppstart med Docker

```bash
git clone https://github.com/OlaWold/CRM-system.git
cd CRM-system
./setup.sh
```

`setup.sh` starter Postgres og Ollama i Docker, og laster ned default LLM (`llama3.2`, ~2 GB). Tar et par minutter første gang.

Etterpå:

```bash
./mvnw spring-boot:run                          # backend på :8080
cd frontend && npm install && npm run dev       # frontend på :5173
```

For å stoppe Docker-tjenestene: `docker compose down`. For å starte igjen: `docker compose up -d`.

### Manuell oppstart (uten Docker)

**1. Postgres** — opprett databasen `crm_project` på `localhost:5433` med bruker `sa` og passord som matcher `src/main/resources/application.properties`. Hibernate (`ddl-auto=update`) lager tabellene ved første oppstart.

**2. Ollama (valgfritt — for AI-funksjoner)**

```bash
brew install ollama        # macOS
ollama serve               # i én terminal — la den stå
ollama pull llama3.2       # i en annen terminal
```

**3. Start backend og frontend** som over.

## AI-konfigurasjon

### Velge modell

Default er `llama3.2` (3B, 2 GB) fordi den kjører på de fleste maskiner med 8 GB RAM. Den er liten og ikke best på norsk.

For klart bedre norsk kvalitet, bytt til en større modell:

| Modell | Størrelse | RAM | Norsk |
|---|---|---|---|
| `llama3.2` (default) | 2 GB | ~3 GB | OK |
| `qwen2.5:7b` | 4.7 GB | ~6 GB | Bra |
| `gemma2:9b` | 5.4 GB | ~7 GB | Bra |
| `mistral:7b` | 4.1 GB | ~5 GB | OK |

Last ned ønsket modell og overstyr default via miljøvariabel:

```bash
export OLLAMA_MODEL=qwen2.5:7b
ollama pull qwen2.5:7b              # uten Docker
docker compose exec ollama ollama pull qwen2.5:7b   # med Docker
./mvnw spring-boot:run
```

Default i koden forblir `llama3.2` slik at andre uten kraftig maskin kan kjøre prosjektet rett ut av boksen.

### Innkommende e-post (IMAP)

Backend kan poll-e en e-postkonto og automatisk lage tickets av uleste mail. Av som default.

Aktiveres via miljøvariabler:

```bash
export MAIL_ENABLED=true
export MAIL_HOST=imap.gmail.com           # eller outlook.office365.com osv.
export MAIL_PORT=993
export MAIL_USER=din-adresse@example.com
export MAIL_PASSWORD=app-passord-her       # IKKE ditt vanlige passord
export MAIL_FOLDER=INBOX
export MAIL_POLL_INTERVAL_MS=60000         # 1 minutt
./mvnw spring-boot:run
```

**Gmail:** krever 2FA + app-passord, generer på https://myaccount.google.com/apppasswords.
**Outlook/Office 365:** samme — 2FA + app-passord via https://account.microsoft.com/security.

Backend leser uleste mailer fra konfigurert mappe og markerer dem som lest etter behandling. Avsendere matches mot `Contact.email` først, så `Customer.email`. Ukjente avsendere havner i "Innkommende"-listen.

For testing uten ekte IMAP, POST en mail manuelt:

```bash
curl -X POST http://localhost:8080/api/v1/emails/import \
  -H 'Content-Type: application/json' \
  -d '{"fromEmail":"test@example.com","fromName":"Test","subject":"Hei","body":"En testmelding"}'
```

## Arkitektur

Per-domene-pakker på backend (`Customer`, `Contact`, `Tickets`, `Notes`, `Activity`, `Product`, `CustomerProduct`, `Email`, `Ai`). Hver pakke har Entity, Repository, Service og Controller.

REST-endepunkter under `/api/v1/`. Frontenden er en SPA som snakker med backend via Vite-proxy.

AI-kallene går fra backend → Ollama lokalt — frontend ser bare et POST-endepunkt som returnerer en tekstrespons. Ingen LLM-data lagres mellom requestene; sammendrag genereres fersk hver gang.

## Videreutvikling

- innlogging og brukerroller
- vedlegg på saker
- prioritet og SLA på tickets
- automatisk eskalering av gamle saker
- e-posthistorikk per kunde
- arkivering av inaktive kunder
- rapportside for statistikk over tid
- streaming av AI-svar (token-for-token rendering)
- vektor-søk i historikk for bedre AI-kontekst

# CRM System

Et webbasert CRM-system for håndtering av kunder, kontakter, tickets og notater.

## Om prosjektet

Prosjektet gir en enkel oversikt over kunder og saker i ett system. Løsningen gjør det mulig å registrere kunder, knytte kontaktpersoner mot dem, opprette tickets, legge til notater på sakene, oppdatere status og søke i kundebasen.

## Funksjonalitet

- opprette og vise kunder
- søke etter kunder (på navn eller kundenummer)
- registrere flere kontaktpersoner pr. kunde
- opprette tickets knyttet til kunde
- oppdatere ticketstatus (Åpen, Pågår, Venter, Lukket)
- legge til notater på en ticket
- vise tickets pr. kunde
- filtrere tickets på status

Flere funksjoner kommer fortløpende.

## Teknologistack

**Frontend**
- React 19
- TypeScript
- Vite
- Tailwind CSS
- shadcn/ui

**Backend**
- Java 21
- Spring Boot 4
- Spring Data JPA / Hibernate
- Spring Validation

**Database**
- PostgreSQL

## Kom i gang

### Forutsetninger

- Java 21
- Node.js 20+ og npm
- PostgreSQL (lokal eller via Docker)

### 1. Klon prosjektet

```bash
git clone https://github.com/OlaWold/CRM-system.git
cd CRM-system
```

### 2. Sett opp database

Backend forventer en PostgreSQL-database `crm_project` på `localhost:5433`. Opprett databasen med dine egne credentials:

```bash
createdb -h localhost -p 5433 -U <bruker> crm_project
```

Eller via Docker:

```bash
docker run --name crm-postgres \
  -e POSTGRES_DB=crm_project \
  -e POSTGRES_USER=sa \
  -e POSTGRES_PASSWORD=<ditt-passord> \
  -p 5433:5432 \
  -d postgres:16
```

Oppdater `src/main/resources/application.properties` med riktig brukernavn og passord:

```properties
spring.datasource.url=jdbc:postgresql://localhost:5433/crm_project
spring.datasource.username=<bruker>
spring.datasource.password=<passord>
```

Hibernate er satt opp med `ddl-auto=update`, så tabellene opprettes automatisk ved første oppstart.

### 3. Start backend

Fra rotmappen:

```bash
./mvnw spring-boot:run
```

Backend kjører på `http://localhost:8080`. REST-endepunkter ligger under `/api/v1/`.

### 4. Start frontend

I et nytt terminalvindu:

```bash
cd frontend
npm install
npm run dev
```

Frontend kjører på `http://localhost:5173` og snakker med backend via proxy.

## Videreutvikling

- innlogging og brukerroller
- aktivitetslogg på kunde og ticket
- filtrering, sortering og søk på flere felt
- vedlegg på saker
- e-posthistorikk per kunde
- statusendringer med tidsstempel
- prioritet på tickets: lav, medium, høy, kritisk
- tildeling av sak til ansatt
- kommentartråd på sak
- frist og forfallsdato
- visning av siste aktivitet på kunden
- arkivering av inaktive kunder
- egne kategorier eller tags på saker
- SLA på tickets
- automatisk eskalering av gamle saker
- varsler i systemet
- intern chat eller kommentarer mellom ansatte
- kundehistorikk på tvers av alle saker
- kobling mot e-post så tickets kan opprettes fra innkommende mail
- rapportside for statistikk over tid

# CRM System

Et webbasert CRM-system for håndtering av kunder, tickets også skal oppfølging videreutvikles.

## Om prosjektet

Dette prosjektet er utviklet for å gi en enkel oversikt over kunder og saker i ett system. Løsningen gjør det mulig å registrere kunder, opprette tickets, oppdatere status og følge med på historikk og tidligere notater.

## Funksjonalitet

- opprette og vise kunder
- søke etter kunder
- opprette tickets knyttet til kunde
- oppdatere ticketstatus
- vise tickets per kunde
- filtrere og sortere saker

## Teknologistack

Frontend:
- React
- TypeScript
- Vite
- Tailwind CSS
- shadcn/ui

Backend:
- Java
- Spring Boot
- Spring Data JPA
- Hibernate

Database:
- PostgreSQL

## Kom i gang

Backend:

cd backend
./mvnw spring-boot:run

Backend kjører på http://localhost:8080

Frontend:

cd frontend
npm install
npm run dev

Frontend kjører på http://localhost:5173


## Vidreutvikling

innlogging og brukerroller
aktivitetslogg på kunde og ticket
filtrering, sortering og søk på flere felt
vedlegg på saker
e-posthistorikk per kunde
statusendringer med tidsstempel
prioritet på tickets: lav, medium, høy, kritisk
tildeling av sak til ansatt
kommentartråd på sak
frist og forfallsdato
visning av siste aktivitet på kunden
arkivering av inaktive kunder
egne kategorier eller tags på saker
unngå at fetch kjører unødvendig i systemet når det ikke trengs
SLA på tickets
automatisk eskalering av gamle saker
varsler i systemet
intern chat eller kommentarer mellom ansatte
kundehistorikk på tvers av alle saker
kobling mot e-post så tickets kan opprettes fra innkommende mail
rapportside for statistikk over tid


### Klon prosjektet

```bash
git clone <repo-url>
cd Eget CRM
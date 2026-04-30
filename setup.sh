#!/usr/bin/env bash
# Starter Postgres og Ollama via Docker, og laster ned Ollama-modellen.
# Kjør én gang etter klone — deretter holder `docker compose up -d` og `docker compose down`.

set -euo pipefail

MODEL="${OLLAMA_MODEL:-llama3.2}"

if ! command -v docker >/dev/null 2>&1; then
    echo "Feil: Docker er ikke installert. Last ned fra https://docker.com og kjør på nytt."
    exit 1
fi

echo "Starter Postgres og Ollama..."
docker compose up -d

echo "Venter på at Ollama er klar..."
for i in {1..30}; do
    if docker compose exec -T ollama ollama list >/dev/null 2>&1; then
        break
    fi
    sleep 2
done

echo "Laster ned modell '$MODEL' (kan ta noen minutter første gang)..."
docker compose exec -T ollama ollama pull "$MODEL"

echo ""
echo "Ferdig. Nå kan du starte appen:"
echo "  Backend:  ./mvnw spring-boot:run"
echo "  Frontend: cd frontend && npm install && npm run dev"

import { Sparkles, RefreshCw } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

type Props = {
    customerId: number;
};

export default function AiSummary({ customerId }: Props) {
    const [summary, setSummary] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    async function generate() {
        setLoading(true);
        setError(null);
        try {
            const res = await fetch(
                `http://localhost:8080/api/v1/customers/${customerId}/ai-summary`,
                { method: "POST" }
            );
            if (!res.ok) {
                const text = await res.text();
                throw new Error(text || "Kunne ikke generere sammendrag");
            }
            const data = await res.json();
            setSummary(data.summary);
        } catch (e) {
            setError(e instanceof Error ? e.message : "Ukjent feil");
        } finally {
            setLoading(false);
        }
    }

    return (
        <section className="rounded-md border bg-card">
            <div className="flex items-center justify-between border-b px-3 py-2">
                <h3 className="flex items-center gap-2 text-sm font-medium">
                    <Sparkles size={14} className="text-muted-foreground" />
                    AI-sammendrag
                </h3>
                <Button
                    size="sm"
                    variant="outline"
                    onClick={generate}
                    disabled={loading}
                >
                    {summary ? (
                        <>
                            <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
                            Generer på nytt
                        </>
                    ) : loading ? (
                        "Genererer..."
                    ) : (
                        "Generer sammendrag"
                    )}
                </Button>
            </div>
            <div className="px-3 py-3 text-sm">
                {loading && !summary && (
                    <p className="text-muted-foreground">Lager sammendrag…</p>
                )}
                {!loading && !summary && !error && (
                    <p className="text-muted-foreground">
                        Klikk for å generere et kort AI-sammendrag av kundens aktivitet.
                    </p>
                )}
                {summary && <p className="whitespace-pre-wrap break-words">{summary}</p>}
                {error && <p className="text-red-600">{error}</p>}
            </div>
        </section>
    );
}

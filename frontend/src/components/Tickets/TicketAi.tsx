import { Sparkles, RefreshCw, Copy, Check } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

type TicketStatus = "OPEN" | "IN_PROGRESS" | "WAITING" | "CLOSED";

type Props = {
    ticketId: number;
    status: TicketStatus;
};

export default function TicketAi({ ticketId, status }: Props) {
    const [summary, setSummary] = useState<string | null>(null);
    const [reply, setReply] = useState<string | null>(null);
    const [loadingSummary, setLoadingSummary] = useState(false);
    const [loadingReply, setLoadingReply] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [copied, setCopied] = useState(false);

    const canReply = status !== "CLOSED";

    async function generateSummary() {
        setLoadingSummary(true);
        setError(null);
        try {
            const res = await fetch(
                `http://localhost:8080/api/v1/tickets/${ticketId}/ai-summary`,
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
            setLoadingSummary(false);
        }
    }

    async function generateReply() {
        setLoadingReply(true);
        setError(null);
        try {
            const res = await fetch(
                `http://localhost:8080/api/v1/tickets/${ticketId}/ai-reply`,
                { method: "POST" }
            );
            if (!res.ok) {
                const text = await res.text();
                throw new Error(text || "Kunne ikke generere svarforslag");
            }
            const data = await res.json();
            setReply(data.reply);
        } catch (e) {
            setError(e instanceof Error ? e.message : "Ukjent feil");
        } finally {
            setLoadingReply(false);
        }
    }

    async function copyReply() {
        if (!reply) return;
        try {
            await navigator.clipboard.writeText(reply);
            setCopied(true);
            setTimeout(() => setCopied(false), 1500);
        } catch (e) {
            console.error(e);
        }
    }

    return (
        <section className="rounded-md border bg-card">
            <div className="flex items-center justify-between border-b px-3 py-2">
                <h3 className="flex items-center gap-2 text-sm font-medium">
                    <Sparkles size={14} className="text-muted-foreground" />
                    AI-assistent
                </h3>
                <div className="flex flex-wrap gap-2">
                    <Button
                        size="sm"
                        variant="outline"
                        onClick={generateSummary}
                        disabled={loadingSummary}
                    >
                        {summary ? (
                            <>
                                <RefreshCw size={14} className={loadingSummary ? "animate-spin" : ""} />
                                Sammendrag
                            </>
                        ) : loadingSummary ? (
                            "Genererer..."
                        ) : (
                            "Sammendrag"
                        )}
                    </Button>
                    {canReply && (
                        <Button
                            size="sm"
                            variant="outline"
                            onClick={generateReply}
                            disabled={loadingReply}
                        >
                            {reply ? (
                                <>
                                    <RefreshCw size={14} className={loadingReply ? "animate-spin" : ""} />
                                    Svarforslag
                                </>
                            ) : loadingReply ? (
                                "Genererer..."
                            ) : (
                                "Svarforslag"
                            )}
                        </Button>
                    )}
                </div>
            </div>

            <div className="space-y-3 px-3 py-3 text-sm">
                {!summary && !reply && !loadingSummary && !loadingReply && !error && (
                    <p className="text-muted-foreground">
                        Klikk "Sammendrag" for et kort sammendrag av saken
                        {canReply ? ", eller \"Svarforslag\" for et utkast til kundesvar." : "."}
                    </p>
                )}

                {(loadingSummary && !summary) && (
                    <p className="text-muted-foreground">Lager sammendrag…</p>
                )}

                {summary && (
                    <div>
                        <p className="mb-1 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                            Sammendrag
                        </p>
                        <p className="whitespace-pre-wrap break-words">{summary}</p>
                    </div>
                )}

                {(loadingReply && !reply) && (
                    <p className="text-muted-foreground">Lager svarforslag…</p>
                )}

                {reply && (
                    <div>
                        <div className="mb-1 flex items-center justify-between">
                            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                                Svarforslag
                            </p>
                            <Button size="xs" variant="outline" onClick={copyReply}>
                                {copied ? (
                                    <>
                                        <Check size={12} /> Kopiert
                                    </>
                                ) : (
                                    <>
                                        <Copy size={12} /> Kopier
                                    </>
                                )}
                            </Button>
                        </div>
                        <p className="whitespace-pre-wrap break-words rounded-md border bg-muted/40 p-2">
                            {reply}
                        </p>
                    </div>
                )}

                {error && <p className="text-red-600">{error}</p>}
            </div>
        </section>
    );
}

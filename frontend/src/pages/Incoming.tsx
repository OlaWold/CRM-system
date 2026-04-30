import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import AssignCustomerModal from "@/components/Incoming/AssignCustomerModal";

type IncomingTicket = {
    id: number;
    ticketNo: number;
    subject: string;
    description: string;
    email: string;
    contactName: string;
    companyName: string;
    created: string;
};

export default function Incoming() {
    const [tickets, setTickets] = useState<IncomingTicket[]>([]);
    const [expanded, setExpanded] = useState<Set<number>>(new Set());
    const [assignTicketId, setAssignTicketId] = useState<number | null>(null);

    const load = useCallback(async () => {
        try {
            const res = await fetch("http://localhost:8080/api/v1/tickets/incoming");
            if (!res.ok) throw new Error("Kunne ikke hente innkommende tickets");
            setTickets(await res.json());
        } catch (e) {
            console.error(e);
        }
    }, []);

    useEffect(() => {
        load();
    }, [load]);

    function toggle(id: number) {
        setExpanded((prev) => {
            const next = new Set(prev);
            if (next.has(id)) next.delete(id);
            else next.add(id);
            return next;
        });
    }

    return (
        <div className="space-y-4">
            <header>
                <h1 className="text-xl font-semibold">Innkommende tickets</h1>
                <p className="text-sm text-muted-foreground">
                    Tickets opprettet fra e-post fra ukjente avsendere. Tildel en kunde for å flytte sak til kundens ticket-liste.
                </p>
            </header>

            {tickets.length === 0 ? (
                <div className="rounded-md border bg-card px-4 py-6 text-sm text-muted-foreground">
                    Ingen innkommende tickets uten kunde.
                </div>
            ) : (
                <ul className="space-y-2">
                    {tickets.map((t) => {
                        const isOpen = expanded.has(t.id);
                        return (
                            <li key={t.id} className="rounded-md border bg-card">
                                <button
                                    type="button"
                                    onClick={() => toggle(t.id)}
                                    className="flex w-full flex-col gap-1 px-3 py-2 text-left hover:bg-accent sm:flex-row sm:items-center sm:gap-4"
                                >
                                    <span className="w-32 shrink-0 text-xs text-muted-foreground">
                                        {new Date(t.created).toLocaleString("no-NO", {
                                            day: "2-digit",
                                            month: "short",
                                            hour: "2-digit",
                                            minute: "2-digit",
                                        })}
                                    </span>
                                    <span className="min-w-0 flex-1 truncate font-medium">{t.subject}</span>
                                    <span className="text-sm text-muted-foreground">{t.email}</span>
                                </button>

                                {isOpen && (
                                    <div className="space-y-3 border-t px-3 py-3 text-sm">
                                        <div>
                                            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                                                Avsender
                                            </p>
                                            <p>{t.contactName} &lt;{t.email}&gt;</p>
                                        </div>
                                        <div>
                                            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                                                Innhold
                                            </p>
                                            <p className="whitespace-pre-wrap break-words">{t.description}</p>
                                        </div>
                                        <div className="flex justify-end">
                                            <Button
                                                size="sm"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setAssignTicketId(t.id);
                                                }}
                                            >
                                                Tildel kunde
                                            </Button>
                                        </div>
                                    </div>
                                )}
                            </li>
                        );
                    })}
                </ul>
            )}

            {assignTicketId !== null && (
                <AssignCustomerModal
                    ticketId={assignTicketId}
                    onClose={() => setAssignTicketId(null)}
                    onAssigned={() => {
                        setAssignTicketId(null);
                        load();
                    }}
                />
            )}
        </div>
    );
}

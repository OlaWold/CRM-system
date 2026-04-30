import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import TicketNotes from "@/components/Tickets/AddNotes";
import TicketAi from "@/components/Tickets/TicketAi";

type TicketStatus = "OPEN" | "IN_PROGRESS" | "WAITING" | "CLOSED";

type Ticket = {
    id: number;
    ticketNo: number;
    subject: string;
    description: string;
    companyName: string;
    status: TicketStatus;
    updatedLast: string;
    created: string;
    contactName: string;
    email: string;
    phone: string;
};

const statusLabels: Record<TicketStatus, string> = {
    OPEN: "Åpen",
    IN_PROGRESS: "Pågår",
    WAITING: "Venter",
    CLOSED: "Lukket",
};

const statusBadge: Record<TicketStatus, string> = {
    OPEN: "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300",
    IN_PROGRESS: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-200",
    WAITING: "bg-orange-100 text-orange-800 dark:bg-orange-900/40 dark:text-orange-200",
    CLOSED: "bg-muted text-muted-foreground",
};

export default function DisplayTickets() {
    const { id } = useParams();
    const [ticket, setTicket] = useState<Ticket | null>(null);

    useEffect(() => {
        const loadTicket = async () => {
            try {
                const response = await fetch(`http://localhost:8080/api/v1/tickets/${id}`);
                if (!response.ok) throw new Error("Failed to fetch ticket");
                const data = await response.json();
                setTicket(data);
            } catch (error) {
                console.error(error);
            }
        };
        if (id) {
            loadTicket();
        }
    }, [id]);

    const updateTicketStatus = async (status: TicketStatus) => {
        try {
            const response = await fetch(`http://localhost:8080/api/v1/tickets/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status }),
            });
            if (!response.ok) {
                throw new Error("Failed to update ticket");
            }
            setTicket(await response.json());
        } catch (error) {
            console.error(error);
        }
    };

    if (!ticket) {
        return null;
    }

    return (
        <div className="mx-auto w-full max-w-5xl space-y-4">
            <header>
                <h1 className="text-xl font-semibold">Ticketoversikt</h1>
            </header>

            <div className="rounded-md border bg-card">
                <div className="flex flex-col gap-2 border-b px-4 py-3 sm:flex-row sm:items-start sm:justify-between">
                    <div className="min-w-0">
                        <p className="text-sm text-muted-foreground">Ticket #{ticket.ticketNo}</p>
                        <h2 className="break-words text-base font-semibold">{ticket.subject}</h2>
                        <p className="break-words text-sm text-muted-foreground">{ticket.companyName}</p>
                    </div>
                    <span
                        className={`self-start whitespace-nowrap rounded-md px-2 py-1 text-xs font-medium ${statusBadge[ticket.status]}`}
                    >
                        {statusLabels[ticket.status]}
                    </span>
                </div>

                <div className="grid grid-cols-1 gap-3 p-3 sm:gap-4 sm:p-4 md:grid-cols-2">
                    <section className="rounded-md border">
                        <h3 className="border-b px-3 py-2 text-sm font-medium">Beskrivelse</h3>
                        <p className="whitespace-pre-wrap break-words px-3 py-3 text-sm">{ticket.description}</p>
                    </section>

                    <section className="rounded-md border">
                        <h3 className="border-b px-3 py-2 text-sm font-medium">Kontaktinfo</h3>
                        <dl className="grid grid-cols-[max-content_minmax(0,1fr)] gap-x-4 gap-y-1 px-3 py-3 text-sm">
                            <dt className="text-muted-foreground">Firmanavn</dt>
                            <dd className="min-w-0 break-words">{ticket.companyName}</dd>
                            <dt className="text-muted-foreground">Navn</dt>
                            <dd className="min-w-0 break-words">{ticket.contactName}</dd>
                            <dt className="text-muted-foreground">Telefon</dt>
                            <dd className="min-w-0 break-words">{ticket.phone}</dd>
                            <dt className="text-muted-foreground">E-post</dt>
                            <dd className="min-w-0 break-words">{ticket.email}</dd>
                        </dl>
                    </section>

                    <section className="rounded-md border">
                        <h3 className="border-b px-3 py-2 text-sm font-medium">Opprettet</h3>
                        <p className="px-3 py-3 text-sm">
                            {new Date(ticket.created).toLocaleString("no-NO", {
                                day: "numeric",
                                month: "long",
                                year: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                            })}
                        </p>
                    </section>

                    <section className="rounded-md border">
                        <h3 className="border-b px-3 py-2 text-sm font-medium">Endre status</h3>
                        <div className="grid grid-cols-2 gap-2 px-3 py-3 sm:flex sm:flex-wrap">
                            {(Object.keys(statusLabels) as TicketStatus[]).map((status) => (
                                <Button
                                    key={status}
                                    size="sm"
                                    variant={ticket.status === status ? "default" : "outline"}
                                    onClick={() => updateTicketStatus(status)}
                                >
                                    {statusLabels[status]}
                                </Button>
                            ))}
                        </div>
                    </section>
                </div>
            </div>

            <TicketAi ticketId={ticket.id} status={ticket.status} />

            <div className="rounded-md border bg-card">
                <TicketNotes />
            </div>
        </div>
    );
}

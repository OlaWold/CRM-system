import { useCallback, useEffect, useState } from "react";
import { X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { CreateTickets } from "@/components/Tickets/CreateTicket";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

type TicketStatus = "OPEN" | "IN_PROGRESS" | "WAITING" | "CLOSED";

type Ticket = {
    id: number;
    ticketNo: number;
    subject: string;
    companyName: string;
    status: TicketStatus;
    updatedLast: string;
};

const statusLabels: Record<TicketStatus, string> = {
    OPEN: "Åpen",
    WAITING: "Venter",
    IN_PROGRESS: "Pågår",
    CLOSED: "Lukket",
};

export function GetTickets() {
    const [tickets, setTickets] = useState<Ticket[]>([]);
    const [selectedStatus, setSelectedStatus] = useState<TicketStatus>("OPEN");
    const [showForm, setShowForm] = useState(false);
    const navigate = useNavigate();

    const loadTickets = useCallback(async () => {
        try {
            const response = await fetch("http://localhost:8080/api/v1/tickets");
            if (!response.ok) throw new Error("Failed to fetch tickets");
            const data = await response.json();
            setTickets(data);
        } catch (error) {
            console.error(error);
        }
    }, []);

    useEffect(() => {
        loadTickets();
    }, [loadTickets]);

    const filteredTickets = tickets.filter((ticket) => ticket.status === selectedStatus);

    return (
        <div className="space-y-4">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <Select value={selectedStatus} onValueChange={(v) => setSelectedStatus(v as TicketStatus)}>
                    <SelectTrigger className="w-48">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            <SelectItem value="OPEN">Åpen</SelectItem>
                            <SelectItem value="WAITING">Venter</SelectItem>
                            <SelectItem value="IN_PROGRESS">Pågår</SelectItem>
                            <SelectItem value="CLOSED">Lukket</SelectItem>
                        </SelectGroup>
                    </SelectContent>
                </Select>

                <Button type="button" onClick={() => setShowForm(true)}>
                    Opprett ticket
                </Button>
            </div>

            {showForm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
                    <div className="w-full max-w-xl rounded-md border bg-white">
                        <div className="flex items-center justify-between border-b px-4 py-3">
                            <h2 className="text-base font-semibold">Ny ticket</h2>
                            <button
                                type="button"
                                onClick={() => setShowForm(false)}
                                className="rounded-md p-1.5 hover:bg-slate-100"
                                aria-label="Lukk"
                            >
                                <X size={18} />
                            </button>
                        </div>
                        <CreateTickets
                            onSuccess={() => {
                                setShowForm(false);
                                loadTickets();
                            }}
                        />
                    </div>
                </div>
            )}

            <div className="rounded-md border bg-white">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="hidden lg:table-cell">Ticketnr.</TableHead>
                            <TableHead>Emne</TableHead>
                            <TableHead>Bedriftsnavn</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="hidden lg:table-cell">Sist oppdatert</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredTickets.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="py-6 text-center text-slate-500">
                                    Ingen tickets med status {statusLabels[selectedStatus]}.
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredTickets.map((ticket) => (
                                <TableRow
                                    key={ticket.id}
                                    onClick={() => navigate(`/tickets/${ticket.id}`)}
                                    className="cursor-pointer"
                                >
                                    <TableCell className="hidden font-medium lg:table-cell">{ticket.ticketNo}</TableCell>
                                    <TableCell>{ticket.subject}</TableCell>
                                    <TableCell>{ticket.companyName}</TableCell>
                                    <TableCell>{statusLabels[ticket.status]}</TableCell>
                                    <TableCell className="hidden lg:table-cell">
                                        {new Date(ticket.updatedLast).toLocaleString("no-NO")}
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}

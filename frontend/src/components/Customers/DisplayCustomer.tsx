import { useCallback, useEffect, useState } from "react";
import { X } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { CreateContact } from "@/components/Contacts/CreateContact";
import { Contact } from "@/types/Contacts";

type TicketStatus = "OPEN" | "WAITING" | "IN_PROGRESS" | "CLOSED";

const statusLabels: Record<TicketStatus, string> = {
    OPEN: "Åpen",
    WAITING: "Venter",
    IN_PROGRESS: "Pågår",
    CLOSED: "Lukket",
};

type Customer = {
    id: number;
    orgNumber: string;
    firstName: string;
    lastName: string;
    customerNo: number;
    companyName: string;
    email: string;
    phone: string;
};

type Ticket = {
    id: number;
    ticketNo: number;
    subject: string;
    contactName: string;
    description: string;
    createdAt: string;
    updatedLast: string;
    status: TicketStatus;
};

export default function DisplayCustomer() {
    const [customer, setCustomer] = useState<Customer | null>(null);
    const [tickets, setTickets] = useState<Ticket[]>([]);
    const [contacts, setContacts] = useState<Contact[]>([]);
    const [showContactForm, setShowContactForm] = useState(false);
    const { id } = useParams();
    const navigate = useNavigate();

    const fetchData = useCallback(async () => {
        if (!id) return;
        try {
            const [customerResponse, ticketResponse, contactResponse] = await Promise.all([
                fetch(`http://localhost:8080/api/v1/customers/${id}`),
                fetch(`http://localhost:8080/api/v1/tickets/customers/${id}`),
                fetch(`http://localhost:8080/api/v1/contacts/customers/${id}`),
            ]);

            if (!customerResponse.ok || !ticketResponse.ok || !contactResponse.ok) {
                throw new Error("Could not fetch from database");
            }

            setCustomer(await customerResponse.json());
            setTickets(await ticketResponse.json());
            setContacts(await contactResponse.json());
        } catch (error) {
            console.error(error);
        }
    }, [id]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    if (!customer) {
        return <div className="text-sm text-slate-600">Laster...</div>;
    }

    return (
        <div className="space-y-4">
            <header>
                <h1 className="text-xl font-semibold">Kundeoversikt</h1>
            </header>

            <div className="rounded-md border bg-white">
                <div className="border-b px-4 py-3">
                    <h2 className="text-base font-semibold">{customer.companyName}</h2>
                    <p className="text-sm text-slate-600">Kundenr. {customer.customerNo}</p>
                </div>

                <div className="grid grid-cols-1 gap-4 p-4 md:grid-cols-2">
                    <section className="rounded-md border">
                        <h3 className="border-b px-3 py-2 text-sm font-medium">Kundeinformasjon</h3>
                        <dl className="grid grid-cols-[max-content_1fr] gap-x-4 gap-y-1 px-3 py-3 text-sm">
                            <dt className="text-slate-600">Org.nummer</dt>
                            <dd>{customer.orgNumber}</dd>
                            <dt className="text-slate-600">Hovedkontakt</dt>
                            <dd>{customer.firstName} {customer.lastName}</dd>
                            <dt className="text-slate-600">Telefon</dt>
                            <dd>{customer.phone}</dd>
                            <dt className="text-slate-600">E-post</dt>
                            <dd>{customer.email}</dd>
                        </dl>
                    </section>

                    <section className="rounded-md border">
                        <h3 className="border-b px-3 py-2 text-sm font-medium">Produkter</h3>
                        <p className="px-3 py-3 text-sm text-slate-500">Ingen produkter registrert.</p>
                    </section>
                </div>

                <div className="px-4 pb-4">
                    <section className="rounded-md border">
                        <div className="flex items-center justify-between border-b px-3 py-2">
                            <h3 className="text-sm font-medium">Kontakter</h3>
                            <Button size="sm" variant="outline" onClick={() => setShowContactForm(true)}>
                                Legg til kontakt
                            </Button>
                        </div>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Nr.</TableHead>
                                    <TableHead>Navn</TableHead>
                                    <TableHead>Rolle</TableHead>
                                    <TableHead className="hidden md:table-cell">E-post</TableHead>
                                    <TableHead className="hidden md:table-cell">Telefon</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {contacts.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={5} className="py-4 text-center text-slate-500">
                                            Ingen kontakter registrert.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    contacts.map((contact) => (
                                        <TableRow
                                            key={contact.id}
                                            onClick={() => navigate(`/contacts/${contact.id}`)}
                                            className="cursor-pointer"
                                        >
                                            <TableCell className="font-medium">{contact.contactNo}</TableCell>
                                            <TableCell>{contact.firstName} {contact.lastName}</TableCell>
                                            <TableCell>{contact.role ?? "—"}</TableCell>
                                            <TableCell className="hidden md:table-cell">{contact.email}</TableCell>
                                            <TableCell className="hidden md:table-cell">{contact.phone}</TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </section>
                </div>

                <div className="px-4 pb-4">
                    <section className="rounded-md border">
                        <h3 className="border-b px-3 py-2 text-sm font-medium">Tickets</h3>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Nr.</TableHead>
                                    <TableHead>Emne</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="hidden md:table-cell">Sist oppdatert</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {tickets.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={4} className="py-4 text-center text-slate-500">
                                            Ingen tickets registrert.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    tickets.map((ticket) => (
                                        <TableRow
                                            key={ticket.id}
                                            onClick={() => navigate(`/tickets/${ticket.id}`)}
                                            className="cursor-pointer"
                                        >
                                            <TableCell className="font-medium">{ticket.ticketNo}</TableCell>
                                            <TableCell>{ticket.subject}</TableCell>
                                            <TableCell>{statusLabels[ticket.status]}</TableCell>
                                            <TableCell className="hidden md:table-cell">
                                                {new Date(ticket.updatedLast).toLocaleString("no-NO", {
                                                    day: "2-digit",
                                                    month: "2-digit",
                                                    year: "numeric",
                                                    hour: "2-digit",
                                                    minute: "2-digit",
                                                })}
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </section>
                </div>
            </div>

            {showContactForm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
                    <div className="w-full max-w-xl rounded-md border bg-white">
                        <div className="flex items-center justify-between border-b px-4 py-3">
                            <h2 className="text-base font-semibold">Ny kontakt</h2>
                            <button
                                type="button"
                                onClick={() => setShowContactForm(false)}
                                className="rounded-md p-1.5 hover:bg-slate-100"
                                aria-label="Lukk"
                            >
                                <X size={18} />
                            </button>
                        </div>
                        <CreateContact
                            initialCustomer={{ id: customer.id, companyName: customer.companyName }}
                            onSuccess={() => {
                                setShowContactForm(false);
                                fetchData();
                            }}
                        />
                    </div>
                </div>
            )}
        </div>
    );
}

import { useCallback, useEffect, useState } from "react";
import { X } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { CreateContact } from "@/components/Contacts/CreateContact";
import { AssignProduct } from "@/components/Products/AssignProduct";
import { CreateActivity } from "@/components/Activities/CreateActivity";
import AiSummary from "@/components/Customers/AiSummary";
import { Contact } from "@/types/Contacts";
import { CustomerProduct } from "@/types/Products";
import {
    Activity,
    activityStatusLabels,
    activityTypeColor,
    activityTypeLabels,
} from "@/types/Activities";

const formatPrice = (value: number) =>
    new Intl.NumberFormat("no-NO", { style: "currency", currency: "NOK" }).format(value);

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
    const [products, setProducts] = useState<CustomerProduct[]>([]);
    const [activities, setActivities] = useState<Activity[]>([]);
    const [showContactForm, setShowContactForm] = useState(false);
    const [showProductForm, setShowProductForm] = useState(false);
    const [showActivityForm, setShowActivityForm] = useState(false);
    const { id } = useParams();
    const navigate = useNavigate();

    const fetchData = useCallback(async () => {
        if (!id) return;
        try {
            const [customerResponse, ticketResponse, contactResponse, productResponse, activityResponse] =
                await Promise.all([
                    fetch(`http://localhost:8080/api/v1/customers/${id}`),
                    fetch(`http://localhost:8080/api/v1/tickets/customers/${id}`),
                    fetch(`http://localhost:8080/api/v1/contacts/customers/${id}`),
                    fetch(`http://localhost:8080/api/v1/customers/${id}/products`),
                    fetch(`http://localhost:8080/api/v1/activities/customers/${id}`),
                ]);

            if (
                !customerResponse.ok ||
                !ticketResponse.ok ||
                !contactResponse.ok ||
                !productResponse.ok ||
                !activityResponse.ok
            ) {
                throw new Error("Could not fetch from database");
            }

            setCustomer(await customerResponse.json());
            setTickets(await ticketResponse.json());
            setContacts(await contactResponse.json());
            setProducts(await productResponse.json());
            setActivities(await activityResponse.json());
        } catch (error) {
            console.error(error);
        }
    }, [id]);

    async function removeProduct(linkId: number) {
        try {
            const res = await fetch(
                `http://localhost:8080/api/v1/customers/${id}/products/${linkId}`,
                { method: "DELETE" }
            );
            if (!res.ok) throw new Error("Failed to remove product");
            fetchData();
        } catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    if (!customer) {
        return <div className="text-sm text-muted-foreground">Laster...</div>;
    }

    return (
        <div className="space-y-4">
            <header>
                <h1 className="text-xl font-semibold">Kundeoversikt</h1>
            </header>

            <div className="rounded-md border bg-card">
                <div className="border-b px-4 py-3">
                    <h2 className="text-base font-semibold">{customer.companyName}</h2>
                    <p className="text-sm text-muted-foreground">Kundenr. {customer.customerNo}</p>
                </div>

                <div className="px-4 pt-4">
                    <AiSummary customerId={customer.id} />
                </div>

                <div className="grid grid-cols-1 gap-4 p-4 md:grid-cols-2">
                    <section className="rounded-md border">
                        <h3 className="border-b px-3 py-2 text-sm font-medium">Kundeinformasjon</h3>
                        <dl className="grid grid-cols-[max-content_1fr] gap-x-4 gap-y-1 px-3 py-3 text-sm">
                            <dt className="text-muted-foreground">Org.nummer</dt>
                            <dd>{customer.orgNumber}</dd>
                            <dt className="text-muted-foreground">Hovedkontakt</dt>
                            <dd>{customer.firstName} {customer.lastName}</dd>
                            <dt className="text-muted-foreground">Telefon</dt>
                            <dd>{customer.phone}</dd>
                            <dt className="text-muted-foreground">E-post</dt>
                            <dd>{customer.email}</dd>
                        </dl>
                    </section>

                    <section className="rounded-md border">
                        <div className="flex items-center justify-between border-b px-3 py-2">
                            <h3 className="text-sm font-medium">Produkter</h3>
                            <Button size="sm" variant="outline" onClick={() => setShowProductForm(true)}>
                                Legg til produkt
                            </Button>
                        </div>
                        {products.length === 0 ? (
                            <p className="px-3 py-3 text-sm text-muted-foreground">Ingen produkter registrert.</p>
                        ) : (
                            <ul className="divide-y">
                                {products.map((link) => (
                                    <li
                                        key={link.id}
                                        className="flex items-center justify-between gap-3 px-3 py-2 text-sm"
                                    >
                                        <div className="min-w-0">
                                            <p className="font-medium">{link.product.name}</p>
                                            <p className="text-xs text-muted-foreground">
                                                Lagt til {new Date(link.addedAt).toLocaleDateString("no-NO")}
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <span className="whitespace-nowrap text-foreground">
                                                {formatPrice(link.product.price)}
                                            </span>
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={() => removeProduct(link.id)}
                                            >
                                                Fjern
                                            </Button>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        )}
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
                                        <TableCell colSpan={5} className="py-4 text-center text-muted-foreground">
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
                        <div className="flex items-center justify-between border-b px-3 py-2">
                            <h3 className="text-sm font-medium">Avtaler</h3>
                            <Button size="sm" variant="outline" onClick={() => setShowActivityForm(true)}>
                                Ny avtale
                            </Button>
                        </div>
                        {activities.length === 0 ? (
                            <p className="px-3 py-3 text-sm text-muted-foreground">Ingen avtaler registrert.</p>
                        ) : (
                            <ul className="divide-y">
                                {activities.map((a) => (
                                    <li
                                        key={a.id}
                                        className="flex flex-col gap-1 px-3 py-2 text-sm sm:flex-row sm:items-center sm:gap-4"
                                    >
                                        <span className="w-40 shrink-0 text-muted-foreground">
                                            {new Date(a.scheduledAt).toLocaleString("no-NO", {
                                                day: "2-digit",
                                                month: "short",
                                                year: "numeric",
                                                hour: "2-digit",
                                                minute: "2-digit",
                                            })}
                                        </span>
                                        <span
                                            className={`inline-block w-fit rounded px-1.5 py-0.5 text-xs ${activityTypeColor[a.type]}`}
                                        >
                                            {activityTypeLabels[a.type]}
                                        </span>
                                        <span
                                            className={`min-w-0 flex-1 font-medium ${a.status !== "PLANNED" ? "text-muted-foreground line-through" : ""}`}
                                        >
                                            {a.title}
                                        </span>
                                        <span className="text-xs text-muted-foreground">
                                            {activityStatusLabels[a.status]}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        )}
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
                                        <TableCell colSpan={4} className="py-4 text-center text-muted-foreground">
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
                    <div className="w-full max-w-xl rounded-md border bg-card">
                        <div className="flex items-center justify-between border-b px-4 py-3">
                            <h2 className="text-base font-semibold">Ny kontakt</h2>
                            <button
                                type="button"
                                onClick={() => setShowContactForm(false)}
                                className="rounded-md p-1.5 hover:bg-accent"
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

            {showProductForm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
                    <div className="w-full max-w-xl rounded-md border bg-card">
                        <div className="flex items-center justify-between border-b px-4 py-3">
                            <h2 className="text-base font-semibold">Legg til produkt</h2>
                            <button
                                type="button"
                                onClick={() => setShowProductForm(false)}
                                className="rounded-md p-1.5 hover:bg-accent"
                                aria-label="Lukk"
                            >
                                <X size={18} />
                            </button>
                        </div>
                        <AssignProduct
                            customerId={customer.id}
                            excludeProductIds={products.map((link) => link.product.id)}
                            onSuccess={() => {
                                setShowProductForm(false);
                                fetchData();
                            }}
                        />
                    </div>
                </div>
            )}

            {showActivityForm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
                    <div className="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-md border bg-card">
                        <div className="flex items-center justify-between border-b px-4 py-3">
                            <h2 className="text-base font-semibold">Ny avtale</h2>
                            <button
                                type="button"
                                onClick={() => setShowActivityForm(false)}
                                className="rounded-md p-1.5 hover:bg-accent"
                                aria-label="Lukk"
                            >
                                <X size={18} />
                            </button>
                        </div>
                        <CreateActivity
                            initialCustomer={{ id: customer.id, companyName: customer.companyName }}
                            onSuccess={() => {
                                setShowActivityForm(false);
                                fetchData();
                            }}
                        />
                    </div>
                </div>
            )}
        </div>
    );
}

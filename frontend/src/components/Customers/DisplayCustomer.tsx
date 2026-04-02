
import {useEffect, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";

const statusLabels =
    {
        OPEN: "Åpen",
        WAITING: "Venter",
        IN_PROGRESS: "Pågår",
        CLOSED: "Lukket",
    }

type ticketStatus = "OPEN" | "WAITING" | "IN_PROGRESS" | "CLOSED";

type Customer = {
    id: number;
    orgNumber: string;
    firstName: string;
    lastName: string;
    customerNo: number;
    companyName: string;
    email: string;
    phone: string;
}

type Tickets = {
    id: number;
    ticketNo: number;
    subject: string;
    contactName: string;
    description: string;
    createdAt: string;
    updatedLast: string;
    status: ticketStatus;
}


export default function DisplayCustomer() {

    const [customer, setCustomer] = useState<Customer | null>(null);
    const [tickets, setTickets] = useState<Tickets[]>([]);
    const { id } = useParams();

    const navigate = useNavigate();

    useEffect(() => {
        async function fetchData() {
            try {
                const customerResponse = await fetch(`http://localhost:8080/api/v1/customers/${id}`);
                const ticketResponse = await fetch(`http://localhost:8080/api/v1/tickets/customers/${id}`);

                if (!customerResponse.ok || !ticketResponse.ok) {
                    throw new Error("could not fetch from database")
                }

                const customerData = await customerResponse.json();
                const ticketData = await ticketResponse.json();



                setCustomer(customerData);
                setTickets(ticketData);

            } catch (error) {
                console.log(error)
            }

        } if (id) {
            fetchData();
        }
    }, [id]);

    if (!customer) {
        return <div>Laster...</div>;
    }

    return (
        <div>
            <h1 className="justify-start items-start text-2xl font-medium">Kundeoversikt:</h1>
            <div className="flex flex-col">
                    <div className="rounded-4xl mt-6 max-w-5xl w-full flex flex-col border h-fit shadow-md bg-white border-gray-200">
                        <div className="flex flex-col border-b p-6">
                            <div className="flex justify-between w-full items-start">
                                <h1 className="text-xl">{customer.companyName}</h1>

                                {/* Kan legge til kundestatus slik at man kan se om kunden er aktiv oppe i høyre hjørne */}
                                <h1 className="text-xl rounded-4xl px-4 py-2"></h1>
                            </div>
                            <div className="flex gap-2">
                                <h1 className="text-xl">Kundenummer:</h1>
                                <h1 className="text-xl">{customer.customerNo}</h1>
                            </div>
                        </div>
                        {/* Boksen for beskrivelse */}
                        <div className="grid grid-cols-1 mt-10 md:mt-1 p-4 gap-4 lg:grid-cols-2">
                            {/* Boken for Kontaktinfo */}
                            <div className="border rounded-4xl h-[30vh] md:h-[20vh] shadow-md border-gray-200 place-items-start text-xl justify-center">
                                <div className="border-b w-full place-items-start text-xl justify-center p-4">
                                    <h1 className="text-xl px-4">Kundeinformasjon</h1>
                                </div>
                                <div className="mt-6 px-8 text-lg">
                                    <div className="flex flex-col md:flex-row md:gap-2 mt-2">
                                        <h1>Org. nummer:</h1>
                                        <p>{customer.orgNumber}</p>
                                    </div>
                                    <div className="flex flex-col mt-2 md:flex-row md:gap-2">
                                        <h1>Hovedkontakt:</h1>
                                        <div className="flex gap-1">
                                            <p className="">{customer.firstName}</p>
                                            <p className="">{customer.lastName}</p>
                                        </div>
                                    </div>

                                    <div className="flex flex-col md:flex-row md:gap-2 mt-2">
                                        <h1>Telefon:</h1>
                                        <p>{customer.phone}</p>
                                    </div>
                                    <div className="flex flex-col md:flex-row md:gap-2 mt-2">
                                        <h1>E-post:</h1>
                                        <p>{customer.email}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="border rounded-4xl h-[20vh] shadow-md border-gray-200 text-xl">
                                <div className="border-b w-full place-items-start text-2xl justify-items-start p-4">
                                    <h1 className=" px-4 text-xl">Produkter</h1>
                                </div>
                                <div className="mt-6 px-8 place-items-start text-left text-lg justify-items-start">
                                    <p></p>
                                </div>
                            </div>
                        </div>
                        <div className="p-4">

                            <div className="border rounded-4xl shadow-md border-gray-200 text-xl">
                                <div className="p-4 border-b">
                                    <h1 className="px-4">Tickets:</h1>
                                </div>
                                <div className="px-6 py-4">
                                    <Table className="">
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead className="text-lg ">Nr.</TableHead>
                                                <TableHead className="text-lg md:text-xl">Emne</TableHead>
                                                <TableHead className="text-lg md:text-xl">Status</TableHead>
                                                <TableHead className="text-lg hidden md:flex">Sist oppdatert</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody className="text-lg">
                                            {tickets.length < 1 ? (
                                                <TableRow>
                                                    <TableCell colSpan={4} className="p-4 text-center">
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
                                                        <TableCell className="gap-1 hidden md:flex">
                                                            <p>
                                                                {new Date(ticket.updatedLast).toLocaleString("no-NO", {
                                                                    day: "2-digit",
                                                                    month: "2-digit",
                                                                    year: "numeric",
                                                                })}
                                                            </p>
                                                            <p>
                                                                {new Date(ticket.updatedLast).toLocaleString("no-NO", {
                                                                    minute: "numeric",
                                                                    hour: "2-digit",
                                                                })}
                                                            </p>
                                                        </TableCell>
                                                    </TableRow>
                                                ))
                                            )}
                                        </TableBody>
                                    </Table>
                                </div>
                            </div>
                        </div>
                    </div>

            </div>
        </div>
    );
}
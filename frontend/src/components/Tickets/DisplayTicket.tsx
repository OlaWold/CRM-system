import {useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import {Button} from "@/components/ui/button";
import TicketNotes from "@/components/Tickets/AddNotes";

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

const statusClasses: Record<TicketStatus, string> = {
    OPEN: "bg-green-100 text-green-700",
    IN_PROGRESS: "bg-yellow-100 text-yellow-700",
    WAITING: "bg-orange-100 text-orange-700",
    CLOSED: "bg-gray-200 text-gray-700",
};

const statusTextClasses: Record<TicketStatus, string> = {
    OPEN: "text-green-700",
    IN_PROGRESS: "text-yellow-700",
    WAITING: "text-orange-700",
    CLOSED: "text-gray-700",
};

export default function DisplayTickets() {

    const { id } = useParams();
    const [ticket, setTicket] = useState<Ticket | null>(null)

    // Fetcher dataen fra databasen slik at den blir vist i bildet når mnan går inn på tickets.

    useEffect(() => {
        const loadTicket= async () => {
            try {
                const response = await fetch(`http://localhost:8080/api/v1/tickets/${id}`);
                console.log(response);
                if (!response.ok)
                    throw new Error("Failed to fetch ticket");

                const data = await response.json();
                setTicket(data);
                console.log(data);

            } catch (error) {
                console.log(error);
            }
        };
        if (id) {
            loadTicket();
        }
    }, [id]);

    // Gjør at vi kan endre status inne på ticketen ved hjelp av knappene i UI.

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

            const updatedTicket = await response.json();
            setTicket(updatedTicket);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div>
            <h1 className="justify-start items-start text-2xl font-medium">Ticketoversikt:</h1>
            <div className="flex flex-col">
                {!ticket ? (
                    <p></p> // Ønsker ikke å gi beskjed til brukeren dersom det laster. Da dette ga dårlig opplevelse av systemet.
                ) : (
                    <div className="rounded-4xl mt-8 max-w-5xl w-full flex flex-col border h-fit shadow-md bg-white border-gray-200">
                        <div className="flex flex-col border-b p-6">
                            <div className="flex justify-between w-full items-start">
                                <h1 className="text-xl">Ticket #{ticket.ticketNo}</h1>

                                {/* Bruker statusClasses slik at vi kan gi farge og norsk label som er dynamisk etter hvilken statusen. */}
                                <h1 className={`text-xl rounded-4xl px-4 py-2 ${statusClasses[ticket.status]}`}>{statusLabels[ticket.status]}</h1>
                            </div>
                            <div>
                                <h1 className="text-2xl">{ticket.subject}</h1>
                                <h1 className="text-xl text-gray-600 mt-2">{ticket.companyName}</h1>
                            </div>
                        </div>
                        {/* Boksen for beskrivelse */}
                        <div className="grid grid-cols-1 mt-10 md:mt-1 p-4 gap-4 mb-10 lg:grid-cols-2">
                            <div className="border rounded-4xl h-[20vh] shadow-md border-gray-200 text-xl">
                                <div className="border-b w-full place-items-start text-2xl justify-items-start p-4">
                                    <h1 className=" px-4 text-xl">Beskrivelse</h1>
                                </div>
                                <div className="mt-6 px-8 place-items-start text-left text-lg justify-items-start">
                                    <p>{ticket.description}</p>
                                </div>
                            </div>

                            {/* Boken for Kontaktinfo */}
                            <div className="border rounded-4xl h-[20vh] shadow-md border-gray-200 place-items-start text-xl justify-center">
                                <div className="border-b w-full place-items-start text-xl justify-center p-4">
                                    <h1 className="text-xl px-4">Kontaktinfo</h1>
                                </div>
                                <div className="mt-6 px-8 text-lg">
                                    <div className="flex flex-col md:flex-row md:gap-6">
                                        <h1>Firmanavn:</h1>
                                        <p>{ticket.companyName}</p>
                                    </div>
                                    <div className="flex flex-col md:flex-row md:gap-6 mt-2">
                                        <h1 className="">Navn:</h1>
                                        <p>{ticket.contactName}</p>
                                    </div>
                                    <div className="flex flex-col md:flex-row md:gap-6 mt-2">
                                        <h1>Telefon:</h1>
                                        <p> {ticket.phone}</p>
                                    </div>
                                    <div className="flex flex-col md:flex-row md:gap-6 mt-2">
                                        <h1>E-post:</h1>
                                        <p>{ticket.email}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Boksene for opprettet og status */}
                            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                <div className="rounded-4xl border shadow-md border-gray-200 p-6 place-items-start text-lg place-content-center">
                                        <h1 className="text-xl">Opprettet:</h1>
                                        <p className="mt-2">{new Date(ticket.created).toLocaleString("no-NO", {
                                            day: "numeric",
                                            month: "long",
                                            year: "numeric",
                                            })
                                        }</p>
                                    <p className="mt-2">Kl. {new Date(ticket.created).toLocaleString("no-NO", {
                                        hour: "2-digit",
                                        minute: "2-digit",
                                    })
                                    }</p>
                                </div>
                                <div className="rounded-4xl border shadow-md border-gray-200 p-6 place-items-start text-xl ">
                                    <h1 className="text-xl">Status:</h1>
                                    <p className={`mt-2 ${statusTextClasses[ticket.status]}`}>{statusLabels[ticket.status]}</p>
                                </div>

                            </div>

                            {/* Boksen for å endre status */}
                            <div className="rounded-4xl border shadow-md border-gray-200 p-6 text-xl">
                                <h1>Endre status:</h1>
                                <div className="grid grid-cols-2 md:flex gap-3 place-content-center md:justify-start mt-4">
                                    <Button onClick={() => updateTicketStatus("OPEN")}>Åpen</Button>
                                    <Button onClick={() => updateTicketStatus("WAITING") }>Venter</Button>
                                    <Button onClick={() => updateTicketStatus("IN_PROGRESS")}>Pågår</Button>
                                    <Button onClick={() => updateTicketStatus("CLOSED")}>Lukket</Button>
                                </div>
                            </div>
                            </div>

                        </div>
                )}
                {/* Vise notater og legg til knappen for å lagre */}
                    <div className="bg-white p-4 max-w-5xl w-full shadow-md rounded-4xl border-gray-200 mt-6">
                            <TicketNotes/>

                    </div>

            </div>
        </div>
    );
}
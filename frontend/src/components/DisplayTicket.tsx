import {useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import {Button} from "@/components/ui/button";

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

    const { ticketNo } = useParams();
    const [ticket, setTicket] = useState<Ticket | null>(null)
    const [ticketStatus, setTicketStatus] = useState<TicketStatus | null>(null)

    useEffect(() => {
        const loadTicket= async () => {
            try {
                const response = await fetch(`http://localhost:8080/api/v1/tickets/${ticketNo}`);
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
        if (ticketNo) {
            loadTicket();
        }
    }, [ticketNo]);

    const updateTicketStatus = async (status: TicketStatus) => {
        try {
            const response = await fetch(`http://localhost:8080/api/v1/tickets/${ticketNo}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status }),
            });

            if (!response.ok) {
                throw new Error("Failed to update ticket");
            }

            const updatedTicket = await response.json();
            setTicketStatus(updatedTicket.status);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <>
            {!ticket ? (
                <p></p>
            ) : (
                <div className="rounded-xl mt-20 flex flex-col border h-fit shadow-md border-gray-200">
                    <div className="flex flex-col border-b p-6">
                        <div className="flex justify-between w-full items-start">
                            <h1 className="text-2xl">Ticket #{ticket.ticketNo}</h1>
                            <h1 className={`text-xl rounded-4xl px-4 py-2 ${statusClasses[ticket.status]}`}>{statusLabels[ticket.status]}</h1>
                        </div>
                        <div>
                            <h1 className="text-6xl">{ticket.subject}</h1>
                            <h1 className="text-2xl text-gray-600 mt-4">{ticket.companyName}</h1>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 mt-10 p-6 gap-6 mb-10 lg:grid-cols-2">

                        <div className="border rounded-4xl h-[20vh] shadow-md border-gray-200 text-2xl">
                            <div className="border-b w-full place-items-start text-2xl justify-items-start p-4">
                                <h1 className=" px-4 text-3xl">Beskrivelse</h1>
                            </div>
                            <div className="mt-6 px-8 place-items-start text-left justify-items-start">
                                <p>{ticket.description}</p>
                            </div>

                        </div>

                        <div className="border rounded-4xl h-[20vh] shadow-md border-gray-200 place-items-start text-2xl justify-center">
                            <div className="border-b w-full place-items-start text-2xl justify-center p-4">
                                <h1 className="text-3xl px-4">Kontaktinfo</h1>
                            </div>
                            <div className="mt-6 px-8 text-2xl">
                                <div className="flex gap-6">
                                    <h1>Firmanavn:</h1>
                                    <p>{ticket.companyName}</p>
                                </div>
                                <div className="flex gap-6 mt-4">
                                    <h1 className="">Navn:</h1>
                                    <p>{ticket.contactName}</p>
                                </div>
                                <div className="flex gap-6 mt-4">
                                    <h1>Telefon:</h1>
                                    <p> {ticket.phone}</p>
                                </div>
                                <div className="flex gap-6 mt-4 text-nowrap">
                                    <h1>E-post:</h1>
                                    <p>{ticket.email}</p>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-6">
                            <div className="rounded-4xl border shadow-md border-gray-200 p-6 place-items-start text-2xl place-content-center">
                                    <h1 className="text-2xl">Opprettet</h1>
                                    <h1 className="mt-2">{new Date(ticket.created).toLocaleString("no-NO")}</h1>
                            </div>
                            <div className="rounded-4xl border shadow-md border-gray-200 p-6 place-items-start text-2xl ">
                                <h1 className="text-2xl">Status</h1>
                                <h1 className={`mt-2 ${statusTextClasses[ticket.status]}`}>{statusLabels[ticket.status]}</h1>
                            </div>

                        </div>
                        <div className="rounded-4xl border shadow-md border-gray-200 p-6 place-items-start text-2xl">
                            <h1>Endre status:</h1>
                            <div className="flex gap-3 mt-4">
                                <Button onClick={() => updateTicketStatus("OPEN")}>Åpen</Button>
                                <Button onClick={() => updateTicketStatus("WAITING") }>Venter</Button>
                                <Button onClick={() => updateTicketStatus("IN_PROGRESS")}>Pågår</Button>
                                <Button onClick={() => updateTicketStatus("CLOSED")}>Lukket</Button>
                            </div>
                        </div>
                        </div>
                    </div>
            )}
        </>
    );
}
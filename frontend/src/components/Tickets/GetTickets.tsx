import {useEffect, useState} from "react";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import {Button} from "@/components/ui/button";
import {useNavigate} from "react-router-dom";
import {CreateTickets} from "@/components/Tickets/CreateTicket";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";


type Ticket = {
    id: number,
    ticketNo: number,
    subject: string,
    companyName: string,
    status: string,
    updatedLast: Date,
}

type TicketStatus = "OPEN" | "IN_PROGRESS" | "WAITING" | "CLOSED";

export function GetTickets() {

    const [showForm, setShowForm] = useState(false);

        const [tickets, setTickets] = useState<Ticket[]>([]);
        const [selectedStatus, setSelectedStatus] = useState("OPEN");

        const navigate = useNavigate();

        const filteredTickets = tickets.filter((ticket) => ticket.status === selectedStatus);

        const statusLabels: Record<TicketStatus, string> = {
            OPEN: "Åpen",
            WAITING: "Venter",
            IN_PROGRESS: "Pågår",
            CLOSED: "Lukket",
        };


        useEffect(() => {
            async function loadTickets() {
                const response = await fetch("http://localhost:8080/api/v1/tickets", {
                    method: 'GET',
                    headers: {"Content-Type": "application/json"}
                });

                if(!response.ok) {
                    throw Error("Failed to fetch tickets.");
                }

                const data= await response.json();
                setTickets(data);
                console.log(data);
            }
            loadTickets();
        }, []);


    return (
        <>
            <div className="mt- bg-white rounded-2xl p-6 text-lg">
                <div className="flex gap-4 mb-4">
                    <Button className="cursor-pointer" type="button" onClick={() => setShowForm(true)}>Opprett Ticket</Button>

                    {showForm && (
                        <div className="fixed flex inset-0 z-50 justify-center items-center bg-black/50">
                            <div className="bg-white p-6 w-full max-w-xl rounded-4xl">
                                <div>
                                    <div className="flex justify-between">
                                        <h1 className="font-semibold ml-4">Ny Ticket:</h1>
                                        <button onClick={() => setShowForm(false)} className="relative h-8 w-8 cursor-pointer">
                                            <span className="absolute h-0.5 w-6 -translate-x-1/2 -translate-y-1/2 rotate-45 bg-black" />
                                            <span className="absolute h-0.5 w-6 -translate-x-1/2 -translate-y-1/2 -rotate-45 bg-black" />
                                        </button>
                                    </div>

                                    <CreateTickets />

                                </div>
                            </div>
                        </div>
                    )}
                        <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                            <SelectTrigger className="w-fit bg-black text-white max-w-48 cursor-pointer">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent >
                                <SelectGroup >
                                    <SelectItem value="OPEN">Åpen</SelectItem>
                                    <SelectItem value="WAITING">Venter</SelectItem>
                                    <SelectItem value="IN_PROGRESS">Pågår</SelectItem>
                                    <SelectItem value="CLOSED">Lukket</SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                </div>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="text-lg hidden lg:block md:place-content-center">Ticketnr.</TableHead>
                            <TableHead className="text-lg md:text-xl">Emne</TableHead>
                            <TableHead className="text-lg md:text-xl">Bedriftsnavn</TableHead>
                            <TableHead className="text-lg md:text-xl">Status</TableHead>
                            <TableHead className="text-lg hidden lg:block md:place-content-center">Sist oppdatert</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody className="text-lg">
                        {filteredTickets.map((ticket) => (
                        <TableRow key={ticket.id}
                                  onClick={() => navigate(`/tickets/${ticket.id}`)}
                                  className="cursor-pointer"
                        >
                            <TableCell className="font-medium hidden lg:block text-lg md:text-xl">{ticket.ticketNo}</TableCell>
                            <TableCell className="text-lg md:text-xl">{ticket.subject}</TableCell>
                            <TableCell className="text-lg md:text-xl">{ticket.companyName}</TableCell>
                            <TableCell className="text-lg md:text-xl">{statusLabels[ticket.status]}</TableCell>
                            <TableCell className="text-lg md:text-xl hidden lg:block lg:place-content-center">{new Date(ticket.updatedLast).toLocaleString("no-NO")}</TableCell>
                        </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </>
    )
}

import {useEffect, useState} from "react";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import {Button} from "@/components/ui/button";
import {useNavigate} from "react-router-dom";

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
            <div className="mt-20 text-lg">
                <Button
                    className="mb-8"
                    onChange={(e) => setSelectedStatus(e.target.value)}>
                <select className="">

                        <option value="OPEN">Åpne</option>
                        <option value="IN_PROGRESS">Pågår</option>
                        <option value="WAITING">Venter</option>
                        <option value="CLOSED">Lukket</option>


                </select>
                </Button>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="text-lg">Ticketnr.</TableHead>
                            <TableHead className="text-lg">Emne</TableHead>
                            <TableHead className="text-lg">Bedriftsnavn</TableHead>
                            <TableHead className="text-lg">Status</TableHead>
                            <TableHead className="text-lg">Sist oppdatert</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredTickets.map((ticket) => (
                        <TableRow key={ticket.id}
                                  onClick={() => navigate(`/tickets/${ticket.ticketNo}`)}
                                  className="cursor-pointer"
                        >
                            <TableCell className="font-medium">{ticket.ticketNo}</TableCell>
                            <TableCell>{ticket.subject}</TableCell>
                            <TableCell>{ticket.companyName}</TableCell>
                            <TableCell>{statusLabels[ticket.status]}</TableCell>
                            <TableCell>{new Date(ticket.updatedLast).toLocaleString("no-NO")}</TableCell>
                        </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </>
    )
}

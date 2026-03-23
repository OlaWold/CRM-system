import {useEffect, useState} from "react";
import {Button} from "@/components/ui/button";
import {useNavigate} from "react-router-dom";

export default function CountTickets() {

    //bruker useState<number> fordi databasen kun sender en count av antall med en gitt status.
    const [allOpenTickets, setAllOpenTickets] = useState<number | null> (null);
    const [statusOpen, setStatusOpen] = useState<number | null> (null);
    const [statusWaiting, setStatusWaiting] = useState<number | null> (null);
    const [statusInProgress, setStatusInProgress] = useState<number | null> (null);

    const navigate = useNavigate();

    useEffect(() => {
        async function LoadCount() {
            try {

                // Alle fetchene fra databasen for de ulike dataene som ønskes skal vises.
                const allOpenResponse = await fetch("http://localhost:8080/api/v1/tickets/count/not-closed")
                const openRespons = await fetch("http://localhost:8080/api/v1/tickets/count?status=OPEN")
                const waitingResponse = await fetch("http://localhost:8080/api/v1/tickets/count?status=WAITING")
                const inProgressRespons = await fetch("http://localhost:8080/api/v1/tickets/count?status=IN_PROGRESS")

                if (!allOpenResponse.ok || !openRespons.ok || !waitingResponse.ok || !inProgressRespons.ok) {
                    throw new Error("Could not fetch Count");
                }

                const allOpenData = await allOpenResponse.json();
                const statusOpenData = await openRespons.json();
                const waitingData = await waitingResponse.json();
                const inProgressData = await inProgressRespons.json();

                setAllOpenTickets(allOpenData);
                setStatusOpen(statusOpenData);
                setStatusWaiting(waitingData);
                setStatusInProgress(inProgressData);

            } catch (error) {
                console.error(error);
            }
        } LoadCount();
    })

    return (
        <>
        <div className="flex justify-start p-4 w-fit">
                <Button className="text-lg p-6" onClick={() => navigate("/tickets")}>Gå til Tickets</Button>
            </div>
            <div className="grid grid-cols-[200px_200px] gap-6 w-fit">
                <div className="flex flex-col border rounded-4xl h-fit w-fit px-10 py-4 shadow-md gap-4 border-gray-200 text-lg items-center justify-center">
                    <h1>Totalt antall åpne Tickets:</h1>
                    <p className="text-xl">{allOpenTickets}</p>
                </div>
                <div className="flex flex-col border rounded-4xl h-fit w-fit gap-4 px-10 py-4 shadow-md border-gray-200 text-lg items-center justify-center">
                    <h1>Tickets med status åpen:</h1>
                    <p className="text-xl">{statusOpen}</p>
                </div>
                <div className="flex flex-col border rounded-4xl h-fit w-fit gap-4 px-10 py-4 shadow-md border-gray-200 text-lg items-center justify-center">
                    <h1>Tickets med status venter:</h1>
                    <p className="text-xl">{statusWaiting}</p>
                </div>
                <div className="flex flex-col border rounded-4xl h-fit w-fit gap-4 px-10 py-4 shadow-md border-gray-200 text-lg items-center justify-center">
                    <h1>Tickets med status pågår:</h1>
                    <p className="text-xl">{statusInProgress}</p>
                </div>
                <div></div>
            </div>
        </>
    );
}
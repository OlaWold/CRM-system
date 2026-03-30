import {useState} from "react";

export default function TicketStats() {

    const [prevDays, setPrevDays] = useState(0);
    const [closedLastThirty, setClosedLastThirty] = useState(0);

    async function fetchTicketStats() {

        try {
            const prevDaysResponse = await fetch("http://localhost:8080/api/v1/tickets/previous-30-days");
            const closedLastThirty = await fetch("http://localhost:8080/api/v1/tickets/previous-30-days/closed");

            if (!prevDaysResponse.ok || !closedLastThirty.ok) {
                throw new Error("Could not find a ticket from the server");
            }

            const prevDaysData = await prevDaysResponse.json();
            const ClosedLastThirtyData = await closedLastThirty.json();
            setPrevDays(prevDaysData);
            setClosedLastThirty(ClosedLastThirtyData);
        } catch (error) {
            console.error(error);
        }
    } fetchTicketStats();

    return (
        <>
            <div className="flex gap-6">


            </div>
        </>
    )
}
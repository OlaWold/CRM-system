import {Button} from "@/components/ui/button";
import {CreateTickets} from "@/components/CreateTicket";
import {useState} from "react";
import {GetTickets} from "@/components/GetTickets";

export default function Tickets() {

    const [showForm, setShowForm] = useState(false);

    function openForm() {
        setShowForm(prev => !prev); // Gjør at man kan åpne og lukke vinduet ved å trykke på nytt.
    }
    return (
        <>
            <div className="">
                <Button type="button" onClick={openForm}>Opprett Ticket</Button>
                <CreateTickets  showForm={showForm} />
            </div>
            <div className="">
                <GetTickets />
            </div>

        </>
    )
}
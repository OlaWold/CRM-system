import {Button} from "@/components/ui/button";
import {useState} from "react";
import {Textarea} from "@/components/ui/textarea";
import {useParams} from "react-router-dom";



export default function AddTicketsNotes() {

    const [text, setText] = useState("");
    const { id } = useParams();

    // Post som sender textet i notatboksen til databasen.
    async function handleSubmit() {
        try {

            const response = await fetch(`http://localhost:8080/api/v1/tickets/${id}/notes`, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({text})
            })

            // Dersom det skjer noe feil med opplastinga til databasen så fanger vi det opp
            if (!response.ok) {
                throw new Error("Failed to add note to tickets");
            }

            setText(""); // Resetter innholdet i tekstboksen
        } catch (error) {
            console.log(error) // Lager error dersom det skulle oppstå.
        }
    }

    return (
        <>
            <div>
                <Textarea className="" onChange={(e) => setText(e.target.value)} value={text}></Textarea>
            </div>
            <div className="mt-6">
                <Button onClick={handleSubmit}>Legg til notat</Button>
            </div>
        </>
    )

}

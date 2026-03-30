import {Button} from "@/components/ui/button";
import {Textarea} from "@/components/ui/textarea";
import {useEffect, useState} from "react";
import {useParams} from "react-router-dom";

type Note = {
    id: number;
    text: string;
    createdAt: Date;
}

export default function TicketNotes() {
    const [notes, setNotes] = useState<Note[]>([]);
    const [text, setText] = useState("");
    const { id } = useParams();

    // Fetch på Notes fra databasen.
    async function displayNotes() {
        try {
            const response = await fetch(`http://localhost:8080/api/v1/tickets/${id}/notes`);
            if (!response.ok) throw new Error("failed to fetch notes");
            const data = await response.json();
            setNotes(data);
        } catch (error) {
            console.log(error);
        }
    }

    async function handleSubmit() {
        try {
            // Sender POST request med opprettet ticket.
            const response = await fetch(`http://localhost:8080/api/v1/tickets/${id}/notes`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ text }),
            });

            if (!response.ok) {
                throw new Error("failed to create note");
            }

            setText("");
            await displayNotes();
        } catch (error) {
            console.log(error);
        }
    }
    // Refresh komponenten når det blir lagt til notat slik at den vises med engang.
    useEffect(() => {
        if (id) {
            displayNotes();
        }
    }, [id]);

    return (
        <>
            <div className="max-w-5xl">
                <h1 className="text-xl p-2">Ticket notater:</h1>

                <div className="flex flex-col gap-4 p-2">
                    {notes.map((note) => (
                        <div
                            key={note.id}
                            className="flex flex-col border shadow-md shadow-gray-200 rounded-4xl py-6 px-6"
                        >
                            <div className="flex">
                                <p>{note.text}</p>
                            </div>

                            <div className="flex mt-6">
                                <p>{new Date(note.createdAt).toLocaleString("no-NO", {
                                    day: "2-digit",
                                    month: "long",
                                    year: "numeric",
                                    hour: "2-digit",
                                    minute: "2-digit"})
                                }</p>
                            </div>
                        </div>
                    ))}
                </div>
                <Textarea className="mt-4" value={text} onChange={(e) => setText(e.target.value)} />
                <Button className="mt-4" onClick={handleSubmit}>Legg til notat</Button>
            </div>

        </>
    );
}
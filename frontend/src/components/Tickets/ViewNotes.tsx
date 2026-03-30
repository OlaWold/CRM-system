import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

type Note = {
    id: number;
    text: string;
    createdAt: string;
};

export default function ViewNotes() {
    const [notes, setNotes] = useState<Note[]>([]);
    const { id } = useParams();

    useEffect(() => {
        async function displayNotes() {
            try {
                const response = await fetch(`http://localhost:8080/api/v1/tickets/${id}/notes`);

                if (!response.ok) {
                    throw new Error("Failed to fetch notes");
                }

                const data: Note[] = await response.json();
                setNotes(data);
            } catch (error) {
                console.error(error);
            }
        }

        if (id) {
            displayNotes();
        }
    }, [id]);

    return (
        <div className="max-w-5xl">
            <h1 className="text-xl p-2">Ticket notater:</h1>

            <div className="flex flex-col gap-4 p-2">
                {notes.map((note) => (
                    <div
                        key={note.id}
                        className="flex flex-col border shadow-md shadow-gray-200 rounded-4xl py-6 px-2"
                    >
                        <div className="flex">
                            <p>{note.text}</p>
                        </div>

                        <div className="flex mt-6">
                            <p>{new Date(note.createdAt).toLocaleString("no-NO")}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

type Note = {
    id: number;
    text: string;
    createdAt: string;
};

export default function TicketNotes() {
    const [notes, setNotes] = useState<Note[]>([]);
    const [text, setText] = useState("");
    const { id } = useParams();

    const displayNotes = useCallback(async () => {
        try {
            const response = await fetch(`http://localhost:8080/api/v1/tickets/${id}/notes`);
            if (!response.ok) throw new Error("Failed to fetch notes");
            const data = await response.json();
            setNotes(data);
        } catch (error) {
            console.error(error);
        }
    }, [id]);

    useEffect(() => {
        if (id) {
            displayNotes();
        }
    }, [id, displayNotes]);

    async function handleSubmit() {
        const trimmed = text.trim();
        if (!trimmed) return;

        try {
            const response = await fetch(`http://localhost:8080/api/v1/tickets/${id}/notes`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ text: trimmed }),
            });
            if (!response.ok) {
                throw new Error("Failed to create note");
            }
            setText("");
            await displayNotes();
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <div className="space-y-3 p-3 sm:p-4">
            <h2 className="text-base font-semibold">Notater</h2>

            {notes.length === 0 ? (
                <p className="text-sm text-slate-500">Ingen notater ennå.</p>
            ) : (
                <ul className="space-y-2">
                    {notes.map((note) => (
                        <li key={note.id} className="rounded-md border px-3 py-2 text-sm">
                            <p className="whitespace-pre-wrap break-words">{note.text}</p>
                            <p className="mt-2 text-xs text-slate-500">
                                {new Date(note.createdAt).toLocaleString("no-NO", {
                                    day: "2-digit",
                                    month: "long",
                                    year: "numeric",
                                    hour: "2-digit",
                                    minute: "2-digit",
                                })}
                            </p>
                        </li>
                    ))}
                </ul>
            )}

            <div className="space-y-2">
                <Textarea
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Skriv et notat..."
                />
                <Button onClick={handleSubmit} disabled={!text.trim()}>
                    Legg til notat
                </Button>
            </div>
        </div>
    );
}

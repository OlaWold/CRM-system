import {useEffect, useState} from "react";
import {useParams} from "react-router-dom";

export default function ViewNotes() {

    const [notes, setNotes] = useState([]);

    const {id} = useParams();


    useEffect(() => {
        async function displayNotes() {

            try {
                const response = await fetch(`http://localhost:8080/api/v1/tickets/${id}/notes`)

                if (!response.ok) {
                    throw new Error("failed to fetch notes");
                }

                const data = await response.json();

                setNotes(data);
                await displayNotes(); // Refresher componenten
            } catch (error) {
                console.log(error)
            }
        }

        if (!id) {
            displayNotes();
        }
    }, [id]);


    return (
        <>
            <div className="max-w-5xl">
                <h1 className="text-xl p-2">Ticket notater:</h1>
            <div className="flex flex-col gap-4 p-2">
                {notes.map((note, index) => (
                    <div key={index} className="flex flex-col border shadow-md shadow-gray-200 rounded-4xl py-6 px-2">
                        <div className="flex">
                            <p>{note.text}</p>
                        </div>
                        <div className="flex mt-6">
                            {/* Bruker denne for å vise datoen for formatet fra databasen ser grisete ut */}
                            <p className="">{new Date(note.createdAt).toLocaleString("no-NO")}</p>
                        </div>
                    </div>

                ))}
            </div>
            </div>
        </>
    );
}
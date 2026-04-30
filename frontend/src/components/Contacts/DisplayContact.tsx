import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Contact } from "@/types/Contacts";

export default function DisplayContact() {
    const { id } = useParams();
    const [contact, setContact] = useState<Contact | null>(null);

    useEffect(() => {
        async function fetchContact() {
            try {
                const response = await fetch(`http://localhost:8080/api/v1/contacts/${id}`);
                if (!response.ok) throw new Error("Failed to fetch contact");
                setContact(await response.json());
            } catch (error) {
                console.error(error);
            }
        }
        if (id) fetchContact();
    }, [id]);

    if (!contact) {
        return null;
    }

    return (
        <div className="max-w-3xl space-y-4">
            <header>
                <h1 className="text-xl font-semibold">Kontakt</h1>
            </header>

            <div className="rounded-md border bg-card">
                <div className="border-b px-4 py-3">
                    <h2 className="text-base font-semibold">{contact.firstName} {contact.lastName}</h2>
                    <p className="text-sm text-muted-foreground">
                        Kontaktnr. {contact.contactNo}
                        {contact.role ? ` · ${contact.role}` : ""}
                    </p>
                </div>

                <dl className="grid grid-cols-[max-content_1fr] gap-x-4 gap-y-1 px-4 py-4 text-sm">
                    <dt className="text-muted-foreground">Bedrift</dt>
                    <dd>
                        {contact.customer ? (
                            <Link
                                to={`/customers/${contact.customer.id}`}
                                className="text-foreground underline-offset-2 hover:underline"
                            >
                                {contact.customer.companyName}
                            </Link>
                        ) : (
                            "—"
                        )}
                    </dd>
                    <dt className="text-muted-foreground">Telefon</dt>
                    <dd>{contact.phone}</dd>
                    <dt className="text-muted-foreground">E-post</dt>
                    <dd>{contact.email}</dd>
                </dl>
            </div>
        </div>
    );
}

import { useCallback, useEffect, useState } from "react";
import { X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { CreateContact } from "@/components/Contacts/CreateContact";
import { Contact } from "@/types/Contacts";

export default function ContactTable() {
    const [contacts, setContacts] = useState<Contact[]>([]);
    const [showForm, setShowForm] = useState(false);
    const navigate = useNavigate();

    const fetchContacts = useCallback(async () => {
        try {
            const res = await fetch("http://localhost:8080/api/v1/contacts");
            if (!res.ok) throw new Error("Kunne ikke hente kontakter");
            setContacts(await res.json());
        } catch (error) {
            console.error(error);
        }
    }, []);

    useEffect(() => {
        fetchContacts();
    }, [fetchContacts]);

    return (
        <div className="space-y-4">
            <div className="flex justify-end">
                <Button type="button" onClick={() => setShowForm(true)}>
                    Opprett kontakt
                </Button>
            </div>

            {showForm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
                    <div className="w-full max-w-xl rounded-md border bg-card">
                        <div className="flex items-center justify-between border-b px-4 py-3">
                            <h2 className="text-base font-semibold">Ny kontakt</h2>
                            <button
                                type="button"
                                onClick={() => setShowForm(false)}
                                className="rounded-md p-1.5 hover:bg-accent"
                                aria-label="Lukk"
                            >
                                <X size={18} />
                            </button>
                        </div>
                        <CreateContact
                            onSuccess={() => {
                                setShowForm(false);
                                fetchContacts();
                            }}
                        />
                    </div>
                </div>
            )}

            <div className="rounded-md border bg-card">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Nr.</TableHead>
                            <TableHead>Navn</TableHead>
                            <TableHead>Rolle</TableHead>
                            <TableHead>Bedrift</TableHead>
                            <TableHead>E-post</TableHead>
                            <TableHead>Telefon</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {contacts.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="py-6 text-center text-muted-foreground">
                                    Ingen kontakter registrert.
                                </TableCell>
                            </TableRow>
                        ) : (
                            contacts.map((contact) => (
                                <TableRow
                                    key={contact.id}
                                    onClick={() => navigate(`/contacts/${contact.id}`)}
                                    className="cursor-pointer"
                                >
                                    <TableCell>{contact.contactNo}</TableCell>
                                    <TableCell>{contact.firstName} {contact.lastName}</TableCell>
                                    <TableCell>{contact.role ?? "—"}</TableCell>
                                    <TableCell>{contact.customer?.companyName ?? "—"}</TableCell>
                                    <TableCell>{contact.email}</TableCell>
                                    <TableCell>{contact.phone}</TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}

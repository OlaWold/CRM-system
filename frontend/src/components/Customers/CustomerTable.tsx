import { useCallback, useEffect, useState } from "react";
import { X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { CreateCustomer } from "@/components/Customers/CreateCustomer";
import SearchCustomers from "@/components/Customers/SearchCustomers";

type Customer = {
    id: number;
    customerNo: string;
    companyName: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
};

export default function CustomerTable() {
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [showForm, setShowForm] = useState(false);
    const navigate = useNavigate();

    const fetchCustomers = useCallback(async () => {
        try {
            const res = await fetch("http://localhost:8080/api/v1/customers");
            if (!res.ok) {
                throw new Error("Kunne ikke koble til serveren");
            }
            const json = await res.json();
            setCustomers(json);
        } catch (error) {
            console.error(error);
        }
    }, []);

    useEffect(() => {
        fetchCustomers();
    }, [fetchCustomers]);

    return (
        <div className="space-y-4">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div className="md:max-w-md md:flex-1">
                    <SearchCustomers onSelect={(customer) => navigate(`/customers/${customer.id}`)} />
                </div>
                <Button type="button" onClick={() => setShowForm(true)}>
                    Opprett kunde
                </Button>
            </div>

            {showForm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
                    <div className="w-full max-w-xl rounded-md border bg-card">
                        <div className="flex items-center justify-between border-b px-4 py-3">
                            <h2 className="text-base font-semibold">Ny kunde</h2>
                            <button
                                type="button"
                                onClick={() => setShowForm(false)}
                                className="rounded-md p-1.5 hover:bg-accent"
                                aria-label="Lukk"
                            >
                                <X size={18} />
                            </button>
                        </div>
                        <CreateCustomer
                            onSuccess={() => {
                                setShowForm(false);
                                fetchCustomers();
                            }}
                        />
                    </div>
                </div>
            )}

            <div className="rounded-md border bg-card">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Kundenr.</TableHead>
                            <TableHead>Bedrift</TableHead>
                            <TableHead>Fornavn</TableHead>
                            <TableHead>Etternavn</TableHead>
                            <TableHead>E-post</TableHead>
                            <TableHead>Telefon</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {customers.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="py-6 text-center text-muted-foreground">
                                    Ingen kunder registrert.
                                </TableCell>
                            </TableRow>
                        ) : (
                            customers.map((customer) => (
                                <TableRow
                                    key={customer.id}
                                    onClick={() => navigate(`/customers/${customer.id}`)}
                                    className="cursor-pointer"
                                >
                                    <TableCell>{customer.customerNo}</TableCell>
                                    <TableCell>{customer.companyName}</TableCell>
                                    <TableCell>{customer.firstName}</TableCell>
                                    <TableCell>{customer.lastName}</TableCell>
                                    <TableCell>{customer.email}</TableCell>
                                    <TableCell>{customer.phone}</TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}

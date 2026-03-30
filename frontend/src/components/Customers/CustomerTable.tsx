import { useState, useEffect } from 'react';
import {TableBody, Table, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import { Button } from "../ui/button";
import {useNavigate} from "react-router-dom";
import {CreateCustomer} from "@/components/Customers/CreateCustomer";
import SearchCustomers from "@/components/Customers/SearchCustomers";
import {CreateTickets} from "@/components/Tickets/CreateTicket";

type Customer = {
    id: number;
    customerNo: string;
    companyName: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
}

export default function CustomerTable() {
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [showForm, setShowForm] = useState(false);

    const navigate = useNavigate();
        console.log("Oppdaterer tabell...");

    useEffect(() => {
        const fetchCustomers = async () => {
            try {
                const res = await fetch("http://localhost:8080/api/v1/customers");

                if (!res.ok) {
                    throw new Error("Kunne ikke koble til serveren");
                }

                const json = await res.json();
                setCustomers(json);
            } catch (error) {
                console.log(error);
            }
        }

        fetchCustomers();
    }, []);



    return (
        <div>
        <div className="relative mb-8"><SearchCustomers onSelect={(customer) => navigate(`/customers/${customer.id}`)} /> </div>
        <div className="bg-white p-6 text-lg rounded-4xl">

            <Button className="cursor-pointer" type="button" onClick={() => setShowForm(true)}>Opprett kunde</Button>

            {showForm && (
                <div className="fixed flex inset-0 z-50 justify-center items-center bg-black/50">
                    <div className="bg-white p-6 w-full max-w-xl rounded-4xl">
                        <div>
                            <div className="flex justify-between">
                                <h1 className="font-semibold ml-4">Ny kunde:</h1>
                                <button onClick={() => setShowForm(false)} className="relative h-8 w-8 cursor-pointer">
                                    <span className="absolute h-0.5 w-6 -translate-x-1/2 -translate-y-1/2 rotate-45 bg-black" />
                                    <span className="absolute h-0.5 w-6 -translate-x-1/2 -translate-y-1/2 -rotate-45 bg-black" />
                                </button>
                            </div>

                            <CreateCustomer />

                        </div>
                    </div>
                </div>
            )}
            <div className="flex bg-white border-b border-grey-200 mt-4">

                <Table className="">
                    <TableHeader className="">
                        <TableRow className="">
                            <TableHead className="text-lg md:text-xl">Kundenr</TableHead >
                            <TableHead className="text-lg md:text-xl">Bedrift</TableHead >
                            <TableHead className="text-lg md:text-xl">Fornavn</TableHead >
                            <TableHead className="text-lg md:text-xl">Etternavn</TableHead >
                            <TableHead className="text-lg md:text-xl">E-post</TableHead >
                            <TableHead className="text-lg md:text-xl">Telefon</TableHead >
                            <TableHead className="text-lg md:text-xl"></TableHead >
                        </TableRow>
                    </TableHeader>
                    <TableBody className="">
                        {customers.map((customer) => (
                            <TableRow key={customer.id} onClick={() => navigate(`/customers/${customer.id}`)} className="cursor-pointer">
                                <TableCell className="text-lg md:text-xl">{customer.customerNo}</TableCell>
                                <TableCell className="text-lg md:text-xl">{customer.companyName}</TableCell>
                                <TableCell className="text-lg md:text-xl">{customer.firstName}</TableCell>
                                <TableCell className="text-lg md:text-xl">{customer.lastName}</TableCell>
                                <TableCell className="text-lg md:text-xl">{customer.email}</TableCell>
                                <TableCell className="text-lg md:text-xl">{customer.phone}</TableCell>
                            </TableRow>
                    ))}
                    </TableBody>
                </Table>
            </div>
        </div>
        </div>
    );
}

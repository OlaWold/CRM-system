import { useState, useEffect } from 'react';
import {TableBody, Table, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import { Button } from "../ui/button";
import {useNavigate} from "react-router-dom";
import AddCustomer from "@/components/Customers/AddCustomer";
import SearchCustomers from "@/components/Customers/SearchCustomers";

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

    const navigate = useNavigate();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const refreshData = () => {
        console.log("Oppdaterer tabell...");
    }

    useEffect(() => {
        const fetchCustomers = async () => {
            try {
                const res = await fetch("http://localhost:8080/api/v1/customers");

                if (!res.ok) {
                    throw new Error("Kunne ikke koble til serveren");
                }

                const json = await res.json();
                setCustomers(json);
            } catch (Error) {
                console.log("Error fetching customers");
            }
        }

        fetchCustomers();
    }, []);



    return (
        <div>
        <div className="relative mb-8"><SearchCustomers onSelect={(customer) => navigate(`/customers/${customer.id}`)} /> </div>
        <div className="bg-white p-6 text-lg rounded-4xl">

            <div>
                <AddCustomer isOpen={isModalOpen}
                             onClose={() => setIsModalOpen(false)}
                             onCustomerAdded={refreshData}
                />
                <Button
                    onClick={() => {setIsModalOpen(true);}}
                    className="">
                    Opprett ny kunde
                </Button>
            </div>
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

import {useEffect, useState} from "react";
import {Input} from "@/components/ui/input";
import {Customer} from "@/types/Customers";

type SearchCustomersProps = {
    onSelect?: (customer: Customer) => void;
};

export default function SearchCustomers({onSelect}: SearchCustomersProps) {

    const [q, setQ] = useState("");
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {

            const search = q.trim()

        if (!search) {
            setCustomers([]);
            return;
        }

        const timeout = setTimeout(async() => {
            try {
                setLoading(true);
                const response = await fetch(`http://localhost:8080/api/v1/customers/search?q=${encodeURIComponent(q)}`);

                if (!response.ok) {
                    throw Error("Could Not Fetch Customers");
                }

                const data: Customer[] = await response.json();

                setCustomers(data);
            } catch (error) {
                console.error(error);
                setCustomers([]);
            } finally {
                setLoading(false);
            }
        }, 300);
        return () => {
            clearTimeout(timeout);
        }

}, [q])
    return (
        <div className="relative w-full">
            <input
                className="bg-white rounded-2xl shadow-md border-slate-200  py-3 px-5"
                type="text"
                placeholder="Søk etter kunde"
                value={q}
                onChange={(e) => setQ(e.target.value)}
            />

            {loading && (
                <div className="absolute top-full left-0 mt-1 w-full rounded-xl border bg-white p-3 shadow z-50">
                    Søker...
                </div>
            )}

            {!loading && customers.length > 0 && (
                <div className="absolute top-full left-0 mt-1 w-full rounded-xl border bg-white shadow z-50">
                    {customers.map((customer) => (
                        <button
                            key={customer.id}
                            type="button"
                            className="block w-full px-3 py-2 text-left hover:bg-slate-100"
                            onClick={() => {
                                setQ(customer.companyName);
                                setCustomers([]);
                                onSelect?.(customer);
                            }}
                        >
                            {customer.companyName}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
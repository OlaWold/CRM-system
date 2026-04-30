import { useEffect, useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { Customer } from "@/types/Customers";

type SearchCustomersProps = {
    onSelect?: (customer: Customer) => void;
};

export default function SearchCustomers({ onSelect }: SearchCustomersProps) {
    const [q, setQ] = useState("");
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [loading, setLoading] = useState(false);
    const lastSelectedName = useRef<string | null>(null);

    useEffect(() => {
        if (lastSelectedName.current !== null && q === lastSelectedName.current) {
            return;
        }

        const search = q.trim();
        if (!search) {
            setCustomers([]);
            return;
        }

        const timeout = setTimeout(async () => {
            try {
                setLoading(true);
                const response = await fetch(
                    `http://localhost:8080/api/v1/customers/search?q=${encodeURIComponent(search)}`
                );
                if (!response.ok) {
                    throw new Error("Could not fetch customers");
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

        return () => clearTimeout(timeout);
    }, [q]);

    return (
        <div className="relative w-full">
            <Input
                type="text"
                placeholder="Søk etter kunde"
                value={q}
                onChange={(e) => setQ(e.target.value)}
            />

            {loading && (
                <div className="absolute left-0 top-full z-50 mt-1 w-full rounded-md border bg-popover p-2 text-sm text-muted-foreground shadow-sm">
                    Søker...
                </div>
            )}

            {!loading && customers.length > 0 && (
                <div className="absolute left-0 top-full z-50 mt-1 w-full rounded-md border bg-popover shadow-sm">
                    {customers.map((customer) => (
                        <button
                            key={customer.id}
                            type="button"
                            className="block w-full px-3 py-2 text-left text-sm hover:bg-accent"
                            onClick={() => {
                                lastSelectedName.current = customer.companyName;
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

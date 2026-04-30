import { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Customer } from "@/types/Customers";

type Props = {
    ticketId: number;
    onClose: () => void;
    onAssigned: () => void;
};

export default function AssignCustomerModal({ ticketId, onClose, onAssigned }: Props) {
    const [q, setQ] = useState("");
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [selected, setSelected] = useState<Customer | null>(null);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const lastSelectedName = useRef<string | null>(null);

    useEffect(() => {
        if (lastSelectedName.current !== null && q === lastSelectedName.current) return;

        if (selected) setSelected(null);

        const search = q.trim();
        if (!search) {
            setCustomers([]);
            return;
        }

        const timeout = setTimeout(async () => {
            try {
                const res = await fetch(
                    `http://localhost:8080/api/v1/customers/search?q=${encodeURIComponent(search)}`
                );
                if (!res.ok) throw new Error("Søk feilet");
                setCustomers(await res.json());
            } catch (e) {
                console.error(e);
            }
        }, 300);

        return () => clearTimeout(timeout);
    }, [q, selected]);

    async function assign() {
        if (!selected) return;
        setSubmitting(true);
        setError(null);
        try {
            const res = await fetch(
                `http://localhost:8080/api/v1/tickets/${ticketId}/assign-customer`,
                {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ customerId: selected.id }),
                }
            );
            if (!res.ok) throw new Error("Kunne ikke tildele kunde");
            onAssigned();
        } catch (e) {
            setError(e instanceof Error ? e.message : "Ukjent feil");
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
            <div className="w-full max-w-xl rounded-md border bg-card">
                <div className="flex items-center justify-between border-b px-4 py-3">
                    <h2 className="text-base font-semibold">Tildel kunde</h2>
                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-md p-1.5 hover:bg-accent"
                        aria-label="Lukk"
                    >
                        <X size={18} />
                    </button>
                </div>

                <div className="space-y-3 p-4">
                    <div className="relative">
                        <Input
                            placeholder="Søk etter kunde..."
                            value={q}
                            onChange={(e) => setQ(e.target.value)}
                            autoFocus
                        />
                        {customers.length > 0 && !selected && (
                            <div className="absolute left-0 top-full z-50 mt-1 w-full rounded-md border bg-popover shadow-sm">
                                {customers.map((c) => (
                                    <button
                                        key={c.id}
                                        type="button"
                                        className="block w-full px-3 py-2 text-left text-sm hover:bg-accent"
                                        onClick={() => {
                                            lastSelectedName.current = c.companyName;
                                            setQ(c.companyName);
                                            setSelected(c);
                                            setCustomers([]);
                                        }}
                                    >
                                        {c.companyName}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {selected && (
                        <p className="text-sm text-muted-foreground">
                            Valgt: <span className="font-medium text-foreground">{selected.companyName}</span>
                        </p>
                    )}

                    {error && <p className="text-sm text-red-600">{error}</p>}

                    <div className="flex justify-end gap-2">
                        <Button size="sm" variant="outline" onClick={onClose}>
                            Avbryt
                        </Button>
                        <Button size="sm" onClick={assign} disabled={!selected || submitting}>
                            {submitting ? "Tildeler..." : "Tildel"}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}

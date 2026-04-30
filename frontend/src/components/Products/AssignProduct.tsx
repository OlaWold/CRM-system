import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Product } from "@/types/Products";

const formatPrice = (value: number) =>
    new Intl.NumberFormat("no-NO", { style: "currency", currency: "NOK" }).format(value);

type Props = {
    customerId: number;
    excludeProductIds: number[];
    onSuccess?: () => void;
};

export function AssignProduct({ customerId, excludeProductIds, onSuccess }: Props) {
    const [products, setProducts] = useState<Product[]>([]);
    const [selectedId, setSelectedId] = useState<number | null>(null);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function load() {
            try {
                const res = await fetch("http://localhost:8080/api/v1/products");
                if (!res.ok) throw new Error("Kunne ikke hente produkter");
                setProducts(await res.json());
            } catch (e) {
                console.error(e);
                setError("Kunne ikke laste produktkatalogen");
            }
        }
        load();
    }, []);

    const exclude = new Set(excludeProductIds);
    const available = products.filter((p) => !exclude.has(p.id));

    async function handleSubmit() {
        if (!selectedId) return;
        setSubmitting(true);
        setError(null);
        try {
            const res = await fetch(`http://localhost:8080/api/v1/customers/${customerId}/products`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ productId: selectedId }),
            });
            if (!res.ok) throw new Error("Failed to assign product");
            onSuccess?.();
        } catch {
            setError("Kunne ikke knytte produktet til kunden");
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <div className="space-y-3 p-4">
            {available.length === 0 ? (
                <p className="text-sm text-slate-500">
                    Ingen tilgjengelige produkter. Opprett produkter i katalogen først.
                </p>
            ) : (
                <ul className="max-h-72 divide-y overflow-y-auto rounded-md border">
                    {available.map((product) => (
                        <li key={product.id}>
                            <button
                                type="button"
                                onClick={() => setSelectedId(product.id)}
                                className={`flex w-full items-center justify-between gap-4 px-3 py-2 text-left text-sm hover:bg-slate-50 ${
                                    selectedId === product.id ? "bg-slate-100" : ""
                                }`}
                            >
                                <div className="min-w-0">
                                    <p className="font-medium">{product.name}</p>
                                    {product.description && (
                                        <p className="truncate text-xs text-slate-500">{product.description}</p>
                                    )}
                                </div>
                                <span className="whitespace-nowrap text-slate-700">{formatPrice(product.price)}</span>
                            </button>
                        </li>
                    ))}
                </ul>
            )}

            {error && <p className="text-sm text-red-600">{error}</p>}

            <div className="flex justify-end">
                <Button
                    type="button"
                    onClick={handleSubmit}
                    disabled={!selectedId || submitting}
                >
                    {submitting ? "Legger til..." : "Legg til"}
                </Button>
            </div>
        </div>
    );
}

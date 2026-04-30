import { useCallback, useEffect, useState } from "react";
import { X } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { CreateProduct } from "@/components/Products/CreateProduct";
import { Product } from "@/types/Products";

const formatPrice = (value: number) =>
    new Intl.NumberFormat("no-NO", { style: "currency", currency: "NOK" }).format(value);

export default function ProductTable() {
    const [products, setProducts] = useState<Product[]>([]);
    const [showForm, setShowForm] = useState(false);

    const fetchProducts = useCallback(async () => {
        try {
            const res = await fetch("http://localhost:8080/api/v1/products");
            if (!res.ok) throw new Error("Kunne ikke hente produkter");
            setProducts(await res.json());
        } catch (error) {
            console.error(error);
        }
    }, []);

    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    return (
        <div className="space-y-4">
            <div className="flex justify-end">
                <Button type="button" onClick={() => setShowForm(true)}>
                    Opprett produkt
                </Button>
            </div>

            {showForm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
                    <div className="w-full max-w-xl rounded-md border bg-card">
                        <div className="flex items-center justify-between border-b px-4 py-3">
                            <h2 className="text-base font-semibold">Nytt produkt</h2>
                            <button
                                type="button"
                                onClick={() => setShowForm(false)}
                                className="rounded-md p-1.5 hover:bg-accent"
                                aria-label="Lukk"
                            >
                                <X size={18} />
                            </button>
                        </div>
                        <CreateProduct
                            onSuccess={() => {
                                setShowForm(false);
                                fetchProducts();
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
                            <TableHead className="hidden md:table-cell">Beskrivelse</TableHead>
                            <TableHead className="text-right">Pris</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {products.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={4} className="py-6 text-center text-muted-foreground">
                                    Ingen produkter i katalogen.
                                </TableCell>
                            </TableRow>
                        ) : (
                            products.map((product) => (
                                <TableRow key={product.id}>
                                    <TableCell>{product.productNo}</TableCell>
                                    <TableCell className="font-medium">{product.name}</TableCell>
                                    <TableCell className="hidden md:table-cell text-muted-foreground">
                                        {product.description ?? "—"}
                                    </TableCell>
                                    <TableCell className="text-right">{formatPrice(product.price)}</TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}

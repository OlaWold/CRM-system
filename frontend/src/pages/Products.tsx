import ProductTable from "@/components/Products/ProductTable";

export default function Products() {
    return (
        <div className="space-y-4">
            <header>
                <h1 className="text-xl font-semibold">Produktkatalog</h1>
                <p className="text-sm text-muted-foreground">Produkter som kan knyttes til kunder.</p>
            </header>
            <ProductTable />
        </div>
    );
}

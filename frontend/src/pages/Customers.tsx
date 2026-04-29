import CustomerTable from "@/components/Customers/CustomerTable";

export default function Customers() {
    return (
        <div className="space-y-4">
            <header>
                <h1 className="text-xl font-semibold">Kundeliste</h1>
                <p className="text-sm text-slate-600">Oversikt over alle registrerte kunder.</p>
            </header>
            <CustomerTable />
        </div>
    );
}

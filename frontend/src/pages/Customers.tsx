import CustomerTable from "@/components/Customers/CustomerTable";

export default function Customers() {




    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-semibold">Kundeliste</h1>
                    <p className="text-black text-sm">Oversikt over alle registrerte kunder i systemet.</p>
                </div>

            </div>

            <CustomerTable />


        </div>
    );
}
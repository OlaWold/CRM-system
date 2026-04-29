import ContactTable from "@/components/Contacts/ContactTable";

export default function Contacts() {
    return (
        <div className="space-y-4">
            <header>
                <h1 className="text-xl font-semibold">Kontakter</h1>
                <p className="text-sm text-slate-600">Personer knyttet til kunder.</p>
            </header>
            <ContactTable />
        </div>
    );
}

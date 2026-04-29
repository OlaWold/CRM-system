import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function CountCustomers() {
    const [count, setCount] = useState<number | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        async function fetchCount() {
            try {
                const response = await fetch("http://localhost:8080/api/v1/customers/count");
                if (!response.ok) {
                    throw new Error("Could not fetch customer count");
                }
                const data = await response.json();
                setCount(data);
            } catch (error) {
                console.error(error);
            }
        }
        fetchCount();
    }, []);

    return (
        <div className="rounded-md border bg-white p-4">
            <p className="text-sm text-slate-600">Antall kunder</p>
            <p className="mt-1 text-2xl font-semibold">{count ?? "—"}</p>
            <Button variant="outline" size="sm" className="mt-3" onClick={() => navigate("/customers")}>
                Gå til kunder
            </Button>
        </div>
    );
}

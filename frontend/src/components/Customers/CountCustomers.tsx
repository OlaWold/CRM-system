import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

type CustomerStats = {
    totalCount: number;
    last30Days: number;
    last60Days: number;
    growthThirtyDays: number | null;
    growthQuarter: number | null;
    growthHalfYear: number | null;
    growthYear: number | null;
};

const formatGrowth = (value: number | null) => {
    if (value === null) return "—";
    const sign = value > 0 ? "+" : "";
    return `${sign}${value.toFixed(1)}%`;
};

const growthClass = (value: number | null) => {
    if (value === null || value === 0) return "text-foreground";
    return value > 0 ? "text-green-700" : "text-red-700";
};

export default function CountCustomers() {
    const [stats, setStats] = useState<CustomerStats | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        async function fetchStats() {
            try {
                const response = await fetch("http://localhost:8080/api/v1/customers/stats");
                if (!response.ok) {
                    throw new Error("Could not fetch customer stats");
                }
                setStats(await response.json());
            } catch (error) {
                console.error(error);
            }
        }
        fetchStats();
    }, []);

    const counts: { label: string; value: number | null }[] = [
        { label: "Antall kunder", value: stats?.totalCount ?? null },
        { label: "Nye siste 30 dager", value: stats?.last30Days ?? null },
        { label: "Nye siste 60 dager", value: stats?.last60Days ?? null },
    ];

    const growths: { label: string; value: number | null | undefined }[] = [
        { label: "Vekst 30 dager", value: stats?.growthThirtyDays },
        { label: "Vekst kvartal", value: stats?.growthQuarter },
        { label: "Vekst halvår", value: stats?.growthHalfYear },
        { label: "Vekst år", value: stats?.growthYear },
    ];

    return (
        <section className="space-y-3">
            <h2 className="text-base font-semibold">Kunder</h2>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {counts.map((stat) => (
                    <div key={stat.label} className="rounded-md border bg-card p-4">
                        <p className="text-sm text-muted-foreground">{stat.label}</p>
                        <p className="mt-1 text-2xl font-semibold">{stat.value ?? "—"}</p>
                    </div>
                ))}

                {growths.map((stat) => (
                    <div key={stat.label} className="rounded-md border bg-card p-4">
                        <p className="text-sm text-muted-foreground">{stat.label}</p>
                        <p className={`mt-1 text-2xl font-semibold ${growthClass(stat.value ?? null)}`}>
                            {stats === null ? "—" : formatGrowth(stat.value ?? null)}
                        </p>
                        <p className="text-xs text-muted-foreground">vs. forrige periode</p>
                    </div>
                ))}
            </div>

            <Button variant="outline" onClick={() => navigate("/customers")}>
                Gå til kunder
            </Button>
        </section>
    );
}

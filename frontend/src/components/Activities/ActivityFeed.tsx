import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    Activity,
    activityStatusLabels,
    activityTypeColor,
    activityTypeLabels,
} from "@/types/Activities";

const formatRelative = (iso: string | undefined) => {
    if (!iso) return "";
    const created = new Date(iso).getTime();
    const diffMs = Date.now() - created;
    const minute = 60_000;
    const hour = 60 * minute;
    const day = 24 * hour;

    if (diffMs < minute) return "akkurat nå";
    if (diffMs < hour) return `${Math.floor(diffMs / minute)} min siden`;
    if (diffMs < day) return `${Math.floor(diffMs / hour)} t siden`;
    if (diffMs < 7 * day) return `${Math.floor(diffMs / day)} d siden`;
    return new Date(iso).toLocaleDateString("no-NO", {
        day: "2-digit",
        month: "short",
    });
};

export default function ActivityFeed() {
    const [items, setItems] = useState<Activity[] | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        async function load() {
            try {
                const res = await fetch("http://localhost:8080/api/v1/activities/recent");
                if (!res.ok) throw new Error("Failed to load activity feed");
                setItems(await res.json());
            } catch (error) {
                console.error(error);
                setItems([]);
            }
        }
        load();
    }, []);

    return (
        <section className="space-y-3">
            <h2 className="text-base font-semibold">Aktivitetsfeed</h2>

            <div className="rounded-md border bg-card">
                {items === null ? (
                    <p className="px-3 py-3 text-sm text-muted-foreground">Laster...</p>
                ) : items.length === 0 ? (
                    <p className="px-3 py-3 text-sm text-muted-foreground">Ingen aktiviteter registrert.</p>
                ) : (
                    <ul className="divide-y">
                        {items.map((a) => (
                            <li key={a.id}>
                                <button
                                    type="button"
                                    onClick={() => navigate("/activities")}
                                    className="flex w-full flex-col gap-1 px-3 py-2 text-left text-sm hover:bg-accent sm:flex-row sm:items-center sm:gap-4"
                                >
                                    <span className="w-28 shrink-0 text-xs text-muted-foreground">
                                        {formatRelative(a.created)}
                                    </span>
                                    <span
                                        className={`inline-block w-fit rounded px-1.5 py-0.5 text-xs ${activityTypeColor[a.type]}`}
                                    >
                                        {activityTypeLabels[a.type]}
                                    </span>
                                    <span
                                        className={`min-w-0 flex-1 truncate font-medium ${
                                            a.status !== "PLANNED" ? "text-muted-foreground line-through" : ""
                                        }`}
                                    >
                                        {a.title}
                                    </span>
                                    <span className="text-muted-foreground">{a.customer?.companyName ?? "—"}</span>
                                    <span className="text-xs text-muted-foreground">
                                        {activityStatusLabels[a.status]}
                                    </span>
                                </button>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </section>
    );
}

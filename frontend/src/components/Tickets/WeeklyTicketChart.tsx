import { useEffect, useState } from "react";

type WeekStats = {
    weekStart: string;
    newTickets: number;
    closedTickets: number;
};

const isoWeek = (date: Date) => {
    const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    const dayNum = d.getUTCDay() || 7;
    d.setUTCDate(d.getUTCDate() + 4 - dayNum);
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    return Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
};

export default function WeeklyTicketChart() {
    const [weeks, setWeeks] = useState<WeekStats[] | null>(null);

    useEffect(() => {
        async function load() {
            try {
                const res = await fetch("http://localhost:8080/api/v1/tickets/weekly-stats?weeks=8");
                if (!res.ok) throw new Error("Failed to load weekly stats");
                setWeeks(await res.json());
            } catch (error) {
                console.error(error);
                setWeeks([]);
            }
        }
        load();
    }, []);

    const chartWidth = 800;
    const chartHeight = 280;
    const padding = { top: 16, right: 16, bottom: 36, left: 36 };
    const innerWidth = chartWidth - padding.left - padding.right;
    const innerHeight = chartHeight - padding.top - padding.bottom;

    const data = weeks ?? [];
    const maxValue = Math.max(1, ...data.flatMap((w) => [w.newTickets, w.closedTickets]));

    const niceMax = Math.ceil(maxValue / 5) * 5 || 5;
    const yTicks = [0, 0.25, 0.5, 0.75, 1].map((p) => Math.round(niceMax * p));

    const yPos = (value: number) =>
        padding.top + innerHeight - (value / niceMax) * innerHeight;

    const groupWidth = data.length ? innerWidth / data.length : 0;
    const barGap = 4;
    const barWidth = data.length ? Math.max(0, (groupWidth - barGap) / 2 - 6) : 0;

    return (
        <section className="space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
                <h2 className="text-base font-semibold">Saker per uke</h2>
                <div className="flex gap-3 text-xs">
                    <span className="flex items-center gap-1.5">
                        <span className="inline-block h-2.5 w-2.5 rounded-sm bg-blue-500" /> Nye
                    </span>
                    <span className="flex items-center gap-1.5">
                        <span className="inline-block h-2.5 w-2.5 rounded-sm bg-green-600" /> Lukket
                    </span>
                </div>
            </div>

            <div className="rounded-md border bg-card p-4">
                {weeks === null ? (
                    <p className="text-sm text-muted-foreground">Laster...</p>
                ) : data.length === 0 ? (
                    <p className="text-sm text-muted-foreground">Ingen data.</p>
                ) : (
                    <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="h-64 w-full">
                        {yTicks.map((tick) => (
                            <g key={tick}>
                                <line
                                    x1={padding.left}
                                    y1={yPos(tick)}
                                    x2={padding.left + innerWidth}
                                    y2={yPos(tick)}
                                    className="stroke-border"
                                    strokeWidth={1}
                                />
                                <text
                                    x={padding.left - 6}
                                    y={yPos(tick) + 4}
                                    textAnchor="end"
                                    fontSize="11"
                                    className="fill-muted-foreground"
                                >
                                    {tick}
                                </text>
                            </g>
                        ))}

                        {data.map((week, i) => {
                            const groupX = padding.left + i * groupWidth + 6;
                            const date = new Date(`${week.weekStart}T00:00:00`);
                            const label = `u. ${isoWeek(date)}`;
                            const newH = yPos(0) - yPos(week.newTickets);
                            const closedH = yPos(0) - yPos(week.closedTickets);
                            return (
                                <g key={week.weekStart}>
                                    <rect
                                        x={groupX}
                                        y={yPos(week.newTickets)}
                                        width={barWidth}
                                        height={newH}
                                        fill="#3b82f6"
                                        rx={2}
                                    />
                                    {week.newTickets > 0 && (
                                        <text
                                            x={groupX + barWidth / 2}
                                            y={yPos(week.newTickets) - 4}
                                            textAnchor="middle"
                                            fontSize="10"
                                            className="fill-blue-700 dark:fill-blue-300"
                                        >
                                            {week.newTickets}
                                        </text>
                                    )}
                                    <rect
                                        x={groupX + barWidth + barGap}
                                        y={yPos(week.closedTickets)}
                                        width={barWidth}
                                        height={closedH}
                                        fill="#16a34a"
                                        rx={2}
                                    />
                                    {week.closedTickets > 0 && (
                                        <text
                                            x={groupX + barWidth + barGap + barWidth / 2}
                                            y={yPos(week.closedTickets) - 4}
                                            textAnchor="middle"
                                            fontSize="10"
                                            className="fill-green-700 dark:fill-green-300"
                                        >
                                            {week.closedTickets}
                                        </text>
                                    )}
                                    <text
                                        x={groupX + (barWidth * 2 + barGap) / 2}
                                        y={padding.top + innerHeight + 18}
                                        textAnchor="middle"
                                        fontSize="11"
                                        className="fill-muted-foreground"
                                    >
                                        {label}
                                    </text>
                                </g>
                            );
                        })}

                        <line
                            x1={padding.left}
                            y1={padding.top + innerHeight}
                            x2={padding.left + innerWidth}
                            y2={padding.top + innerHeight}
                            className="stroke-muted-foreground/40"
                            strokeWidth={1}
                        />
                    </svg>
                )}
            </div>
        </section>
    );
}

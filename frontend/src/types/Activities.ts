export type ActivityType = "MEETING" | "CALL" | "EMAIL" | "TASK" | "OTHER";
export type ActivityStatus = "PLANNED" | "DONE" | "CANCELLED";

export type Activity = {
    id: number;
    activityNo: number;
    title: string;
    description: string | null;
    scheduledAt: string;
    durationMinutes: number;
    type: ActivityType;
    status: ActivityStatus;
    customer?: {
        id: number;
        customerNo: number;
        companyName: string;
    };
    contact?: {
        id: number;
        firstName: string;
        lastName: string;
    } | null;
    created?: string;
};

export const activityTypeLabels: Record<ActivityType, string> = {
    MEETING: "Møte",
    CALL: "Telefon",
    EMAIL: "E-post",
    TASK: "Oppgave",
    OTHER: "Annet",
};

export const activityStatusLabels: Record<ActivityStatus, string> = {
    PLANNED: "Planlagt",
    DONE: "Fullført",
    CANCELLED: "Avlyst",
};

export const activityTypeColor: Record<ActivityType, string> = {
    MEETING: "bg-blue-100 text-blue-800",
    CALL: "bg-green-100 text-green-800",
    EMAIL: "bg-purple-100 text-purple-800",
    TASK: "bg-yellow-100 text-yellow-800",
    OTHER: "bg-slate-100 text-slate-700",
};

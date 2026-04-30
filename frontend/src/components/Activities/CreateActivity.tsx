import { useEffect, useRef, useState } from "react";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { FieldDescription } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { ActivityType, activityTypeLabels } from "@/types/Activities";
import { Contact } from "@/types/Contacts";

type CustomerOption = {
    id: number;
    companyName: string;
};

type FormFields = {
    companyName: string;
    customerId: number | null;
    contactId: string;
    title: string;
    description: string;
    date: string;
    time: string;
    durationMinutes: number;
    type: ActivityType;
};

type Props = {
    onSuccess?: () => void;
    initialCustomer?: CustomerOption;
    defaultDate?: Date;
};

const NO_CONTACT = "__none__";

const toLocalDateString = (d: Date) =>
    `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

export function CreateActivity({ onSuccess, initialCustomer, defaultDate }: Props) {
    const initialDate = defaultDate ?? new Date();
    const dateString = toLocalDateString(initialDate);

    const {
        register,
        control,
        watch,
        setValue,
        handleSubmit,
        setError,
        formState: { errors, isSubmitting },
    } = useForm<FormFields>({
        defaultValues: {
            companyName: initialCustomer?.companyName ?? "",
            customerId: initialCustomer?.id ?? null,
            contactId: NO_CONTACT,
            title: "",
            description: "",
            date: dateString,
            time: "09:00",
            durationMinutes: 30,
            type: "MEETING",
        },
    });

    const [customers, setCustomers] = useState<CustomerOption[]>([]);
    const [contacts, setContacts] = useState<Contact[]>([]);
    const customerSearch = watch("companyName");
    const customerId = watch("customerId");
    const lockedCustomer = !!initialCustomer;
    const lastSelectedName = useRef<string | null>(initialCustomer?.companyName ?? null);

    useEffect(() => {
        if (lockedCustomer) return;
        if (lastSelectedName.current !== null && customerSearch === lastSelectedName.current) return;

        if (customerId !== null) {
            setValue("customerId", null);
            setValue("contactId", NO_CONTACT);
            lastSelectedName.current = null;
        }

        if (!customerSearch) {
            setCustomers([]);
            return;
        }

        const timeout = setTimeout(async () => {
            try {
                const response = await fetch(
                    `http://localhost:8080/api/v1/customers/search?q=${encodeURIComponent(customerSearch)}`
                );
                if (!response.ok) throw new Error("Failed to fetch customers");
                setCustomers(await response.json());
            } catch (error) {
                console.error(error);
            }
        }, 300);

        return () => clearTimeout(timeout);
    }, [customerSearch, customerId, lockedCustomer, setValue]);

    useEffect(() => {
        if (!customerId) {
            setContacts([]);
            return;
        }
        async function loadContacts() {
            try {
                const response = await fetch(
                    `http://localhost:8080/api/v1/contacts/customers/${customerId}`
                );
                if (!response.ok) throw new Error("Failed to load contacts");
                setContacts(await response.json());
            } catch (error) {
                console.error(error);
            }
        }
        loadContacts();
    }, [customerId]);

    const onSubmit: SubmitHandler<FormFields> = async (data) => {
        if (!data.customerId) {
            setError("companyName", { message: "Velg en kunde fra listen" });
            return;
        }

        const scheduledAt = new Date(`${data.date}T${data.time}`);
        if (Number.isNaN(scheduledAt.getTime())) {
            setError("date", { message: "Ugyldig dato/klokkeslett" });
            return;
        }

        try {
            const response = await fetch("http://localhost:8080/api/v1/activities", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    title: data.title,
                    description: data.description || null,
                    scheduledAt: scheduledAt.toISOString(),
                    durationMinutes: Number(data.durationMinutes) || 30,
                    type: data.type,
                    customerId: data.customerId,
                    contactId: data.contactId === NO_CONTACT ? null : Number(data.contactId),
                }),
            });
            if (!response.ok) throw new Error("Failed to create activity");
            onSuccess?.();
        } catch {
            setError("root", { message: "Kunne ikke opprette aktivitet" });
        }
    };

    return (
        <form className="flex flex-col gap-3 p-4" onSubmit={handleSubmit(onSubmit)}>
            <div className="relative">
                <FieldDescription>Kunde</FieldDescription>
                <Input
                    {...register("companyName", { required: "Kunde må velges" })}
                    placeholder="Kundenavn eller kundenr."
                    disabled={lockedCustomer}
                />
                {!lockedCustomer && customers.length > 0 && (
                    <div className="absolute left-0 top-full z-50 mt-1 w-full rounded-md border bg-popover shadow-sm">
                        {customers.map((customer) => (
                            <button
                                key={customer.id}
                                type="button"
                                className="block w-full px-3 py-2 text-left text-sm hover:bg-accent"
                                onClick={() => {
                                    lastSelectedName.current = customer.companyName;
                                    setValue("companyName", customer.companyName);
                                    setValue("customerId", customer.id);
                                    setCustomers([]);
                                }}
                            >
                                {customer.companyName}
                            </button>
                        ))}
                    </div>
                )}
                {errors.companyName && <p className="mt-1 text-sm text-red-600">{errors.companyName.message}</p>}
            </div>

            <div>
                <FieldDescription>Kontakt (valgfri)</FieldDescription>
                <Controller
                    name="contactId"
                    control={control}
                    render={({ field }) => (
                        <Select
                            value={field.value}
                            onValueChange={field.onChange}
                            disabled={!customerId}
                        >
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder={customerId ? "Velg kontakt" : "Velg kunde først"} />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectItem value={NO_CONTACT}>Ingen</SelectItem>
                                    {contacts.map((c) => (
                                        <SelectItem key={c.id} value={String(c.id)}>
                                            {c.firstName} {c.lastName}
                                            {c.role ? ` · ${c.role}` : ""}
                                        </SelectItem>
                                    ))}
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    )}
                />
            </div>

            <div>
                <FieldDescription>Tittel</FieldDescription>
                <Input
                    {...register("title", { required: "Tittel må fylles ut" })}
                    placeholder="F.eks. Statusmøte"
                />
                {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>}
            </div>

            <div>
                <FieldDescription>Beskrivelse</FieldDescription>
                <Textarea {...register("description")} placeholder="Notater til avtalen" />
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                <div>
                    <FieldDescription>Dato</FieldDescription>
                    <Input type="date" {...register("date", { required: "Dato må fylles ut" })} />
                    {errors.date && <p className="mt-1 text-sm text-red-600">{errors.date.message}</p>}
                </div>
                <div>
                    <FieldDescription>Klokkeslett</FieldDescription>
                    <Input type="time" {...register("time", { required: "Klokkeslett må fylles ut" })} />
                </div>
                <div>
                    <FieldDescription>Varighet (min)</FieldDescription>
                    <Input
                        type="number"
                        min="5"
                        step="5"
                        {...register("durationMinutes", {
                            required: "Varighet må fylles ut",
                            valueAsNumber: true,
                            min: { value: 5, message: "Min 5 minutter" },
                        })}
                    />
                </div>
            </div>

            <div>
                <FieldDescription>Type</FieldDescription>
                <Controller
                    name="type"
                    control={control}
                    render={({ field }) => (
                        <Select value={field.value} onValueChange={(v) => field.onChange(v as ActivityType)}>
                            <SelectTrigger className="w-48">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    {(Object.keys(activityTypeLabels) as ActivityType[]).map((t) => (
                                        <SelectItem key={t} value={t}>
                                            {activityTypeLabels[t]}
                                        </SelectItem>
                                    ))}
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    )}
                />
            </div>

            <Button disabled={isSubmitting} className="mt-2 w-fit" type="submit">
                {isSubmitting ? "Oppretter..." : "Opprett avtale"}
            </Button>
            {errors.root && <p className="mt-1 text-sm text-red-600">{errors.root.message}</p>}
        </form>
    );
}

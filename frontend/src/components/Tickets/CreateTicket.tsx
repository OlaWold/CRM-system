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

type Customer = {
    id: number;
    customerNo: number;
    companyName: string;
};

type FormFields = {
    companyName: string;
    customerId: number | null;
    subject: string;
    description: string;
    contactName: string;
    email: string;
    phone: string;
    status: string;
};

type Props = {
    onSuccess?: () => void;
};

export function CreateTickets({ onSuccess }: Props) {
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
            companyName: "",
            customerId: null,
            subject: "",
            description: "",
            contactName: "",
            email: "",
            phone: "",
            status: "OPEN",
        },
    });

    const [customers, setCustomers] = useState<Customer[]>([]);
    const customerSearch = watch("companyName");
    const customerId = watch("customerId");
    const lastSelectedName = useRef<string | null>(null);

    useEffect(() => {
        if (lastSelectedName.current !== null && customerSearch === lastSelectedName.current) {
            return;
        }

        if (customerId !== null) {
            setValue("customerId", null);
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
                if (!response.ok) {
                    throw new Error("Failed to fetch customers");
                }
                const data = await response.json();
                setCustomers(data);
            } catch {
                setError("root", { message: "Klarte ikke å søke etter kunder" });
            }
        }, 300);

        return () => clearTimeout(timeout);
    }, [customerSearch, customerId, setValue, setError]);

    const onSubmit: SubmitHandler<FormFields> = async (data) => {
        if (!data.customerId) {
            setError("companyName", { message: "Velg en kunde fra listen" });
            return;
        }
        try {
            const response = await fetch("http://localhost:8080/api/v1/tickets", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                throw new Error("Failed to save ticket");
            }

            onSuccess?.();
        } catch {
            setError("root", { message: "Feil med et av feltene" });
        }
    };

    return (
        <form className="flex flex-col gap-3 p-4" onSubmit={handleSubmit(onSubmit)}>
            <div className="relative">
                <FieldDescription>Kundenavn eller kundenr.</FieldDescription>
                <Input
                    {...register("companyName", { required: "Bedriftsnavn må fylles ut" })}
                    placeholder="Kundenavn eller kundenr."
                />
                {customers.length > 0 && (
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
                <FieldDescription>Emne</FieldDescription>
                <Input
                    {...register("subject", { required: "Emne må fylles ut" })}
                    placeholder="Emne"
                />
                {errors.subject && <p className="mt-1 text-sm text-red-600">{errors.subject.message}</p>}
            </div>

            <div>
                <FieldDescription>Beskrivelse</FieldDescription>
                <Textarea
                    {...register("description", { required: "Beskrivelse må fylles ut" })}
                    placeholder="Beskrivelse"
                />
                {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>}
            </div>

            <div>
                <FieldDescription>Kontaktperson</FieldDescription>
                <Input
                    {...register("contactName", { required: "Kontaktperson må fylles ut" })}
                    placeholder="Kontaktperson"
                />
                {errors.contactName && <p className="mt-1 text-sm text-red-600">{errors.contactName.message}</p>}
            </div>

            <div>
                <FieldDescription>E-post</FieldDescription>
                <Input
                    {...register("email", {
                        required: "E-post må fylles ut",
                        validate: (value) => (value.includes("@") ? true : "E-post må inneholde @"),
                    })}
                    placeholder="E-post"
                />
                {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>}
            </div>

            <div>
                <FieldDescription>Telefonnummer</FieldDescription>
                <Input
                    {...register("phone", {
                        required: "Telefonnr. må fylles ut",
                        pattern: { value: /^\d{8}$/, message: "Nummer må bestå av 8 siffer" },
                    })}
                    placeholder="Telefonnummer"
                />
                {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>}
            </div>

            <div>
                <FieldDescription>Status</FieldDescription>
                <Controller
                    name="status"
                    control={control}
                    render={({ field }) => (
                        <Select value={field.value} onValueChange={field.onChange}>
                            <SelectTrigger className="w-48">
                                <SelectValue placeholder="Velg status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectItem value="OPEN">Åpen</SelectItem>
                                    <SelectItem value="WAITING">Venter</SelectItem>
                                    <SelectItem value="IN_PROGRESS">Pågår</SelectItem>
                                    <SelectItem value="CLOSED">Lukket</SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    )}
                />
            </div>

            <Button disabled={isSubmitting} className="mt-2 w-fit" type="submit">
                {isSubmitting ? "Oppretter..." : "Opprett ticket"}
            </Button>
            {errors.root && <p className="mt-1 text-sm text-red-600">{errors.root.message}</p>}
        </form>
    );
}

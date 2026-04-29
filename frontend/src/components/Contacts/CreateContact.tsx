import { useEffect, useRef, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { FieldDescription } from "@/components/ui/field";
import { Button } from "@/components/ui/button";

type CustomerOption = {
    id: number;
    companyName: string;
};

type FormFields = {
    companyName: string;
    customerId: number | null;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    role: string;
};

type Props = {
    onSuccess?: () => void;
    initialCustomer?: CustomerOption;
};

export function CreateContact({ onSuccess, initialCustomer }: Props) {
    const {
        register,
        watch,
        setValue,
        handleSubmit,
        setError,
        formState: { errors, isSubmitting },
    } = useForm<FormFields>({
        defaultValues: {
            companyName: initialCustomer?.companyName ?? "",
            customerId: initialCustomer?.id ?? null,
            firstName: "",
            lastName: "",
            email: "",
            phone: "",
            role: "",
        },
    });

    const [customers, setCustomers] = useState<CustomerOption[]>([]);
    const customerSearch = watch("companyName");
    const customerId = watch("customerId");
    const lockedCustomer = !!initialCustomer;
    const lastSelectedName = useRef<string | null>(initialCustomer?.companyName ?? null);

    useEffect(() => {
        if (lockedCustomer) return;

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
                if (!response.ok) throw new Error("Failed to fetch customers");
                const data = await response.json();
                setCustomers(data);
            } catch (error) {
                console.error(error);
            }
        }, 300);

        return () => clearTimeout(timeout);
    }, [customerSearch, customerId, lockedCustomer, setValue]);

    const onSubmit: SubmitHandler<FormFields> = async (data) => {
        if (!data.customerId) {
            setError("companyName", { message: "Velg en kunde fra listen" });
            return;
        }
        try {
            const response = await fetch("http://localhost:8080/api/v1/contacts", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    customerId: data.customerId,
                    firstName: data.firstName,
                    lastName: data.lastName,
                    email: data.email,
                    phone: data.phone,
                    role: data.role || null,
                }),
            });
            if (!response.ok) throw new Error("Failed to create contact");
            onSuccess?.();
        } catch {
            setError("root", { message: "Kunne ikke opprette kontakt" });
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
                    <div className="absolute left-0 top-full z-50 mt-1 w-full rounded-md border bg-white shadow-sm">
                        {customers.map((customer) => (
                            <button
                                key={customer.id}
                                type="button"
                                className="block w-full px-3 py-2 text-left text-sm hover:bg-slate-100"
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
                <FieldDescription>Fornavn</FieldDescription>
                <Input
                    {...register("firstName", { required: "Fornavn må fylles ut" })}
                    placeholder="Fornavn"
                />
                {errors.firstName && <p className="mt-1 text-sm text-red-600">{errors.firstName.message}</p>}
            </div>

            <div>
                <FieldDescription>Etternavn</FieldDescription>
                <Input
                    {...register("lastName", { required: "Etternavn må fylles ut" })}
                    placeholder="Etternavn"
                />
                {errors.lastName && <p className="mt-1 text-sm text-red-600">{errors.lastName.message}</p>}
            </div>

            <div>
                <FieldDescription>Rolle / tittel</FieldDescription>
                <Input
                    {...register("role")}
                    placeholder="F.eks. Daglig leder"
                />
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

            <Button disabled={isSubmitting} className="mt-2 w-fit" type="submit">
                {isSubmitting ? "Oppretter..." : "Opprett kontakt"}
            </Button>
            {errors.root && <p className="mt-1 text-sm text-red-600">{errors.root.message}</p>}
        </form>
    );
}

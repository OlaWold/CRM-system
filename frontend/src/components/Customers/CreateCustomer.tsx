import { useForm, SubmitHandler } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { FieldDescription } from "@/components/ui/field";
import { Button } from "@/components/ui/button";

type FormFields = {
    companyName: string;
    orgNumber: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
};

type Props = {
    onSuccess?: () => void;
};

export function CreateCustomer({ onSuccess }: Props) {
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        setError,
    } = useForm<FormFields>({
        defaultValues: {
            companyName: "",
            orgNumber: "",
            firstName: "",
            lastName: "",
            email: "",
            phone: "",
        },
    });

    const onSubmit: SubmitHandler<FormFields> = async (data) => {
        try {
            const response = await fetch("http://localhost:8080/api/v1/customers", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                throw new Error("Kunne ikke lagre kunde.");
            }

            onSuccess?.();
        } catch {
            setError("root", { message: "Feil med et av feltene" });
        }
    };

    return (
        <form className="flex flex-col gap-3 p-4" onSubmit={handleSubmit(onSubmit)}>
            <div>
                <FieldDescription>Bedriftsnavn</FieldDescription>
                <Input
                    {...register("companyName", { required: "Bedriftsnavn må fylles ut" })}
                    placeholder="Bedriftsnavn"
                />
                {errors.companyName && <p className="mt-1 text-sm text-red-600">{errors.companyName.message}</p>}
            </div>

            <div>
                <FieldDescription>Org.nummer</FieldDescription>
                <Input
                    {...register("orgNumber", {
                        required: "Org.nummer må fylles ut",
                        pattern: { value: /^\d{9}$/, message: "Org.nummer må være 9 siffer" },
                    })}
                    placeholder="Org.nummer"
                />
                {errors.orgNumber && <p className="mt-1 text-sm text-red-600">{errors.orgNumber.message}</p>}
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
                {isSubmitting ? "Oppretter..." : "Opprett kunde"}
            </Button>
            {errors.root && <p className="mt-1 text-sm text-red-600">{errors.root.message}</p>}
        </form>
    );
}

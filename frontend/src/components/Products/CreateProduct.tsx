import { useForm, SubmitHandler } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { FieldDescription } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

type FormFields = {
    name: string;
    description: string;
    price: string;
};

type Props = {
    onSuccess?: () => void;
};

export function CreateProduct({ onSuccess }: Props) {
    const {
        register,
        handleSubmit,
        setError,
        formState: { errors, isSubmitting },
    } = useForm<FormFields>({
        defaultValues: { name: "", description: "", price: "" },
    });

    const onSubmit: SubmitHandler<FormFields> = async (data) => {
        try {
            const response = await fetch("http://localhost:8080/api/v1/products", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: data.name,
                    description: data.description || null,
                    price: Number(data.price),
                }),
            });
            if (!response.ok) throw new Error("Failed to create product");
            onSuccess?.();
        } catch {
            setError("root", { message: "Kunne ikke opprette produkt" });
        }
    };

    return (
        <form className="flex flex-col gap-3 p-4" onSubmit={handleSubmit(onSubmit)}>
            <div>
                <FieldDescription>Navn</FieldDescription>
                <Input
                    {...register("name", { required: "Navn må fylles ut" })}
                    placeholder="Produktnavn"
                />
                {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>}
            </div>

            <div>
                <FieldDescription>Beskrivelse</FieldDescription>
                <Textarea {...register("description")} placeholder="Beskrivelse" />
            </div>

            <div>
                <FieldDescription>Pris (NOK)</FieldDescription>
                <Input
                    type="number"
                    step="0.01"
                    min="0"
                    {...register("price", {
                        required: "Pris må fylles ut",
                        validate: (v) => (Number(v) >= 0 ? true : "Pris kan ikke være negativ"),
                    })}
                    placeholder="0.00"
                />
                {errors.price && <p className="mt-1 text-sm text-red-600">{errors.price.message}</p>}
            </div>

            <Button disabled={isSubmitting} className="mt-2 w-fit" type="submit">
                {isSubmitting ? "Oppretter..." : "Opprett produkt"}
            </Button>
            {errors.root && <p className="mt-1 text-sm text-red-600">{errors.root.message}</p>}
        </form>
    );
}

import {useForm, SubmitHandler} from 'react-hook-form'
import {Input} from "@/components/ui/input";
import {FieldDescription} from "@/components/ui/field";
import {Button} from "@/components/ui/button";


type FormFields = {
    companyName: string,
    orgNumber: string,
    firstName: string,
    lastName: string,
    email: string,
    phone: string,
}

export function CreateCustomer() {
    const { register, handleSubmit, formState: { errors, isSubmitting}, setError } = useForm<FormFields>(
        {
            defaultValues: {
                companyName: "",
                orgNumber: "",
                firstName: "",
                lastName: "",
                email: "",
                phone: "",

            }
        });

    const onSubmit: SubmitHandler<FormFields> = async (data)=> {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        try {

            const ticketResponse = await fetch("http://localhost:8080/api/v1/customers", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify(data),
            })

            if (!ticketResponse.ok) {
                throw new Error("Failed to save ticket data.");
            }

            console.log("Ticket Created Successfully");

        } catch (error) {
            setError("root", { message: "Feil med et av feltene"})
        }
    }

    return (
        <>
            <form className="flex flex-col p-4" onSubmit={handleSubmit(onSubmit)}>
                <FieldDescription className="mt-4">Bedriftsnavn:</FieldDescription>
                <Input {...register("companyName",
                    {required: "Bedriftsnavn må fylles ut"
                    })}
                       placeholder="Bedriftsnavn" />
                {errors.companyName && <div className="text-red-500 mt-2 text-sm">{errors.companyName.message}</div>}

                <FieldDescription className="mt-4">Org.nummer:</FieldDescription>
                <Input {...register("orgNumber",
                    {required: "Org.nummer må fylles ut",
                        pattern: {
                            value: /^\d{9}$/,
                            message: "Org.nummer må være 9 siffer"
                        }})}
                       type="text" placeholder="Org.nummer"/>
                {errors.orgNumber && <div className="text-red-500 mt-2 text-sm">{errors.orgNumber.message}</div>}

                <FieldDescription className="mt-4">Fornavn:</FieldDescription>
                <Input {...register("firstName",
                    {required: "Fornavn må fylles ut"
                        })} type="text" placeholder="Fornavn:" />
                {errors.firstName && <div className="text-red-500 mt-2 text-sm">{errors.firstName.message}</div>}

                <FieldDescription className="mt-4">Etternavn:</FieldDescription>
                <Input {...register("lastName",
                    {required: "Etternavn må fylles ut"
                })} placeholder="Etternavn"/>
                {errors.lastName && <div className="text-red-500 mt-2 text-sm">{errors.lastName.message}</div>}

                <FieldDescription className="mt-4">Telefonnummer</FieldDescription>
                <Input {...register("phone",
                    {required: "Telefonnr. må fylles ut",
                    pattern: {
                        value: /^\d{8}$/,
                        message: "Nummer må bestå av 8 siffer"
                    }})} type="text" placeholder="Telefonnummer"/>
                {errors.phone && <div className="text-red-500 mt-2 text-sm">{errors.phone.message}</div>}

                <FieldDescription className="mt-4">E-post:</FieldDescription>
                <Input {...register("email",
                    {required: "E-post må fylles ut",
                    validate: (value) =>
                    {if (!value.includes("@"))
                        return "E-post må inneholde @"}})} type="text" placeholder="E-mail"

                />
                {errors.email && <div className="text-red-500 mt-2 text-sm">{errors.email.message}</div>}

                <Button disabled={isSubmitting} className="w-fit mt-6 cursor-pointer" type="submit">
                    {isSubmitting ? "Oppretter kunde...": "Opprett kunde"}
                </Button>
                { errors.root && <div className="text-red-500 mt-2 text-sm">{errors.root.message}</div> }
            </form>
        </>
    )
}
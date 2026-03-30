import {useForm, SubmitHandler} from 'react-hook-form'
import {Input} from "@/components/ui/input";
import {FieldDescription} from "@/components/ui/field";
import {Button} from "@/components/ui/button";
import {Textarea} from "@/components/ui/textarea";

type FormFields = {
    companyName: string,
    orgNumber: string,
    firstName: string,
    lastName: string,
    email: string,
    phone: string,
}

export function CreateCustomer() {

    const { register, handleSubmit } = useForm<FormFields>(
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
        try {

            const ticketResponse= await fetch("http://localhost:8080/api/v1/customers", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify(data),
            })

            if (!ticketResponse.ok) {
                throw new Error("Failed to save ticket data.");
            }

            console.log("Ticket Created Successfully");

        } catch (error) {
            console.error(error);
        }
    }

    return (
        <>
            <form className="flex flex-col p-4" onSubmit={handleSubmit(onSubmit)}>
                <FieldDescription className="mt-4">Bedriftsnavn:</FieldDescription>
                <Input {...register("companyName")} placeholder="Bedriftsnavn"></Input>

                <FieldDescription className="mt-4">Org.nummer:</FieldDescription>
                <Input {...register("orgNumber")} type="tel" placeholder="Org.nummer"/>

                <FieldDescription className="mt-4">Fornavn:</FieldDescription>
                <Input {...register("firstName")} type="text" placeholder="Fornavn:" />

                <FieldDescription className="mt-4">Etternavn:</FieldDescription>
                <Input {...register("lastName")} placeholder="Etternavn"/>

                <FieldDescription className="mt-4">Telefonnummer</FieldDescription>
                <Input {...register("phone")} type="text" placeholder="Telefonnummer"/>

                <FieldDescription className="mt-4">E-post:</FieldDescription>
                <Input {...register("email")} type="email" placeholder="E-mail"/>

                <Button className="w-fit mt-6 cursor-pointer" type="submit">Opprett kunde</Button>
            </form>
        </>
    )
}
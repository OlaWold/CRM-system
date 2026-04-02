    import {useForm, SubmitHandler, Controller} from 'react-hook-form'
    import {Input} from "@/components/ui/input";
    import {FieldDescription} from "@/components/ui/field";
    import {Button} from "@/components/ui/button";
    import {Textarea} from "@/components/ui/textarea";
    import {useEffect, useState} from "react";
    import {Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";

    type Customer = {
        id: number;
        customerNo: number;
        companyName: string;
    }

    type FormFields = {
        companyName: string,
        customerId: number | null,
        subject: string,
        description: string,
        contactName: string,
        email: string,
        phone: string,
        status: string
    }

    export function CreateTickets() {

        const { register, control, watch, setValue, handleSubmit, setError, formState: { errors, isSubmitting } } = useForm<FormFields>(
            {
                defaultValues: {
                    companyName: "",
                    customerId: null,
                    subject: "",
                    description: "",
                    contactName: "",
                    email: "",
                    phone: "",
                    status: "OPEN"
                }
            });
        const [customers, setCustomers] = useState<Customer[]>([]);
        const customerSearch = watch("companyName");

        useEffect(() => {
            const q = customerSearch;

            if (!q) {
                setCustomers([])
                setValue("customerId", null);
                return;
            }
            const timeout = setTimeout(async () => {
            try {
                const response =
                    await fetch(`http://localhost:8080/api/v1/customers/search?q=${encodeURIComponent(q)}`);

                if (!response.ok) {
                    throw new Error("Failed to fetch customers.");
                }

                const data = await response.json();
                setCustomers(data)
            } catch (error) {
                setError("root", { message: "Feil med et av feltene"})
            }
        },300)
            return () => clearTimeout(timeout);
        }, [customerSearch, setValue, setError]);

        const onSubmit: SubmitHandler<FormFields> = async (data)=> {
            await new Promise((resolve) => setTimeout(resolve, 1000));
            try {

                const ticketResponse= await fetch("http://localhost:8080/api/v1/tickets", {
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
                <FieldDescription className="mt-4">Kundenavn eller kundenr.</FieldDescription>
                <div className="relative">
                <Input {...register("companyName",
                    {required: "Bedriftsnavn må fylles ut"
                })} type="text" placeholder="Kundenavn eller kundenr." />

                    {customers.length > 0 && (
                        <div className="relative top-full left-0 mt-2 w-full rounded-xl border bg-white shadow z-50">
                            {customers.map((customer) => (
                                <button
                                    key={customer.id}
                                    type="button"
                                    className="block w-full text-left px-3 py-2 hover:bg-slate-100"
                                      onClick={() => {
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
                    {errors.companyName && <div className="text-red-500 mt-2 text-sm">{errors.companyName.message}</div>}
                </div>
                <FieldDescription className="mt-4">Emne:</FieldDescription>
                <Input {...register("subject",
                    {required: "Emne må fylles ut"
                    })}
                 type="text" placeholder="Emne" />
                {errors.subject && <div className="text-red-500 mt-2 text-sm">{errors.subject.message}</div>}

                <FieldDescription className="mt-4">Beskrivelse:</FieldDescription>
                <Textarea {...register("description",
                    {required: "Beskrivelse må fylles ut"
                    })} placeholder="Beskrivelse"/>
                {errors.description && <div className="text-red-500 mt-2 text-sm">{errors.description.message}</div>}


                <FieldDescription className="mt-4">Kontaktperson:</FieldDescription>
                <Input {...register("contactName",
                    {required: "Kontaktperson må fylles ut"
                    })} type="text" placeholder="Kontaktperson"/>
                {errors.contactName && <div className="text-red-500 mt-2 text-sm">{errors.contactName.message}</div>}

                <FieldDescription className="mt-4">E-post:</FieldDescription>
                <Input {...register("email",
                    {required: "E-post må fylles ut",
                        validate: (value) =>
                        {if (!value.includes("@"))
                            return "E-post må inneholde @"}})} type="text" placeholder="E-mail"

                />
                {errors.email && <div className="text-red-500 mt-2 text-sm">{errors.email.message}</div>}

                <FieldDescription className="mt-4">Telefonnummer</FieldDescription>
                <Input {...register("phone",
                    {required: "Telefonnr. må fylles ut",
                        pattern: {
                            value: /^\d{8}$/,
                            message: "Nummer må bestå av 8 siffer"
                        }})} type="text" placeholder="Telefonnummer"/>
                {errors.phone && <div className="text-red-500 mt-2 text-sm">{errors.phone.message}</div>}

                <FieldDescription className="mt-4">Status:</FieldDescription>
                <Controller
                    name="status"
                    control={control}
                    render={({ field }) => (
                        <Select  value={field.value} onValueChange={field.onChange}>
                            <SelectTrigger className="w-full max-w-48 cursor-pointer">
                                <SelectValue placeholder="Velg status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup className="cursor-pointer">
                                    <SelectItem className="cursor-pointer"  value="OPEN">Åpen</SelectItem>
                                    <SelectItem className="cursor-pointer"  value="WAITING">Venter</SelectItem>
                                    <SelectItem className="cursor-pointer"  value="IN_PROGRESS">Pågår</SelectItem>
                                    <SelectItem className="cursor-pointer"  value="CLOSED">Lukket</SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    )}
                />
                <Button disabled={isSubmitting} className="w-fit mt-6 cursor-pointer" type="submit">{isSubmitting ? "Oppretter kunde...": "Opprett kunde"}</Button>
            </form>
        </>
    )
}
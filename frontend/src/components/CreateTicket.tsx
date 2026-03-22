import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea"
import {Field, FieldDescription} from "@/components/ui/field";
import * as React from "react";

interface CreateTicketsProps {
    showForm: boolean
}

export function CreateTickets({showForm}: CreateTicketsProps) {
    if (!showForm) return null;

    const createTickets = async (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();

        const formEl = e.currentTarget;
        const form = new FormData(formEl)

        try {
            const data = {
                description: String(form.get("description") ?? ""),
                subject: String(form.get("subject") ?? ""),
                contactName: String(form.get("contactName") ?? ""),
                companyName: String(form.get("companyName") ?? ""),
                email: String(form.get("email") ?? ""),
                phone: String(form.get("phone") ?? ""),
                status: (form.get("status") ?? "OPEN")
            };

            const response = await fetch("http://localhost:8080/api/v1/tickets", {
                method: "POST",
                headers: {
                    "Content-type": "application/json",
                },
                body: JSON.stringify(data)

            });
            if (!response.ok) {
                throw new Error(await response.text());
            }

            formEl.reset();
        } catch (error) {
            console.error(error)
        }
    }

    return (
        <form className="bg-white w-fit p-6 mt-5 rounded-2xl" onSubmit={createTickets}>
            <Field className="mt-10 w-100">
                <FieldDescription>Firmanavn</FieldDescription>
                <Input name="companyName"/>

                <FieldDescription>Kontaktperson</FieldDescription>
                <Input name="contactName"/>

                <FieldDescription>Emne</FieldDescription>
                <Input name="subject"/>

                <FieldDescription>Beskrivelse</FieldDescription>
                <Textarea name="description"> </Textarea>

                <FieldDescription>E-post</FieldDescription>
                <Input name="email"/>

                <FieldDescription>Telefon</FieldDescription>
                <Input name="phone"/>

                <FieldDescription>Status</FieldDescription>
                <select name="status"
                        className="h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                    <option value="">Velg status</option>
                    <option value="OPEN">Aktiv</option>
                    <option value="IN_PROGRESS">Pågår</option>
                    <option value="WAITING">Venter på oss</option>
                    <option value="CLOSED">Lukket</option>
                </select>

                <Button type="submit">Submit</Button>
            </Field>
        </form>

    );

}
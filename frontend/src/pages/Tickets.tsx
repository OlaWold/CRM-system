import {Button} from "@/components/ui/button";
import {CreateTickets} from "@/components/Tickets/CreateTicket";
import {useState} from "react";
import {GetTickets} from "@/components/Tickets/GetTickets";

export default function Tickets() {


    return (
        <>
            <div className="">
                <div className="mb-6">
                    <h1 className="text-2xl font-bold">Ticketliste</h1>
                    <p>Oversikt over Tickets:</p>
                </div>

            </div>
            <div className="">
                <GetTickets />
            </div>

        </>
    )
}
import {useState} from "react";
import {Button} from "@/components/ui/button";
import {useNavigate} from "react-router-dom";


export default function CountCustomers() {

    const [customers, setNumCustomers] = useState<number[]>([]);

    const navigate = useNavigate();

    async function fetchCustomers() {
        try {
            const response = await fetch("http://localhost:8080/api/v1/customers/count");

            if (!response.ok) {
                throw Error("Could not fetch tickets from server");
            }

            const data = await response.json();
            setNumCustomers(data);
        } catch (error) {
            console.error(error);
        }
    } fetchCustomers();

    return (
        <>
            <div className="flex flex-col p-4 w-fit">

                <div className="flex flex-col border bg-white rounded-4xl h-fit w-fit gap-4 px-10 py-4 shadow-md border-gray-200 text-lg items-center justify-center">
                    <div className="flex flex-col">
                        <p>Totalt antall</p>
                        <p>kunder:</p>
                    </div>
                    <p className="text-xl">{customers}</p>
                </div>
                <Button className="w-fit mt-6 cursor-pointer" onClick={() => navigate("/customers")}>Gå til kunder</Button>
            </div>
        </>
    )
}
import { useState} from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    onCustomerAdded: () => void;
}

export default function AddCustomer({ isOpen, onClose, onCustomerAdded }: ModalProps) {

    const [formData, setFormData] = useState({
        companyName: '',
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
    });

    if (!isOpen) return null;


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const response = await fetch('http://localhost:8080/api/v1/customers', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                // 3. RETTELSE: Endret fra {formDaa} til formData
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                onCustomerAdded();
                onClose();
            } else {
                // Her fanger vi opp feilmeldinger for eksmple kundenummer under 1000
                const errorData = await response.json();
                alert("Feil: " + (errorData.message || "Kunne ikke lagre kunde"));
            }
        } catch (error) {
            error("Kunne ikke kontakte serveren. Sjekk at Spring Boot kjører.");
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md border border-slate-200">
                <h2 className="text-xl font-bold mb-4">Legg til ny kunde</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="col-span-2">
                            <Label className="block text-xs font-semibold mb-1">Bedriftsnavn</Label>
                            <Input
                                name="companyName"
                                value={formData.companyName}
                                onChange={e => setFormData({...formData, companyName: e.target.value})}
                                className="w-full border rounded-lg p-2 text-sm focus:ring-2 outline-none"
                            />
                        </div>
                        <div>
                            <Label className="block text-xs font-semibold mb-1">Fornavn</Label>
                            <Input
                                required
                                name="firstName"
                                value={formData.firstName}
                                onChange={e => setFormData({...formData, firstName: e.target.value})}
                                className="w-full border rounded-lg p-2 text-sm focus:ring-2  outline-none"
                            />
                        </div>
                        <div>
                            <Label className="block text-xs font-semibold  mb-1">Etternavn</Label>
                            <Input
                                required
                                name="lastName"
                                value={formData.lastName}
                                onChange={e => setFormData({...formData, lastName: e.target.value})}
                                className="w-full border rounded-lg p-2 text-sm focus:ring-2  outline-none"
                            />
                        </div>
                        <div className="col-span-2">
                            <Label className="block text-xs font-semibold mb-1">E-post</Label>
                            <Input
                                required
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={e => setFormData({...formData, email: e.target.value})}
                                className="w-full border rounded-lg p-2 text-sm focus:ring-2  outline-none"
                            />
                        </div>
                        <div className="col-span-2">
                            <Label className="block text-xs font-semibold mb-1">Telefon</Label>
                            <Input
                                name="phone"
                                value={formData.phone}
                                onChange={e => setFormData({...formData, phone: e.target.value})}
                                className="w-full border rounded-lg p-2 text-sm focus:ring-2 outline-none"
                            />
                        </div>
                    </div>
                    <div className="flex justify-end gap-3 pt-4">
                        <Button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium  rounded-lg transition">Avbryt</Button>
                        <Button type="submit" className="px-4 py-2 text-sm font-medium text-white  rounded-lg transition">Lagre kunde</Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
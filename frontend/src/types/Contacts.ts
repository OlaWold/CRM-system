export type Contact = {
    id: number;
    contactNo: number;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    role: string | null;
    customer?: {
        id: number;
        customerNo: number;
        companyName: string;
    };
    created?: string;
};

export type Product = {
    id: number;
    productNo: number;
    name: string;
    description: string | null;
    price: number;
    created?: string;
};

export type CustomerProduct = {
    id: number;
    product: Product;
    addedAt: string;
};

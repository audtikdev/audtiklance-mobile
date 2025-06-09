export type ListingBody = {
    id?: string;
    title: string;
    description: string;
    categoryId: string;
    deadline: string;
    location: {
        coordinates: [number, number];
        type: string;
    };
    address: string;
    budget: string;
    isPublished: boolean;
}
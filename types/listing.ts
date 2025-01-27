export type ListingBody = {
    id?: string;
    images: Array<string>;
    category: string;
    preferred_date: string;
    longitude: string;
    latitude: string;
    title: string;
    budget: string;
    description: string;
    address: string;
    is_paid?: boolean,
    status?: string
}
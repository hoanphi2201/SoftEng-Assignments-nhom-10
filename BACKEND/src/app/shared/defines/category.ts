export interface ICategory {
    _id?: string;
    name: string;
    status: string;
    ordering: number;
    content: string;
    slug: string;
    created?: {
        user_id: string,
        user_name: string,
        time: any
    };
    modified?: {
        user_id: string,
        user_name: string,
        time: any
    };
    selected?: boolean;
}
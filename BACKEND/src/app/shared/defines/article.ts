export interface IArticle {
    _id?: string;
    name: string;
    status: string;
    special: string;
    slug: string;
    ordering: number;
    content: string;
    thumb: string;
    category: {
        id: string,
        name: string
    };
    email: string;
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
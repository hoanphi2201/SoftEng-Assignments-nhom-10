export interface IGroup {
    _id?: string;
    name: string;
    status: string;
    ordering: number;
    content: string;
    group_acp: string;
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
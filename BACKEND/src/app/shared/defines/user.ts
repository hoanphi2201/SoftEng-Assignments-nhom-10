export interface IUser {
    _id?: string;
    name: string;
    status: string;
    ordering: number;
    content: string;
    avatar: string;
    group: {
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
    phonenumber?: string;
    school?: string;
    facebook_link?: string;
    local?: {
        username: string,
        password: string,
    };
    selected?: boolean;
}
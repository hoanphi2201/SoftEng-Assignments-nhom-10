export interface IExam {
    _id?: string;
    name: string;
    status: string;
    special: string;
    ordering: number;
    content: string;
    thumb: string;
    exam_pdf: string;
    slug: string;
    level: string;
    rates: number;
    price: number;
    onlineExam: string;
    isOnlineExam?: boolean;
    timeStart: Date;
    answers: any[];
    time: number;
    subject: {
        id: string,
        name: string
    };
    number_questions: number;
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
export interface ImageProps {
    _id?: string;
    url?: string;
    fitUrl?: string;
    createdAt?: string;
}

export interface UserProps {
    isLogin: boolean;
    nickName?: string;
    _id?: string;
    column?: string;
    email?: string;
    description?: string;
    avatar?: ImageProps;
}

export interface PostProps {
    _id?: string;
    title: string;
    excerpt?: string;
    content?: string;
    image?: ImageProps | string;
    column: string;
    author?: string;
    createdAt?: string;
    isHTML?: boolean;
}

export interface ColumnProps {
    _id: string;
    title: string;
    avatar?: ImageProps;
    description: string;
}

export type MessageType = 'success' | 'error' | 'default';

export interface ResponseType<P> {
    code: number;
    msg: string;
    data: P;
}

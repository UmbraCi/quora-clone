export interface ImageProps {
    _id?: string;
    url?: string;
    createdAt?: string;
}

export interface UserProps {
    isLogin: boolean;
    name?: string;
    id?: string;
    columnId?: string;
}

export interface PostProps {
    _id: string;
    title: string;
    excerpt?: string;
    content?: string;
    image?: ImageProps;
    column: string;
    createdAt: string;
}

export interface ColumnProps {
    _id: string;
    title: string;
    avatar?: ImageProps;
    description: string;
}

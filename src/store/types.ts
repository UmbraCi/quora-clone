export interface PostProps {
    _id?: string;
    title: string;
    excerpt?: string;
    content?: string;
    image?: string;
    column: string;
    author?: string;
    createdAt?: string;
    isHTML?: boolean;
}

export interface ColumProps {
    id: number;
    title: string;
    avatar?: string;
    description: string;
}

export interface UserProps {
    isLogin: boolean;
    name?: string;
    id?: number | string;
    columnId?: number;
}

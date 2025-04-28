export interface User {
    id: string;
    name: string;
    email: string;
    imageUrl: string;
    creatorUserId: string;
    createdAt: Date;
    updatedAt: Date;
}

export type Users = User[]; 
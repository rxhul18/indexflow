
export type UserType = {
    id: string;
    name: string;
    email: string;
    role?: string;
    emailVerified: boolean;
    createdAt: Date | string;
    updatedAt: Date | string;
    image?: string | null;
};


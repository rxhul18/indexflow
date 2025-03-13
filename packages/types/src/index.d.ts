
export type UserType = {
    id: string;
    name: string;
    email: string;
    role?: string | null;
    location?: string | null;
    active?: Date | null;
    reputation?: string | null;
    recentTags?: string[] | null;
    emailVerified: boolean;
    createdAt: Date | string;
    updatedAt: Date | string;
    image?: string | null;
};

export type UserPubType = {
    id: string;
    name: string;
    image: string | null;
    location: string | null;
    active: Date | null;
    reputation: string | null;
    recentTags: string[] | null;
    createdAt: Date | string;
    updatedAt: Date | string;
};
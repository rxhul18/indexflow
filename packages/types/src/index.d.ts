
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

export type ServerType = {
    id: string;
    name: string;
    owner_id: string;
    is_config?: boolean;
    config_id?: string | null;
    logo?: string | null;
    invite_url: string | null;
    createdAt: Date | string;
    updatedAt: Date | string;
};

export type ConfigType = {
    id: string;
    server_id: string;
    server?: ServerType;
    qna_channel: string | null;
    qna_channel_webhook: string | null;
    qna_endpoint?: string | null;
    mod_role?: string | null;
    log_channel?: string | null;
    log_channel_webhook?: string | null;
    system_channel?: string | null;
  system_channel_webhook?: string | null;
    createdAt: Date | string;
    updatedAt: Date | string;
};

export type TagType = {
    id: string;
    name: string;
    owner_id?: string;
    usedAt?: Date | null;
    posts?: string[];
    usages?: number;
    createdAt: Date | string;
    updatedAt: Date | string;
};

export type IndexQnsType = {
    id: string;
    title: string;
    ans_id?: string | null;
    author: string;
    content: string;
    tldr?: string | null;
    is_anon?: boolean;
    is_nsfw?: boolean;
    server_id: string;
    thread_id: string;
    thread_mems?: string[];
    msg_url: string;
    createdAt: Date | string;
    updatedAt: Date | string;
};

export type IndexAnsType = {
    id: string;
    author: string;
    content: string;
    tldr?: string | null;
    is_anon?: boolean;
    is_nsfw?: boolean;
    is_correct?: boolean;
    qns_id: string;
    server_id: string;
    thread_id: string;
    msg_url: string;
    createdAt: Date | string;
    updatedAt: Date | string;
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
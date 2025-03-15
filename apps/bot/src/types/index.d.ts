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

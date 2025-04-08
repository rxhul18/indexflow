import { TagType, UserType, ServerType, ApiQuestionType } from "@iflow/types";
import { create } from "zustand";
import { persist } from "zustand/middleware";

type TagStore = {
  tags: TagType[];
  addTag: (tag: TagType) => void;
  removeTag: (tagId: string) => void;
  setTags: (tags: TagType[]) => void;
};

type UserStore = {
  users: UserType[];
  addUser: (user: UserType) => void;
  removeUser: (userId: string) => void;
  setUsers: (users: UserType[]) => void;
};

type ServerStore = {
  servers: ServerType[];
  addServer: (server: ServerType) => void;
  removeServer: (serverId: string) => void;
  setServers: (servers: ServerType[]) => void;
};

type QuestionStore = {
  questions: ApiQuestionType[];
  addQuestion: (question: ApiQuestionType) => void;
  removeQuestion: (questionId: string) => void;
  setQuestions: (questions: ApiQuestionType[]) => void;
}

const useTagsStore = create<TagStore>()(
  persist(
    (set) => ({
      tags: [],
      addTag: (tag) => set((state) => ({ tags: [...state.tags, tag] })),
      removeTag: (tagId) =>
        set((state) => ({ tags: state.tags.filter((t) => t.id !== tagId) })),
      setTags: (tags) => set({ tags }),
    }),
    {
      name: "tags-storage",
    },
  ),
);

const useUsersStore = create<UserStore>()(
  persist(
    (set) => ({
      users: [],
      addUser: (user) => set((state) => ({ users: [...state.users, user] })),
      removeUser: (userId) =>
        set((state) => ({ users: state.users.filter((u) => u.id !== userId) })),
      setUsers: (users) => set({ users }),
    }),
    {
      name: "users-storage",
    },
  ),
);

const useServersStore = create<ServerStore>()(
  persist(
    (set) => ({
      servers: [],
      addServer: (server) =>
        set((state) => ({ servers: [...state.servers, server] })),
      removeServer: (serverId) =>
        set((state) => ({
          servers: state.servers.filter((s) => s.id !== serverId),
        })),
      setServers: (servers) => set({ servers }),
    }),
    {
      name: "servers-storage",
    },
  ),
);


const useQuestionsStore = create<QuestionStore>()(
  persist(
    (set) => ({
      questions: [],
      addQuestion: (question) =>
        set((state) => ({ questions: [...state.questions, question] })),
      removeQuestion: (questionId) =>
        set((state) => ({
          questions: state.questions.filter((q) => q.id !== questionId),
        })),
      setQuestions: (questions) => set({ questions }),
    }),
    {
      name: "questions-storage",
    },
  )
)

export { useTagsStore, useUsersStore, useServersStore, useQuestionsStore };

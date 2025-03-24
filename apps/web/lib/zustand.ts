import { create } from 'zustand'

type TagStore = {
  tags: string[]
  addTag: (tag: string) => void
  removeTag: (tag: string) => void
  setTags: (tags: string[]) => void
}

type UserStore = {
  users: string[]
  addUser: (user: string) => void
  removeUser: (user: string) => void
  setUsers: (users: string[]) => void
}
const useTagsStore = create<TagStore>((set) => ({
  tags: [],
  addTag: (tag) =>
    set((state) => ({ tags: [...state.tags, tag] })),
  removeTag: (tag) =>
    set((state) => ({ tags: state.tags.filter((t) => t !== tag) })),
  setTags: (tags) => set({ tags }),
}))

const useUsersStore  = create<UserStore>((set) => ({
    users: [],
    addUser: (user) =>
      set((state) => ({ users: [...state.users, user] })),
    removeUser: (user) =>
      set((state) => ({ users: state.users.filter((t) => t !== user) })),
    setUsers: (users) => set({ users }),
  }))

export {useTagsStore, useUsersStore};
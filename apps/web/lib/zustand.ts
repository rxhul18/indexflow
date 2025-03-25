import { TagType, UserType } from '@iflow/types'
import { create } from 'zustand'
import { persist } from "zustand/middleware";

type TagStore = {
  tags: TagType[]
  addTag: (tag: TagType) => void
  removeTag: (tagId: string) => void
  setTags: (tags: TagType[]) => void
}

type UserStore = {
  users: UserType[]
  addUser: (user: UserType) => void
  removeUser: (userId: string) => void
  setUsers: (users: UserType[]) => void
}

const useTagsStore = create<TagStore>()(
  persist((set)=>({
    tags: [],
    addTag: (tag)=> set((state)=>({tags:[...state.tags, tag]})),
    removeTag: (tagId) => set((state)=>({tags:state.tags.filter((t)=> t.id !== tagId)})),
    setTags: (tags) => set({tags})
  }),
  {
    name: 'tags-storage'
  }
  )
)

const useUsersStore = create<UserStore>()(
  persist((set)=>({
    users: [],
    addUser: (user)=> set((state)=>({users: [...state.users, user]})),
    removeUser: (userId) => set((state)=>({users: state.users.filter((u)=> u.id !== userId)})),
    setUsers: (users) => set({users})
  }),
  {
    name: 'users-storage'
  }
  )
)

export { useTagsStore, useUsersStore }
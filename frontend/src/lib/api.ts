import { hc } from 'hono/client'
import { type ApiRoutes } from '@server/app'
import { queryOptions } from '@tanstack/react-query'
import { type createItem } from '@server/sharedTypes'

const client = hc<ApiRoutes>('/')

export const api = client.api

async function getCurrentUser() {
    const res = await api.me.$get()
    if (!res.ok) {
      throw new Error('Network response was not ok')
    }
    const data = res.json()
    return data
  }

export const userQueryOptions = queryOptions({ 
    queryKey: ['get-current-user'], 
    queryFn: getCurrentUser,
    staleTime: Infinity
})

export async function getAllItems() {
  const res = await api.wardrobe.$get()
  if (!res.ok) {
    throw new Error('Network response was not ok')
  }
  const data = res.json()
  return data
}

export const getAllItemsQueryOptions = queryOptions({
    queryKey: ['get-all-items'],
    queryFn: getAllItems,
    staleTime: 1000 * 60 * 5,
})

export async function createItem({ value} : { value: createItem }) {
  const res = await api.wardrobe.$post({ json: value })
  if (!res.ok) {
    throw new Error('Network response was not ok')
  }
  
  const newItem = await res.json()
  return newItem
}

export const loadingCreateItemQueryOptions = queryOptions<{item?: createItem;}>({
    queryKey: ['loading-create-item'],
    queryFn: async () => {
      return {};
    },
    staleTime: Infinity,
})

export async function deleteItem({ id }: { id: number }) {
  const res = await api.wardrobe[':id{[0-9]+}'].$delete({param: {id : id.toString()}})
  if (!res.ok) {
    throw new Error('Network response was not ok')
  }
  return
}
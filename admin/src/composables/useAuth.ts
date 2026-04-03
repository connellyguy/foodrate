import type { User } from '@supabase/supabase-js'

import { computed, ref } from 'vue'

import { supabase } from '@/lib/supabase'

type Role = 'user' | 'admin' | null

const user = ref<User | null>(null)
const isLoading = ref(true)
const role = ref<Role>(null)

const isAdmin = computed(() => role.value === 'admin')

let readyResolve: () => void
const ready = new Promise<void>((resolve) => {
  readyResolve = resolve
})

async function fetchRole(userId: string): Promise<Role> {
  const { data, error } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', userId)
    .single()
  if (error) {
    console.error('Failed to fetch profile role:', error.message)
    return null
  }
  return (data?.role as Role) ?? null
}

async function login(email: string, password: string): Promise<{ error: string | null }> {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password })

  if (error) {
    return { error: error.message }
  }

  user.value = data.user
  role.value = await fetchRole(data.user.id)

  if (!isAdmin.value) {
    await supabase.auth.signOut()
    user.value = null
    role.value = null
    return { error: 'Not authorized. Admin access required.' }
  }

  return { error: null }
}

async function logout(): Promise<void> {
  await supabase.auth.signOut()
  user.value = null
  role.value = null
}

async function init(): Promise<void> {
  isLoading.value = true

  const { data: { session } } = await supabase.auth.getSession()

  if (session?.user) {
    user.value = session.user
    role.value = await fetchRole(session.user.id)

    if (!isAdmin.value) {
      await supabase.auth.signOut()
      user.value = null
      role.value = null
    }
  }

  isLoading.value = false
  readyResolve()

  supabase.auth.onAuthStateChange(async (_event, session) => {
    if (session?.user) {
      user.value = session.user
      role.value = await fetchRole(session.user.id)
    } else {
      user.value = null
      role.value = null
    }
  })
}

export function useAuth() {
  return {
    user,
    isAdmin,
    isLoading,
    ready,
    login,
    logout,
    init,
  }
}

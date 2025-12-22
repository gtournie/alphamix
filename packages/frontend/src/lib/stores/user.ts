import api from '$lib/api';
import { writable, derived } from 'svelte/store';

export const user = writable<{ name: string; email: string } | null>(null);
export const hasFetched = writable(false);

export async function fetchUser() {
  try {
    const data = await api.getSession();
    user.set(data?.user || null);
  } catch (err) {
    user.set(null);
  } finally {
    hasFetched.set(true);
  }
}

export const isAuthenticated = derived(
  [user, hasFetched],
  ([$user, $hasFetched]) => $hasFetched ? !!$user : null
);



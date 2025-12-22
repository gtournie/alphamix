import { goto } from '$app/navigation';
import config from './config';

const request = async (url: string, options: Record<string, any> = {}): Promise<any> => {
  options = {
    ...options,
    headers: {
      'Content-type': 'application/json; charset=UTF-8',
      ...(options.headers || {})
    },
    // mode: "no-cors",
    credentials: 'include',
  };
  if (options.data && typeof options.data !== "string") {
    options.body = JSON.stringify(options.data);
    delete options.data;
  }
  try {
    const response = await fetch(config.SERVER_URL + url, options);
    if (!response.ok) throw response;
    return await response.json();
  } catch (e) {
    if (e.status === 401) return // logout(); // TODO
  }
}

const api = {
  getSession: async () => {
    return await request('/api/auth/session');
  },
  getCsrf: async () => {
    return await request('/api/auth/csrf');
  },
  getFriends: async () => {
    return await request('/api/users/friends');
  },
  createGame: async (userIds: string[]) => {
    return await request('/api/games', {
      method: 'POST',
      data: { userIds }
    }) || {};
  },
  getGameData: async (gameId: string) => {
    return await request(`/api/games/${gameId}`);
  },
  playTurn: async (gameId: string, entry: string) => {
    return await request(`/api/games/play/${gameId}`, {
      method: 'POST',
      data: { entry }
    }) || {};
  }
}

export default api;
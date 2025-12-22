import { createAuthClient } from "better-auth/svelte"

export const authClient = createAuthClient({
    /** The base URL of the server (optional if you're using the same domain) */
    // baseURL: "http://localhost:3049"
})

// export const { signIn, signUp, useSession } = authClient
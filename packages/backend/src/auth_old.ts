import { Elysia, error, Context, redirect } from 'elysia';
import jwt from 'jsonwebtoken';
import db from './infrastructure/database';
import { oauth2 } from "elysia-oauth2";
import { Player } from '@prisma/client';
import { HOME_PATH } from '.';


// TODO: https://stackoverflow.com/questions/77144353/infer-types-for-handlers-in-separate-files-for-elysiajs
// Then jump to "Consider the following". Try to use same thing to describe models and/or DTO


interface OAuth2Context extends Context {
  oauth2: {
    /**
     * Creates a URL for OAuth2 authentication.
     * @param provider - The OAuth2 provider (e.g., "Google").
     * @param scopes - The scopes to request.
     * @returns {URL} The generated URL.
     */
    createURL: <Provider extends "Google">(provider: Provider, scopes: string[]) => URL;
    /**
     * Authorizes the user with the specified provider.
     * @param provider - The OAuth2 provider (e.g., "Google").
     * @returns {Promise<{ accessToken: () => string }>} The authorization tokens.
     */
    authorize: (provider: string) => Promise<{ accessToken: () => string }>;
  };
  // /**
  //  * Sets a cookie in the response.
  //  * @param name - The name of the cookie.
  //  * @param value - The value of the cookie.
  //  * @param options - Additional options for the cookie.
  //  */
  // setCookie: (name: string, value: string, options?: {
  //   httpOnly?: boolean;
  //   secure?: boolean;
  //   sameSite?: 'Strict' | 'Lax' | 'None';
  //   path?: string;
  //   maxAge?: number;
  // }) => void;
}

// Create a generic method which returns either a secret key or throws an error
function getSecret(key: string): string {
  const secret = process.env[key];
  if (!secret) throw new Error(`${key} is not defined in the environment variables`);
  return secret;
}

/**
 * Generates a signed JWT.
 * @param payload - The data to include in the token.
 * @param expiresIn - Token expiration duration (e.g., '1h').
 * @returns {string} The signed token.
 */
const generateJWT = (payload: object, expiresIn: string = '7d'): string => {
  const secret: string = getSecret('JWT_SECRET'); // Ensure the secret is a string
  return jwt.sign(payload, secret, { expiresIn } as jwt.SignOptions); // Explicitly cast options
};

/**
 * Verifies and decodes a JWT.
 * @param token - The token to verify.
 * @returns {object | null} The decoded data or null if invalid.
 */
const verifyJWT = (token: string): object | null => {
  try {
    const secret: string = getSecret('JWT_SECRET'); // Ensure the secret is a string
    return jwt.verify(token, secret) as Record<string, unknown>; // Explicitly cast the result
  } catch (err) {
    console.error('Invalid JWT:', err);
    return null;
  }
};

/**
 * Sets a secure HTTP-only cookie with the JWT using Elysia's native cookie handling.
 * @param context - The request context.
 * @param jwtToken - The JWT to store in the cookie.
 */
const setJwtCookie = (context: OAuth2Context, jwtToken: string): void => {
  context.cookie.auth_token.set({
    value: jwtToken,
    httpOnly: true,
    secure: true,
    sameSite: 'strict',
    path: '/',
    maxAge: 60 * 60 * 24 * 30, // 30 days
  });
};

/**
 * Middleware to protect routes with JWT stored in a cookie.
 * Redirects to /login if the user is not authenticated.
 * @param context - The request context.
 */
export const jwtMiddleware = (context: Context) => {
  const token = context.cookie.auth_token?.value; // Access the JWT from the cookie
  if (token && verifyJWT(token)) return; // If token is valid, continue
  context.cookie.callbackUrl.set({
    value: context.request.url,
    httpOnly: true,
    secure: true,
    sameSite: 'strict',
    path: '/',
  }); // Store the current URL for redirection
  return redirect('/login'); 
};

/**
 * Fetches the Google user's profile information using the access token.
 * @param accessToken - The access token obtained from Google OAuth2.
 * @returns {Promise<object>} The user's profile information.
 */
interface GoogleUser {
  id: string,
  email: string,
  verified_email?: boolean,
  name?: string,
  given_name?: string,
  family_name?: string,
  picture?: string;
}
const fetchGoogleUserProfile = async (accessToken: string): Promise<GoogleUser> => {
  const response = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch Google user profile: ${response.statusText}`);
  }

  return response.json();
};

 export default new Elysia<OAuth2Context & string>({ name: "auth" })
  .use(
    oauth2({
      Google: [
        getSecret("GOOGLE_CLIENT_ID"),
        getSecret("GOOGLE_CLIENT_SECRET"),
        "http://localhost:3049/auth/google/callback",
      ],
    })
  )
  // .get("/auth/google", async ({ oauth2, redirect }: OAuth2Context) => {
  //   const url = oauth2.createURL("Google", ["email", "profile"]); // Add the necessary scopes
  //   return redirect(url.href);
  // })
  .get('/login', async ({ oauth2, redirect, set }: OAuth2Context) => {
    set.headers['Content-Type'] = 'application/json';
    const url = oauth2.createURL("Google", ["email", "profile"]); // Add necessary scopes 
    return { url }; // Redirect to Google OAuth2 login
  })
  .get("/auth/google/callback", async (context: OAuth2Context) => {
    const { oauth2 } = context;
    const tokens = await oauth2.authorize("Google");
    const accessToken = tokens.accessToken();

    // Fetch the user's profile information
    const userProfile = await fetchGoogleUserProfile(accessToken);
    let player = await db.player.findUnique({ where: { email: userProfile.email } });
    if (!player) {
      // Try to find a unique name
      let userName: string | null = userProfile.given_name?.trim() || userProfile.name?.trim() || ('Player' + (await db.player.count()));
      userName = await db.player.getUniquePlayerName(userName);
      if (!userName) return error(400, 'INVALID_USERNAME');

      player = await db.player.create({
        data: { name: userName, email: userProfile.email },
      });
    }
    
    // Generate a JWT for the user
    const jwtToken = generateJWT({ accessToken, player });
    // Set the JWT in a secure HTTP-only cookie using Elysia's native cookie handling
    setJwtCookie(context, jwtToken);
    // Redirect to the original URL or home path
    const redirectTo = context.cookie.callbackUrl?.value || HOME_PATH;
    context.cookie.callbackUrl?.remove(); // Clear the callback URL cookie
    return redirect(redirectTo);
  })
  .derive({ as: "global" }, ({ cookie }) => {
    const auth = cookie.auth_token?.value;
    const jwt = auth && verifyJWT(auth);
    if (!jwt) return { player: { id: 0n, name: '' } } // Should never happen

    // Pick only id & name
    let { id, name } = (jwt as { player: Player }).player
    return { player: { id, name } }
  })
  // .onBeforeHandle(jwtMiddleware)
  // .guard({ beforeHandle: jwtMiddleware })
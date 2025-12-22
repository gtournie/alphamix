import { createHash } from 'crypto';

const PROVIDER_MAP: Record<string, number> = {
  google: 0b000,
  facebook: 0b001,
  apple: 0b010,
  // microsoft: 0b011,
  // github: 0b100,
  // linkedin: 0b101,
  // twitter: 0b110,
  // other: 0b111,
};

/**
 * Generates a UUID-like 128-bit identifier from a string and a provider name.
 * @param provider Name of the identity provider (e.g., 'google', 'facebook', 'apple')
 * @param providerAccountId Raw user identifier (e.g., 'sub' or 'id' from OAuth)
 * @returns A 128-bit UUID-like string
 */
export function generateOauthUserUUID(provider: string, providerAccountId: string): string {
  // 1. Map provider names to 3-bit prefixes
  const prefixBits = PROVIDER_MAP[provider];

  // 2. Hash the input string using SHA-256
  const hash = createHash('sha256').update(providerAccountId).digest();

  // 3. Inject the 3-bit prefix into the most significant bits of the first byte
  hash[0] = (hash[0] & 0b00011111) | (prefixBits << 5);

  // 4. Truncate the hash to 16 bytes (128 bits)
  const uuidBytes = hash.subarray(0, 16);

  // 5. Format the result as a UUID-like hexadecimal string
  const hex = uuidBytes.toString('hex');
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}

// Google
// {
//   "iss": "https://accounts.google.com",
//   "sub": "110169484474386276334",
//   "azp": "1234987819200.apps.googleusercontent.com",
//   "aud": "1234987819200.apps.googleusercontent.com",
//   "iat": 1353601026,
//   "exp": 1353604926,
//   "email": "jsmith@example.com",
//   "email_verified": true,
//   "name": "John Smith",
//   "picture": "https://lh3.googleusercontent.com/a-/AOh14Gh...",
//   "given_name": "John",
//   "family_name": "Smith",
//   "locale": "en"
// }

// Facebook
// {
//   "id": "10210229384729384",
//   "name": "Jane Doe",
//   "email": "janedoe@example.com"
// }

// Apple
// Oui, Apple peut retourner le nom de l’utilisateur, mais seulement lors de la toute première connexion avec Sign in with Apple, et uniquement si tu le demandes explicitement dans le scope de l’autorisation.

// ✅ Détails importants :
// Nom et prénom :

// Tu peux demander le nom complet (givenName, familyName) dans la requête OAuth.
// Apple le fournit une seule fois, lors de la première authentification de l’utilisateur avec ton app.
// Si l’utilisateur se reconnecte plus tard, le nom ne sera plus renvoyé.

// {
//   "iss": "https://appleid.apple.com",
//   "aud": "com.example.app",
//   "exp": 1586952596,
//   "iat": 1586948996,
//   "sub": "000123.456789abcdef",
//   "email": "user@example.com",
//   "email_verified": "true",
//   "is_private_email": "true",
//   "auth_time": 1586948996,
//   "nonce_supported": true
// }

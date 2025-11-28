/**
 * JWT Token Utilities (Mock Implementation)
/**
 * JWT Token Utilities (Mock Implementation)
 * 
 * This is a MOCK implementation for development/testing.
 * In production, use a proper JWT library like 'jsonwebtoken' with secret keys.
 */

export interface TokenPayload {
    phone_number: string;
    role: 'user' | 'admin';
    name: string;
    exp: number; // expiration timestamp in milliseconds
}

// Helper functions for base64 encoding (works on both client and server)
function base64Encode(str: string): string {
    if (typeof window === 'undefined') {
        // Server-side: use Buffer
        return Buffer.from(str, 'utf-8').toString('base64');
    } else {
        // Client-side: use btoa with Unicode support
        return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, (_, p1) => {
            return String.fromCharCode(parseInt(p1, 16));
        }));
    }
}

function base64Decode(str: string): string {
    if (typeof window === 'undefined') {
        // Server-side: use Buffer
        return Buffer.from(str, 'base64').toString('utf-8');
    } else {
        // Client-side: use atob with Unicode support
        const decoded = atob(str);
        return decodeURIComponent(Array.prototype.map.call(decoded, (c: string) => {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
    }
}

/**
 * Generate a mock JWT token
 * @param payload - Token payload without expiration
 * @returns Mock token string
 */
export function generateToken(payload: Omit<TokenPayload, 'exp'>): string {
    const exp = Date.now() + 7 * 24 * 60 * 60 * 1000; // 7 days from now
    const fullPayload: TokenPayload = { ...payload, exp };

    // Mock token: just base64 encode the payload
    // Real implementation would use HMAC signature
    const encodedPayload = base64Encode(JSON.stringify(fullPayload));
    return `mock_${encodedPayload}`;
}

/**
 * Verify and decode a mock JWT token
 * @param token - Token string to verify
 * @returns Decoded payload or null if invalid/expired
 */
export function verifyToken(token: string): TokenPayload | null {
    try {
        // Check token format
        if (!token || !token.startsWith('mock_')) {
            return null;
        }

        // Decode payload
        const encodedPayload = token.slice(5); // Remove 'mock_' prefix
        const payload: TokenPayload = JSON.parse(base64Decode(encodedPayload));

        // Check expiration
        if (payload.exp && payload.exp < Date.now()) {
            return null; // Token expired
        }

        return payload;
    } catch (error) {
        // Invalid token format or corrupted data
        return null;
    }
}

/**
 * Decode token without verification (for debugging)
 * @param token - Token string to decode
 * @returns Decoded payload or null if invalid
 */
export function decodeToken(token: string): TokenPayload | null {
    try {
        if (!token || !token.startsWith('mock_')) {
            return null;
        }
        const encodedPayload = token.slice(5);
        return JSON.parse(base64Decode(encodedPayload));
    } catch {
        return null;
    }
}

/**
 * Check if token is expired
 * @param token - Token string to check
 * @returns true if expired, false if valid
 */
export function isTokenExpired(token: string): boolean {
    const payload = decodeToken(token);
    if (!payload) return true;
    return payload.exp < Date.now();
}

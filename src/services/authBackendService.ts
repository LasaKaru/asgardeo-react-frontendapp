/**
 * Backend Authentication Service
 * Handles communication with the .NET Auth Service API
 */

import axios from 'axios';

const AUTH_API_BASE_URL = 'http://localhost:5000/api/auth';

interface AsgardeoTokenRequest {
    code: string;
    accessToken: string;
    idToken?: string;
    refreshToken?: string;
    expiresIn: number;
    scope?: string;
}

interface LoginResponse {
    accessToken: string;
    refreshToken: string;
    tokenType: string;
    expiresIn: number;
    user: {
        id: number;
        username: string;
        email: string;
        firstName?: string;
        lastName?: string;
    };
}

interface RefreshTokenRequest {
    refreshToken: string;
}

class AuthBackendService {
    /**
     * Authenticate with backend using Asgardeo tokens
     */
    async loginWithAsgardeo(tokenRequest: AsgardeoTokenRequest): Promise<LoginResponse | null> {
        try {
            const response = await axios.post<LoginResponse>(
                `${AUTH_API_BASE_URL}/login`,
                tokenRequest,
                {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            );

            if (response.data) {
                // Store tokens in localStorage
                this.storeTokens(response.data.accessToken, response.data.refreshToken);
                this.storeUserInfo(response.data.user);
                return response.data;
            }

            return null;
        } catch (error) {
            console.error('Backend authentication failed:', error);
            throw error;
        }
    }

    /**
     * Refresh access token using refresh token
     */
    async refreshToken(): Promise<LoginResponse | null> {
        try {
            const refreshToken = this.getRefreshToken();

            if (!refreshToken) {
                throw new Error('No refresh token available');
            }

            const response = await axios.post<LoginResponse>(
                `${AUTH_API_BASE_URL}/refresh`,
                { refreshToken } as RefreshTokenRequest,
                {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            );

            if (response.data) {
                // Update stored tokens
                this.storeTokens(response.data.accessToken, response.data.refreshToken);
                this.storeUserInfo(response.data.user);
                return response.data;
            }

            return null;
        } catch (error) {
            console.error('Token refresh failed:', error);
            this.clearTokens();
            throw error;
        }
    }

    /**
     * Logout and revoke tokens
     */
    async logout(): Promise<void> {
        try {
            const accessToken = this.getAccessToken();

            if (accessToken) {
                await axios.post(
                    `${AUTH_API_BASE_URL}/logout`,
                    {},
                    {
                        headers: {
                            'Authorization': `Bearer ${accessToken}`
                        }
                    }
                );
            }
        } catch (error) {
            console.error('Logout failed:', error);
        } finally {
            this.clearTokens();
        }
    }

    /**
     * Validate current session
     */
    async validateSession(): Promise<boolean> {
        try {
            const accessToken = this.getAccessToken();

            if (!accessToken) {
                return false;
            }

            const response = await axios.get(
                `${AUTH_API_BASE_URL}/validate`,
                {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`
                    }
                }
            );

            return response.data?.valid === true;
        } catch (error) {
            console.error('Session validation failed:', error);
            return false;
        }
    }

    /**
     * Get current user info
     */
    async getCurrentUser() {
        try {
            const accessToken = this.getAccessToken();

            if (!accessToken) {
                return null;
            }

            const response = await axios.get(
                `${AUTH_API_BASE_URL}/user`,
                {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`
                    }
                }
            );

            return response.data;
        } catch (error) {
            console.error('Get current user failed:', error);
            return null;
        }
    }

    // Token management methods
    private storeTokens(accessToken: string, refreshToken: string): void {
        localStorage.setItem('backend_access_token', accessToken);
        localStorage.setItem('backend_refresh_token', refreshToken);
    }

    private storeUserInfo(user: any): void {
        localStorage.setItem('backend_user_info', JSON.stringify(user));
    }

    getAccessToken(): string | null {
        return localStorage.getItem('backend_access_token');
    }

    getRefreshToken(): string | null {
        return localStorage.getItem('backend_refresh_token');
    }

    getUserInfo(): any {
        const userInfo = localStorage.getItem('backend_user_info');
        return userInfo ? JSON.parse(userInfo) : null;
    }

    clearTokens(): void {
        localStorage.removeItem('backend_access_token');
        localStorage.removeItem('backend_refresh_token');
        localStorage.removeItem('backend_user_info');
    }

    isAuthenticated(): boolean {
        return !!this.getAccessToken();
    }
}

export default new AuthBackendService();

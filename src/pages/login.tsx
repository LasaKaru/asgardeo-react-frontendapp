/**
 * Copyright (c) 2021, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
 *
 * WSO2 Inc. licenses this file to you under the Apache License,
 * Version 2.0 (the "License"); you may not use this file except
 * in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied. See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

import { BasicUserInfo, useAuthContext } from "@asgardeo/auth-react";
import React, { FunctionComponent, ReactElement, useCallback, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CustomAuthContext } from "../app";
import { default as authConfig } from "../config.json";

interface DerivedState {
    authenticateResponse: BasicUserInfo,
    idToken: string[],
    decodedIdTokenHeader: string,
    decodedIDTokenPayload: Record<string, string | number | boolean>;
}

/**
 * Dedicated login page for the Real Estate Management System.
 *
 * @return {React.ReactElement}
 */
export const LoginPage: FunctionComponent = (): ReactElement => {
    // Asgardeo authentication
    const asgardeoAuth = useAuthContext();
    const { state, signIn: asgardeoSignIn, signOut: asgardeoSignOut } = asgardeoAuth;
    
    // Custom authentication
    const customAuth = useContext(CustomAuthContext);
    const navigate = useNavigate();
    
    // Form state
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    
    // Asgardeo state
    const [ derivedAuthenticationState, setDerivedAuthenticationState ] = useState<DerivedState>(null);
    const [ hasAuthenticationErrors, setHasAuthenticationErrors ] = useState<boolean>(false);
    const [ hasLogoutFailureError, setHasLogoutFailureError ] = useState<boolean>();

    // Handle Asgardeo authentication

    // Handle Asgardeo authentication errors
    useEffect(() => {
        if (hasAuthenticationErrors) {
            setError('Authentication failed. Please try again.');
        }
    }, [hasAuthenticationErrors]);
    
    // Debugging: log authentication state
    useEffect(() => {
        console.log('Login page auth state:', {
            asgardeoState: state,
            isAuthenticated: state?.isAuthenticated,
            customIsAuthenticated: customAuth?.isAuthenticated
        });
        
        // If user is authenticated, redirect to dashboard
        if (state?.isAuthenticated) {
            console.log('User authenticated via Asgardeo, redirecting to dashboard');
            navigate('/dashboard');
        }
    }, [state, customAuth, navigate]);

    const handleAsgardeoLogin = useCallback(() => {
        setHasLogoutFailureError(false);
        setError('');
        console.log('Initiating Asgardeo login');
        // Use the default redirect URL from config
        asgardeoSignIn()
            .then(() => {
                console.log('Asgardeo login initiated successfully');
            })
            .catch((error) => {
                console.error('Failed to initiate Asgardeo login:', error);
                setHasAuthenticationErrors(true);
                setError('Failed to initiate Asgardeo login. Please try again.');
            });
    }, [asgardeoSignIn]);

    const handleCustomLogin = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        
        customAuth.login(username, password)
            .then(success => {
                if (success) {
                    navigate('/dashboard');
                } else {
                    setError('Invalid username or password.');
                }
            })
            .catch(() => {
                setError('Login failed. Please try again.');
            });
    };

    // If `clientID` is not defined in `config.json`, show a UI warning.
    if (!authConfig?.asgardeo?.clientID) {
        return (
            <div className="content">
                <h2>You need to update the Client ID to proceed.</h2>
                <p>Please open &quot;src/config.json&quot; file using an editor, and update
                    the <code>clientID</code> value with the registered application&apos;s client ID.</p>
                <p>Visit repo <a
                    href="https://github.com/asgardeo/asgardeo-auth-react-sdk/tree/master/samples/asgardeo-react-app">README</a> for
                    more details.</p>
            </div>
        );
    }

    return (
        <div className="login-container">
            <div className="login-card">
                <div className="login-header">
                    <h1>Real Estate Management System</h1>
                    <p>Manage properties, tenants, leases and payments</p>
                </div>
                
                <div className="login-content">
                    <div className="asgardeo-login">
                        <h3>Sign in to your account</h3>
                        {error && <div className="error-message">{error}</div>}
                        <button
                            className="btn primary asgardeo-btn login-btn"
                            onClick={() => {
                                handleAsgardeoLogin();
                            }}
                        >
                            <span className="asgardeo-icon">🔒</span>
                            Login with Asgardeo
                        </button>
                        <div className="divider">
                            <span>or</span>
                        </div>
                        
                        <form onSubmit={handleCustomLogin} className="custom-login-form">
                            <h4>Custom Login</h4>
                            <div className="form-group">
                                <label htmlFor="username">Username</label>
                                <input
                                    type="text"
                                    id="username"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    placeholder="Enter username"
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="password">Password</label>
                                <input
                                    type="password"
                                    id="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Enter password"
                                    required
                                />
                            </div>
                            <button
                                type="submit"
                                className="btn primary login-btn"
                            >
                                Sign In
                            </button>
                        </form>
                        
                        <div className="demo-login-section">
                            <button
                                className="btn secondary demo-btn login-btn"
                                onClick={() => {
                                    // For demo purposes, automatically login with admin credentials
                                    customAuth.login('admin', 'admin123')
                                        .then(success => {
                                            if (success) {
                                                navigate('/dashboard');
                                            } else {
                                                setError('Demo login failed.');
                                            }
                                        });
                                }}
                            >
                                Demo Login (admin/admin123)
                            </button>
                        </div>
                    </div>
                </div>
                
                <div className="login-footer">
                    <p>© 2025 Real Estate Management System. All rights reserved.</p>
                </div>
            </div>
        </div>
    );
};
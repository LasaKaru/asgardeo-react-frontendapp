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

import { useAuthContext } from "@asgardeo/auth-react";
import React, { FunctionComponent, ReactElement, useEffect } from "react";
import { useNavigate } from "react-router-dom";

/**
 * Authentication callback page for handling Asgardeo authentication responses.
 *
 * @return {React.ReactElement}
 */
export const AuthCallbackPage: FunctionComponent = (): ReactElement => {
    const { state } = useAuthContext();
    const navigate = useNavigate();

    useEffect(() => {
        if (state?.isAuthenticated) {
            // Redirect to dashboard when authenticated
            navigate('/dashboard');
        } else {
            // If authentication state is checked and user is not authenticated,
            // redirect to login page
            // We use a small delay to ensure the authentication state is properly updated
            const timer = setTimeout(() => {
                navigate('/login');
            }, 2000);
            
            return () => clearTimeout(timer);
        }
    }, [state?.isAuthenticated, navigate]);

    return (
        <div className="auth-callback">
            <h2>Processing authentication...</h2>
            <p>Please wait while we complete the authentication process.</p>
        </div>
    );
};
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

import React, { FunctionComponent, PropsWithChildren, ReactElement, useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuthContext } from "@asgardeo/auth-react";
import { CustomAuthContext } from "../app";
import FOOTER_LOGOS from "../images/footer.png";

/**
 * Default layout containing Header and Footer with support for children nodes.
 *
 * @param {DefaultLayoutPropsInterface} props - Props injected to the component.
 *
 * @return {React.ReactElement}
 */
export const DefaultLayout: FunctionComponent<PropsWithChildren> = (
    props: PropsWithChildren
): ReactElement => {
    const { children } = props;
    const asgardeoAuth = useAuthContext();
    const customAuth = useContext(CustomAuthContext);
    const navigate = useNavigate();
    const location = useLocation();

    // Check which authentication method is being used
    const isAsgardeoAuthenticated = asgardeoAuth.state?.isAuthenticated;
    const isCustomAuthenticated = customAuth?.isAuthenticated;
    const isAuthenticated = isAsgardeoAuthenticated || isCustomAuthenticated;
    
    const username = isAsgardeoAuthenticated 
        ? asgardeoAuth.state.displayName || asgardeoAuth.state.username || 'User'
        : isCustomAuthenticated
        ? customAuth.user?.username || 'User'
        : '';

    const handleLogout = () => {
        if (isAsgardeoAuthenticated) {
            // Use Asgardeo's signOut method which will handle the OIDC logout
            asgardeoAuth.signOut(() => {
                // Redirect to home page after logout
                navigate('/');
            }).catch((error) => {
                console.error('Error during Asgardeo logout:', error);
                // Even if logout fails, redirect to home page
                navigate('/');
            });
        } else if (isCustomAuthenticated) {
            customAuth.logout();
            navigate('/');
        }
    };

    // For the login page, we don't want to show the header
    if (location.pathname === '/') {
        return (
            <>
                {children}
                <img src={FOOTER_LOGOS} className="footer-image" />
            </>
        );
    }

    return (
        <>
            <div className="container">
                <div className="header">
                    <div className="header-content">
                        <h1>Real Estate Management System</h1>
                        {isAuthenticated && (
                            <div className="user-info">
                                <div className="profile-info">
                                    <div className="profile-image">
                                        <div className="profile-placeholder">
                                            {username.charAt(0).toUpperCase()}
                                        </div>
                                    </div>
                                    <span className="username">Hello, {username}</span>
                                </div>
                                <button className="btn secondary" onClick={handleLogout}>Logout</button>
                            </div>
                        )}
                    </div>
                </div>
                <div className="main-content">
                    {children}
                </div>
            </div>
            <img src={FOOTER_LOGOS} className="footer-image" />
        </>
    );
};
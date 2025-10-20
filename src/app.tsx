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

import { AuthProvider, useAuthContext } from "@asgardeo/auth-react";
import React, { FunctionComponent, ReactElement, createContext, useState } from "react";
import { render } from "react-dom";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./app.css";
import { default as appConfig } from "./config.json";
import { 
  HomePage, 
  NotFoundPage, 
  DashboardPage, 
  PropertiesPage, 
  TenantsPage, 
  OwnersPage, 
  LeasesPage, 
  PaymentsPage, 
  MaintenancePage 
} from "./pages";

// Create a simple authentication context for custom login
export interface CustomAuthContextType {
    isAuthenticated: boolean;
    user: any;
    login: (username: string, password: string) => Promise<boolean>;
    logout: () => void;
}

export const CustomAuthContext = createContext<CustomAuthContextType | null>(null);

// Main app component with Asgardeo authentication
const AppWithAsgardeo: FunctionComponent = (): ReactElement => {
    const asgardeoAuth = useAuthContext();
    
    // Custom authentication state
    const [customAuth, setCustomAuth] = useState({
        isAuthenticated: false,
        user: null
    });

    // Mock login function for custom authentication
    const customLogin = async (username: string, password: string): Promise<boolean> => {
        // For demo purposes, accept any non-empty username/password
        if (username && password) {
            setCustomAuth({
                isAuthenticated: true,
                user: { username, role: 'admin' }
            });
            return true;
        }
        return false;
    };

    const customLogout = () => {
        setCustomAuth({
            isAuthenticated: false,
            user: null
        });
    };

    const customAuthContextValue: CustomAuthContextType = {
        isAuthenticated: customAuth.isAuthenticated,
        user: customAuth.user,
        login: customLogin,
        logout: customLogout
    };

    return (
        <CustomAuthContext.Provider value={customAuthContextValue}>
            <Router>
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/dashboard" element={<DashboardPage />} />
                    <Route path="/properties" element={<PropertiesPage />} />
                    <Route path="/tenants" element={<TenantsPage />} />
                    <Route path="/owners" element={<OwnersPage />} />
                    <Route path="/leases" element={<LeasesPage />} />
                    <Route path="/payments" element={<PaymentsPage />} />
                    <Route path="/maintenance" element={<MaintenancePage />} />
                    <Route element={<NotFoundPage />} />
                </Routes>
            </Router>
        </CustomAuthContext.Provider>
    )
};

// Wrapper component to provide both authentication methods
const AppContent: FunctionComponent = (): ReactElement => {
    return (
        <AuthProvider config={appConfig.asgardeo}>
            <AppWithAsgardeo />
        </AuthProvider>
    )
};

const App = () => (
    <AppContent />
);

render((<App />), document.getElementById("root"));
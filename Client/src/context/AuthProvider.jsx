import { useCallback, useEffect, useMemo, useState } from "react";
import AuthContext from "./AuthContext";
import { fetchCurrentUser } from "../services/user.service";
import { useSnackbar } from "notistack";

export const AuthProvider = ({ children }) => {

    const { enqueueSnackbar } = useSnackbar();

    const [loginUser, setLoginUser] = useState(null);
    const [authLoading, setAuthLoading] = useState(true);

    const logout = useCallback(() => {
        localStorage.removeItem("token");
        setLoginUser(null);
    }, []);

    useEffect(() => {
        const initAuth = async () => {
            const token = localStorage.getItem("token");

            if (!token) {
                setAuthLoading(false);
                return;
            }

            try {
                const res = await fetchCurrentUser();
                const user = res?.data?.user || null;
                console.log(user)
                setLoginUser(user);
            } catch (err) {
                // Only logout on auth-related errors
                const status = err?.response?.status;
                if (status === 401 || status === 403) {
                    enqueueSnackbar("Session expired. Please login again.", {
                        variant: "warning",
                    });
                    logout();
                }
            } finally {
                setAuthLoading(false);
            }
        }

        initAuth();
    }, [logout, enqueueSnackbar]);


    const values = useMemo(() => ({
        loginUser,
        setLoginUser,
        logout,
        authLoading,
    }), [loginUser, authLoading, logout, setLoginUser]);

    return (
        <AuthContext.Provider value={values}>
            {children}
        </AuthContext.Provider>
    )
}
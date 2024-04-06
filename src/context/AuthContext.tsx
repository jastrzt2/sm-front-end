import { getCurrentUser, likePost } from '@/lib/api/api';
import { IContextType, IUser } from '@/types';
import exp from 'constants';
import { createContext, useContext, useEffect, useState } from 'react';
import { set } from 'react-hook-form';
import { useNavigate } from "react-router-dom";

export const INITIAL_USER = {
    id: '',
    name: '',
    username: '',
    email: '',
    imageUrl: '',
    bio: '',
    city: '',
    saved_posts: [],
    liked_posts: []
};

const INITIAL_STATE = {
    user: INITIAL_USER,
    isLoading: false,
    isAuthenticated: false,
    setUser: () => {},
    setIsAuthenticated: () => {},
    checkAuthUser: async () => false as boolean,
}



export const AuthContext = createContext<IContextType>(INITIAL_STATE);

export const AuthProvider = ( { children }: {children: React.ReactNode}) => {
    const navigate = useNavigate();
    const [ user, setUser ] = useState<IUser>(INITIAL_USER);
    const [ isLoading, setIsLoading ] = useState(false);
    const [ isAuthenticated, setIsAuthenticated ] = useState(false);

    const checkAuthUser = async() => {
        try {
            setIsLoading(true);
            const currentAccount = await getCurrentUser();
            console.log('Current Account po załadowaniu:', currentAccount);
            if (currentAccount) {   
                setUser({
                    id: currentAccount.id,
                    name: currentAccount.name,
                    username: currentAccount.username,
                    email: currentAccount.email,
                    imageUrl: currentAccount.imageUrl,
                    bio: currentAccount.bio,
                    saved_posts: currentAccount.savedPosts,
                    city: currentAccount.city,
                    liked_posts: currentAccount.likedPosts
                });
                setIsAuthenticated(true);
                return true;
            }
            setIsAuthenticated(false);
            localStorage.removeItem("cookieFallback");
            return false;
        } catch (error) {
            console.log(error);
            localStorage.removeItem("cookieFallback");
            return false;
        }
        finally {
            setIsLoading(false);
        }
    };
    const value = {
        user,
        setUser,
        isLoading,
        isAuthenticated,
        setIsAuthenticated,
        checkAuthUser
    }

    useEffect(() => {
        if (location.pathname !== '/sign-up') {
            const cookieFallback = localStorage.getItem("cookieFallback");
            if (
                cookieFallback === "[]" ||
                cookieFallback === null ||
                cookieFallback === undefined
            ) {
                navigate("/sign-in");
            } else {
                checkAuthUser()
            }
        }
    },[location.pathname]);

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    ) 
}


export const useUserContext = () => {
    return useContext(AuthContext);
}
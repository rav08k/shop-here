import { create } from 'zustand';

export const useUserStore = create(
    (set) => ({
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,

        setUser : ({user, token}) => {
            set({ 
                user: user, 
                isAuthenticated: true, 
                isLoading: false, 
                error: null,
                token: token 
            });
        },
        resetUser : () => {
            set({ 
                user: null,
                token: null,
                isAuthenticated: false,
                isLoading: false,
                error: null,
            });
        },
    })
);


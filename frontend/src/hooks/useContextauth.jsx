import { AuthContext } from "../contexts/authContext";
import React, { useContext } from 'react';



export const useContextauth = () => {
    const context = useContext(AuthContext);
    if(context === undefined) throw new Error('useContextauth must be used within a AuthProvider')
    return context
}
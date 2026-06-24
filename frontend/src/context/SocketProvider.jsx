import React, { createContext, useContext, useMemo } from 'react'
import { io } from 'socket.io-client'

const SocketContext = createContext(null)

export const useSocket = () => {
    return useContext(SocketContext)
}

const socket = io(import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000', {
    withCredentials: true,
})


export const SocketProvider = ({ children }) => {
    return (
        <SocketContext.Provider value={socket}>
            {children}
        </SocketContext.Provider>
    )
}

export default SocketContext

import React, { createContext, useContext, useMemo } from 'react'
import { io } from 'socket.io-client'
import { SOCKET_URL } from '../constants'

const SocketContext = createContext(null)

export const useSocket = () => {
    return useContext(SocketContext)
}

const socket = io(SOCKET_URL, {
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

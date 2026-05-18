 
import { createContext, useContext, useState } from 'react'

const UserContext = createContext()

export function UserProvider({ children }) {
  const [userLevel, setUserLevel] = useState(
    localStorage.getItem('user_level') || ''
  )

  const saveLevel = (level) => {
    localStorage.setItem('user_level', level)
    setUserLevel(level)
  }

  return (
    <UserContext.Provider value={{ userLevel, saveLevel }}>
      {children}
    </UserContext.Provider>
  )
}

export function useUser() {
  return useContext(UserContext)
}
"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { type Nguoi_dung, mockNguoi_dung } from "./mock-data"

interface AuthContextType {
  currentUser: Nguoi_dung | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<boolean>
  signup: (email: string, password: string, hoTen: string) => Promise<boolean>
  logout: () => void
  updateProfile: (updates: Partial<Nguoi_dung>) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<Nguoi_dung | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const storedUser = localStorage.getItem("currentUser")
    if (storedUser) {
      try {
        setCurrentUser(JSON.parse(storedUser))
      } catch (e) {
        console.error("Failed to restore user:", e)
      }
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    const user = mockNguoi_dung.find((u) => u.Email === email)
    if (user && user.Mat_khau_hash === password) {
      setCurrentUser(user)
      localStorage.setItem("currentUser", JSON.stringify(user))
      return true
    }
    return false
  }

  const signup = async (email: string, password: string, hoTen: string): Promise<boolean> => {
    const userExists = mockNguoi_dung.some((u) => u.Email === email)
    if (userExists) {
      return false
    }

    const newUser: Nguoi_dung = {
      Id_nguoi_dung: `user_${Date.now()}`,
      Email: email,
      Mat_khau_hash: password,
      Ho_ten: hoTen,
      So_dien_thoai: "",
      Avatar: `https://avatar.vercel.sh/${email.split("@")[0]}`,
      Ngay_sinh: "",
      Ngay_tao: new Date().toISOString(),
    }

    mockNguoi_dung.push(newUser)
    setCurrentUser(newUser)
    localStorage.setItem("currentUser", JSON.stringify(newUser))
    return true
  }

  const logout = () => {
    setCurrentUser(null)
    localStorage.removeItem("currentUser")
  }

  const updateProfile = (updates: Partial<Nguoi_dung>) => {
    if (currentUser) {
      const updated = { ...currentUser, ...updates }
      setCurrentUser(updated)
      localStorage.setItem("currentUser", JSON.stringify(updated))
      const index = mockNguoi_dung.findIndex((u) => u.Id_nguoi_dung === currentUser.Id_nguoi_dung)
      if (index !== -1) {
        mockNguoi_dung[index] = updated
      }
    }
  }

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isLoading,
        login,
        signup,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within AuthProvider")
  }
  return context
}

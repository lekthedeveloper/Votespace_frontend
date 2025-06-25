import { useState } from "react"
import CryptoJS from "crypto-js"

const ENCRYPTION_KEY = process.env.REACT_APP_ENCRYPTION_KEY || "default-key-change-in-production"

export const useSecureStorage = (key: string, defaultValue: any = null) => {
  const [value, setValue] = useState(() => {
    try {
      const item = localStorage.getItem(key)
      if (item) {
        const decrypted = CryptoJS.AES.decrypt(item, ENCRYPTION_KEY).toString(CryptoJS.enc.Utf8)
        return JSON.parse(decrypted)
      }
      return defaultValue
    } catch (error) {
      console.error("Error reading from secure storage:", error)
      return defaultValue
    }
  })

  const setSecureValue = (newValue: any) => {
    try {
      setValue(newValue)
      const encrypted = CryptoJS.AES.encrypt(JSON.stringify(newValue), ENCRYPTION_KEY).toString()
      localStorage.setItem(key, encrypted)
    } catch (error) {
      console.error("Error writing to secure storage:", error)
    }
  }

  const removeSecureValue = () => {
    try {
      setValue(defaultValue)
      localStorage.removeItem(key)
    } catch (error) {
      console.error("Error removing from secure storage:", error)
    }
  }

  return [value, setSecureValue, removeSecureValue]
}

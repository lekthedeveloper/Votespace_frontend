import type React from "react"
import { useEffect } from "react"

export const CSPProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  useEffect(() => {
    // Set Content Security Policy headers (ideally done server-side)
    const meta = document.createElement("meta")
    meta.httpEquiv = "Content-Security-Policy"
    meta.content = `
      default-src 'self';
      script-src 'self' 'unsafe-inline' https://trusted-cdn.com;
      style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
      img-src 'self' data: https:;
      font-src 'self' https://fonts.gstatic.com;
      connect-src 'self' https://api.yourdomain.com;
      frame-ancestors 'none';
      base-uri 'self';
      form-action 'self';
    `
      .replace(/\s+/g, " ")
      .trim()

    document.head.appendChild(meta)

    return () => {
      document.head.removeChild(meta)
    }
  }, [])

  return <>{children}</>
}

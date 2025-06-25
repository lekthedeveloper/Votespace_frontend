export class SecurityUtils {
    // Generate secure random tokens
    static generateSecureToken(length = 32): string {
      const array = new Uint8Array(length)
      crypto.getRandomValues(array)
      return Array.from(array, (byte) => byte.toString(16).padStart(2, "0")).join("")
    }
  
    // Validate JWT token structure (basic validation)
    static isValidJWTStructure(token: string): boolean {
      const parts = token.split(".")
      return parts.length === 3 && parts.every((part) => part.length > 0)
    }
  
    // Check if running in secure context
    static isSecureContext(): boolean {
      return window.isSecureContext || window.location.protocol === "https:"
    }
  
    // Detect potential XSS attempts
    static detectXSS(input: string): boolean {
      const xssPatterns = [
        /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
        /javascript:/gi,
        /on\w+\s*=/gi,
        /<iframe/gi,
        /<object/gi,
        /<embed/gi,
      ]
  
      return xssPatterns.some((pattern) => pattern.test(input))
    }
  
    // Generate Content Security Policy nonce
    static generateCSPNonce(): string {
      return btoa(this.generateSecureToken(16))
    }
  
    // Validate URL to prevent open redirects
    static isValidRedirectURL(url: string, allowedDomains: string[]): boolean {
      try {
        const urlObj = new URL(url)
        return allowedDomains.includes(urlObj.hostname) || urlObj.hostname === window.location.hostname
      } catch {
        return false
      }
    }
  }
  
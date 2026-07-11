export class CookieUtils {

  private static isBrowser() {
    return typeof document !== "undefined";
  }
  static setItem<T>(key: string, value: T, days = 7): void {
    if (!this.isBrowser()) return;
    try {
      const json = JSON.stringify(value);
      const expires = new Date(
        Date.now() + days * 24 * 60 * 60 * 1000,
      ).toUTCString();
      document.cookie = `${key}=${encodeURIComponent(
        json,
      )}; expires=${expires}; path=/`;
    } catch (error) {
      console.error(`Error saving ${key} to cookies`, error);
    }
  }

  static getItem<T>(key: string): T | null {
    if (!this.isBrowser()) return null;
    try {
      const cookies = document.cookie.split(";");

      for (const cookie of cookies) {
        const [k, v] = cookie.trim().split("=");

        if (k === key) {
          return JSON.parse(decodeURIComponent(v)) as T;
        }
      }

      return null;
    } catch (error) {
      console.error(`Error reading ${key} from cookies`, error);
      return null;
    }
  }

  static removeItem(key: string): void {
    if (!this.isBrowser()) return;
    // Set expiration in the past to delete
    document.cookie = `${key}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/`;
  }

  static clear(): void {
    if (!this.isBrowser()) return;
    const cookies = document.cookie.split(";");

    for (const cookie of cookies) {
      const key = cookie.split("=")[0].trim();
      document.cookie = `${key}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/`;
    }
  }
}

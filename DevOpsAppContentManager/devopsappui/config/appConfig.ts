class AppConfig {
  public readonly apiUrl: string;

  constructor() {
    const apiUrl = import.meta.env.VITE_API_URL;

    if (!apiUrl) {
      throw new Error("VITE_API_URL is not defined in environment variables");
    }

    this.apiUrl = apiUrl;
  }
}

export const appConfig = new AppConfig();

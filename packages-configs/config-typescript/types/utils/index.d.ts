interface IEnvConfig {
    PORT: number;
    DEFAULT_WEBSITE_ID: string;
    JWT_SECRET: string;
    JWT_REFRESH_SECRET: string;
    JWT_EXPIRES: string;
    JWT_REFRESH_EXPIRES: string;
    NODE_ENV: string;
    REDIS_HOST: string;
    REDIS_PASSWORD: string;
    REDIS_PORT: string;
    CLOUDINARY_CLOUD_NAME: string;
    CLOUDINARY_API_KEY: string;
    CLOUDINARY_API_SECRET: string;
}
export declare function GetEnvConfig(): IEnvConfig;
export declare class PasswordHash {
    static saltRounds: number;
    static getHash(password: string): string;
    static compare(password: string, hashedPassword: string): boolean;
}
export declare function getUUID(): string;
export {};

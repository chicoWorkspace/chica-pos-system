export declare class AuthService {
    login({ username, password }: {
        username: string;
        password: string;
    }): Promise<{
        accessToken: string;
        refreshToken: string;
        role: string | import("@repo/db/group/index.type").MemberAttributes;
        permissions: {
            pageKey: string;
            actions: string[];
        }[];
    }>;
    refresh({ refreshToken }: {
        refreshToken: string;
    }): Promise<{
        accessToken: string;
    }>;
    getPermissions(user: any): Promise<{
        permissions: {
            pageKey: string;
            actions: string[];
        }[];
    }>;
}

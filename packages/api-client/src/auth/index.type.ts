export interface LoginBag {
  username: string;
  password: string;
}

export interface LoginResult {
  accessToken: string;
  refreshToken: string;
  role: string; //leader,member
  permissions: PagePermissions[];
}

export interface PagePermissions {
  pageKey: string;
  actions: string[];
}

export interface RefreshBag {
  refreshToken: string;
}

export interface RefreshResult {
  accessToken: string;
}

export interface GetPermissionsResult{
  permissions:PagePermissions[]
}
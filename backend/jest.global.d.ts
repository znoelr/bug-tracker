declare global {
  var signin: (userId: string) => string[];
  var signinNewUser: (cookies: string[], app: Express) => Promise<string[]>;
}

declare namespace globalThis {
  var signin: (userId: string) => string[];
  var signinNewUser: (cookies: string[], app: Express) => Promise<string[]>;
}

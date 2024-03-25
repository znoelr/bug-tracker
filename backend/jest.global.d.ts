declare global {
  var signin: (userId: string) => string[];
}

declare namespace globalThis {
  var signin: (userId: string) => string[];
}

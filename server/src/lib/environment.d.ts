declare namespace NodeJS {
  export interface ProcessEnv {
    DB_URI: string;
    AWS_ACCESS_KEY_ID: string;
    AWS_SECRET_ACCESS_KEY: string;
  }
}

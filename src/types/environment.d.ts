export {};

declare global {
    namespace NodeJS {
        interface ProcessEnv {
            DB_PORT: number;
            DB_USER: string;
            PORT: number;
            USER_SECRET: string;
            ENV: 'test' | 'dev' | 'prod';
        }
    }
}
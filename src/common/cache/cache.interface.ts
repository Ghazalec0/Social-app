export interface ICacheProvider {
    delete(key: string): Promise<void>;

    get(key: string): Promise<string | null>;

    set(
        key: string,
        value: string,
        ttlSeconds: number
    ): Promise<void>;

    addToSet(
        key: string,
        value: string
    ): Promise<void>;

    getAllFromSet(
        key: string
    ): Promise<string[]>;

    rmSet(
        key: string,
        value: string
    ): Promise<void>;
}
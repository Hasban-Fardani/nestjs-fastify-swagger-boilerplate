export const getOrTrhow = (key: string) => {
    const value = process.env[key];
    if (!value) {
        throw new Error(`Environment variable ${key} is not defined`);
    }
    return value;
}

export const parseBoolean = (value: string) => {
    return value === 'true' || value === '1' || value === 't' || value === 'y' || value === 'yes';
}
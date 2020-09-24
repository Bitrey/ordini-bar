import { genSaltSync, hashSync } from "bcryptjs";

export const generatePassword = (password: string): string => {
    const salt = genSaltSync();
    const hash = hashSync(password, salt);
    return hash;
};

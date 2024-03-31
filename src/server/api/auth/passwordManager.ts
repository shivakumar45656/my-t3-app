import * as bcrypt from 'bcrypt';

const saltRounds = 10; // Number of salt rounds

// Function to hash a password
export async function hashPassword(password: string): Promise<string> {
    try {
        const salt = await bcrypt.genSalt(saltRounds);
        const hash = await bcrypt.hash(password, salt);
        return hash;
    } catch (error) {
        throw error;
    }
}

// Function to compare a password with a hashed password
export async function comparePassword(password: string, hashedPassword: string): Promise<boolean> {
    try {
        const match = await bcrypt.compare(password, hashedPassword);
        return match;
    } catch (error) {
        throw error;
    }
}

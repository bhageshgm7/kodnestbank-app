import User from '../models/user.model';

/**
 * Generates a unique 12-digit account number.
 * Retries if a collision is detected in the database.
 */
const generateAccountNumber = async (): Promise<string> => {
    let accountNumber: string;
    let exists = true;

    do {
        // Generate 12-digit number starting from 1 (to avoid leading zero edge cases)
        const min = 100_000_000_000; // 1e11
        const max = 999_999_999_999; // ~1e12
        accountNumber = (Math.floor(Math.random() * (max - min + 1)) + min).toString();
        const found = await User.findOne({ accountNumber });
        exists = !!found;
    } while (exists);

    return accountNumber;
};

export default generateAccountNumber;

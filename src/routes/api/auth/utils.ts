import { db } from "$model";

export const create_discriminator = async (baseUsername: string) => {
    const maxAttempts = 5;
    let attempts = 0;

    while (attempts < maxAttempts) {
        const discriminator = String(Math.floor(1000 + Math.random() * 9000)); // Generates 4-digit number
        const fullname = `${baseUsername}#${discriminator}`;

        const existingUser = await db.User.findOne({ where: { fullname } });
        if (!existingUser) {
            return { discriminator, fullname };
        }
        attempts++;
    }
    throw new Error('Unable to generate a unique username after several attempts.');
}
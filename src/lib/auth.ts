import { getServerSession } from "next-auth";
import { authOptions } from "./auth-options";
import * as bcrypt from "bcryptjs";

export async function hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 12);
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
}

export async function getAuthUser() {
    const session = await getServerSession(authOptions);
    if (!session?.user) return null;

    return {
        userId: (session.user as any).id as string,
        email: session.user.email as string,
        name: session.user.name as string,
        role: (session.user as any).role as string,
    };
}

export function getUserFromRequest() {
    return getAuthUser();
}

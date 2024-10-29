import type { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { getUserByEmail } from "./data/user";
import bcrytpjs from "bcryptjs";
import { signInSchema } from "./lib/zod";
import {sign} from "crypto";

export default {
    providers: [
        Credentials({
        async authorize(credentials) {
            const validatedFields = signInSchema.safeParse(credentials);
            if (!validatedFields.success) {
                return null;
            }

            if (validatedFields.success){
                const { email, password } = validatedFields.data;
                const user = await getUserByEmail(email);
                if (!user || !user.password) {
                    return null;
                }

                const passwordMatch = await bcrytpjs.compare(password, user.password);
                if (passwordMatch) {
                    return user;
                }

        }
        return null;
        },
    }),
    ],
} satisfies NextAuthConfig;

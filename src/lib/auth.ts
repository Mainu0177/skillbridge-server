import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
// import { PrismaClient } from "../../generated/prisma/client";
import { prisma } from "./prisma";

// import { PrismaClient } from "@/generated/prisma/client";

export const auth = betterAuth({
    baseURL: process.env.BETTER_AUTH_URL,
    database: prismaAdapter(prisma, {
        provider: "postgresql",
    }),
    emailAndPassword: { 
    enabled: true, 
    },
    trustedOrigins: [process.env.BETTER_AUTH_URL || "http://localhost:5000"],
    advanced: {
        disableCSRFCheck: true,
        useSecureCookies: false,
        
        
    }
});


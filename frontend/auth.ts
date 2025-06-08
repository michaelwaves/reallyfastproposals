import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import Google from "next-auth/providers/google"
import { Pool } from "pg"
import PostgresAdapter from '@auth/pg-adapter'
const pool = new Pool({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
})

export const { handlers, signIn, signOut, auth } = NextAuth({
    adapter: PostgresAdapter(pool),
    providers: [Google,
        Credentials({
            credentials: {
                email: {
                    type: "email",
                    label: "Email",
                    placeholder: "email@gmail.com"
                },
                password: {
                    type: "password",
                    label: "Password",
                    placeholder: "*****"
                }
            },
            authorize: async (credentials) => {
                let user = null
                user = await getUser(credentials.email as string, credentials.password as string)
                if (!user) {
                    throw new Error("invalid credentials")
                }
                return user
            }
        },
        )
    ],
    callbacks: {
        async session({ session, user }) {
            session.user.id = user.id
            return session
        }
    }
})

const getUser = async (email: string, password: string) => {
    return {
        email,
        password,
        name: "Michael Yu"
    }
}
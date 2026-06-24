import NextAuth from "next-auth";

import { authOptions, AuthOptions } from "./options";

const handler = NextAuth(authOptions)

export {handler as GET, handler as Post}
// import { MongoClient } from "mongodb";
// import { betterAuth } from "better-auth";
// import { memoryAdapter } from "better-auth/adapters/memory";
// import { mongodbAdapter } from "@better-auth/mongo-adapter";
// import { nextCookies } from "better-auth/next-js";

// export type UserRole = "customer" | "technician" | "admin";

// const mongoUri = process.env.MONGODB_URI;
// let mongoClient: MongoClient | undefined;

// if (mongoUri) {
//   mongoClient = new MongoClient(mongoUri);
//   void mongoClient.connect().catch(() => {
//     mongoClient = undefined;
//   });
// }

// const inMemoryDatabase = {
//   users: [],
//   sessions: [],
//   accounts: [],
//   verifications: [],
// };

// const databaseConfig = mongoClient
//   ? mongodbAdapter(mongoClient.db("fixmate"), { transaction: false })
//   : memoryAdapter(inMemoryDatabase);

// export const auth = betterAuth({
//   appName: "FixMate",
//   baseURL: process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
//   secret: process.env.BETTER_AUTH_SECRET ?? "fixmate-dev-secret",
//   database: databaseConfig,
//   user: {
//     additionalFields: {
//       role: {
//         type: "string",
//         required: true,
//         defaultValue: "customer",
//         input: true,
//         returned: true,
//       },
//     },
//   },
//   emailAndPassword: {
//     enabled: true,
//     requireEmailVerification: false,
//   },
//   plugins: [nextCookies()],
// });

// export const roleOptions: UserRole[] = ["customer", "technician", "admin"];



import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "@better-auth/mongo-adapter";

export type { UserRole } from "@/lib/user-role";

const client = new MongoClient(process.env.MONGODB_URI as string);
const db = client.db("fixmate");



export const auth = betterAuth({
  database: mongodbAdapter(db, {
    client,
  }),

  user: {
    additionalFields: {
      role: {
        type: "string",
        required: true,
        defaultValue: "customer",
        input: true,
        returned: true,
      },
    },
  },

  emailAndPassword: {
    enabled: true,
  },
  socialProviders: {
    // github: {
    //   clientId: process.env.GITHUB_CLIENT_ID as string,
    //   clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
    // },
  },
});
import {checkout, polar, portal } from "@polar-sh/better-auth";
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import prisma from "@/lib/db";
import { polarClient } from "./polar";

export const auth = betterAuth({
  database : prismaAdapter(prisma, {
    provider : "postgresql",
  }),
  emailAndPassword : {
    enabled : true,
    autoSignIn : true,
  },
  plugins: [
    polar({
      client : polarClient,
      createCustomerOnSignUp : true,
      use : [
        checkout({
          products : [
            {
              productId: "fe51a602-58a3-457a-a45d-a4a3c2da297f",
              slug: "Nodebase-Pro",
            }
          ],
          successUrl : process.env.POLAR_SUCCESS_URL,
          authenticatedUsersOnly : true,
        }),
        portal()
      ]
    })
  ]
});
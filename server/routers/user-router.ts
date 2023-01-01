import { createRouter } from "../create-router";
import { createUserSchema, getUserSchema } from "../schemas/user-schemas";

export const userRouter = createRouter()
  .mutation("create", {
    input: createUserSchema,
    async resolve({ input, ctx }) {
      return await ctx.prisma.user.create({
        data: {
          id: input.id,
          name: input.name,
          email: input.email,
          image: input.image,
        },
      });
    },
  })
  .query("get-by-id", {
    input: getUserSchema,
    async resolve({ ctx, input }) {
      return await ctx.prisma.user.findUnique({
        where: { id: input.userId },
        include: {
          teams: {
            include: {
              team: {
                include: {
                  entries: true,
                  members: true,
                  comps: true,
                  pitScouts: true,
                  matchScouts: true,
                },
              },
            },
          },
        },
      });
    },
  })
  .query("get-forms-by-id", {
    input: getUserSchema,
    async resolve({ ctx, input }) {
      return await ctx.prisma.user.findUnique({
        where: { id: input.userId },
        // i hate this so much
        include: {
          teams: {
            include: {
              team: {
                include: {
                  matchScouts: {
                    include: {
                      categories: {
                        include: {
                          questions: true,
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      });
    },
  });

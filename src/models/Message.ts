import { builder } from '../builder';
import { prisma } from '../db';
import { ReactionType } from '@prisma/client';

builder.enumType(ReactionType, { name: 'Reaction' });

builder.prismaObject('Message', {
  fields: t => ({
    id: t.exposeID('id'),
    body: t.exposeString('body'),
    type: t.exposeString('type'),
    reactions: t.exposeStringList('reactions'),
    Comments: t.relation('Comments'),
  }),
});

const DEFAULT_PAGE_SIZE = 10;

builder.queryField('Post', t => 
  t.prismaField({
    type: 'Message',
    nullable: true,
    args: {
      id: t.arg.id({ required: true }),
    },
    resolve: async (query, _root, args, _ctx, _info) => {
      return prisma.message.findUnique({
        ...query,
        where: {
          id: Number(args.id),
        },
      });
    },
  })
);

builder.queryField('Posts', t => 
  t.prismaField({
    type: ['Message'],
    args: {
      take: t.arg.int(),
      skip: t.arg.int(),
    },
    resolve: async (query, _root, args, _ctx, _info) => {
      return prisma.message.findMany({
        ...query,
        take: args.take ?? DEFAULT_PAGE_SIZE,
        skip: args.skip ?? 0,
        where: {
          type:'POST',
        },
      });
    },
  })
);

const createPostInput = builder.inputType('createPostInput', {
  fields: t => ({
    body: t.string({ required: true }),
  }),
});

builder.mutationField('createPost', t =>
  t.prismaField({
    type: 'Message',
    args: {
      input: t.arg({ type: createPostInput, required: true }),
    },
    resolve: async (_query, _root, args, _ctx, _info) => {
      const Post = await prisma.message.create({
        data: {
          type: 'POST',
          body: args.input.body,
        }
      });
      return Post;
    }
  })
);

const createCommentInput = builder.inputType('createCommentInput', {
  fields: t => ({
    body: t.string({ required: true }),
    parentId: t.id({ required: true }),
  }),
});

builder.mutationField('createComment', t =>
  t.prismaField({
    type: 'Message',
    args: {
      input: t.arg({ type: createCommentInput, required: true }),
    },
    resolve: async (_query, _root, args, _ctx, _info) => {
      const Comment = await prisma.message.create({
        data: {
          type: 'COMMENT',
          body: args.input.body,
          parentId: Number(args.input.parentId),
          /*
          parent: {
            connect: {
              id: String(args.input.parentId.valueOf),
            },
          },
          */
        },
      });
      return Comment;
    }
  })
);

const addReactionInput = builder.inputType('addReactionInput', {
  fields: t => ({
    reaction: t.field({ type: ReactionType }),
    id: t.id({ required: true }),
  }),
});

builder.mutationField('addReaction', t =>
  t.prismaField({
    type: 'Message',
    args: {
      input: t.arg({ type: addReactionInput, required: true }),
    },
    resolve: async (_query, _root, args, _ctx, _info) => {
      const Comment = await prisma.message.update({
        where: {
          id: Number(args.input.id),
        },
        data: {
          reactions: {
            push: args.input.reaction as ReactionType,
          },
        }
      });
      return Comment;
    }
  })
);

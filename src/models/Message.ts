import { builder } from '../builder';
import { prisma } from '../db';
/*
builder.prismaObject('Message', {
  fields: t => ({
    id: t.exposeID('id'),
    body: t.exposeString('body'),
    type: t.exposeString('type'),
    reactions: t.exposeStringList('reactions'),
    Comments: t.relation('Comments'),
  }),
});

builder.queryField('Posts', t => 
  t.prismaField({
    type: ['Message'],
    resolve: async (query, _root, _args, _ctx, _info) => {
      return prisma.message.findMany({
        where: {
          type:'POST',
        },
        include: {
          Comments: {

          }
        },
      });
    },
  })
);
*/
builder.prismaNode('Message', {
  id: { field: 'id' },
  fields: t => ({
    body: t.exposeString('body'),
    type: t.exposeString('type'),
    reactions: t.exposeStringList('reactions'),
    Comments: t.relation('Comments'),
  }),
});

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
          parentId: String(args.input.parentId.valueOf),
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

builder.queryField('Posts', t => 
  t.prismaConnection({
    type: 'Message',
    cursor: 'id',
    resolve: async (query, _root, _args, _ctx, _info) => {
      return prisma.message.findMany({
        ...query,
        where: {
          type:'POST',
        },
      });
    },
  })
);

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
          id: String(args.id.valueOf),
        },
      });
    },
  })
);

//builder.mutationField
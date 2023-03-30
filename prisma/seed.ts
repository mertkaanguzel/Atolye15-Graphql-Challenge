import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  await prisma.message.deleteMany({});

  const Post = await prisma.message.create({
    data: {
      type: 'POST',
      body: 'Test Post',
      
    }
  });

  await prisma.message.update({
    where: {
      id: Post.id
    },
    data: {
      reactions: {
        push: 'ROCKET'
      },
    }
  });

  const Comment = await prisma.message.create({
    data: {
      type: 'COMMENT',
      body: 'Test Comment',
      parentId: Post.id,

    }
  });

  await prisma.message.update({
    where: {
      id: Comment.id
    },
    data: {
      reactions: {
        push: 'HEART'
      },
    }
  });

  const NestedComment = await prisma.message.create({
    data: {
      type:  'COMMENT',
      body: 'Nested Test Comment',
      parentId: Comment.id
    },
  });
}

main().then(() => {
  console.log('Data seeded...');
});

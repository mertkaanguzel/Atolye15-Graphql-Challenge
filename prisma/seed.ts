import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  await prisma.message.deleteMany({});
  await prisma.post.deleteMany({});
  await prisma.comment.deleteMany({});

  const Message = await prisma.message.create({
    data: {
      type: 'POST',
      body: 'Test Post',
    }
  });

  const Post = await prisma.post.create({
    data: {
      messageId: Message.id,
    },
  });

  await prisma.message.update({
    where: {
      id: Post.messageId
    },
    data: {
      reactions: {
        push: 'ROCKET'
      },
    }
  });

  const Message1 = await prisma.message.create({
    data: {
      type: 'COMMENT',
      body: 'Test Comment',
    }
  });

  const Comment = await prisma.comment.create({
    data: {
      messageId: Message1.id,
      postId: Post.messageId,
    },
  });

  await prisma.message.update({
    where: {
      id: Comment.messageId
    },
    data: {
      reactions: {
        push: 'HEART'
      },
    }
  });

  const Message2 = await prisma.message.create({
    data: {
      type: 'COMMENT',
      body: 'Nested Test Comment',
    }
  });

  const NestedComment = await prisma.comment.create({
    data: {
      messageId: Message2.id,
      postId: Post.messageId,
      parentCommentId: Comment.messageId
    },
  });
}

main().then(() => {
  console.log('Data seeded...');
});

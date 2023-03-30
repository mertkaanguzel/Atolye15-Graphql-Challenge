import SchemaBuilder from '@pothos/core';
import { DateResolver } from 'graphql-scalars';
import PrismaPlugin from '@pothos/plugin-prisma';
import type PrismaTypes from '@pothos/plugin-prisma/generated';
import { prisma } from './db';
import RelayPlugin from '@pothos/plugin-relay';

export const builder = new SchemaBuilder<{
  Scalars: {
    Date: { Input: Date; Output: Date };
    ID: {
      Output: string;
      Input: string;
    };
  },
  PrismaTypes: PrismaTypes,
}>({
  plugins: [PrismaPlugin, RelayPlugin],
  relayOptions: {
    cursorType: 'String',
    clientMutationId: 'omit',

  },
  prisma: {
    client: prisma,
  },
});

builder.addScalarType('Date', DateResolver, {});

builder.queryType({});

builder.mutationType({});

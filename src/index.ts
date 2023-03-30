import express from 'express';
import { createYoga } from 'graphql-yoga';
import { schema } from './schema';

const port = Number(process.env.API_PORT) || 3000;

const app = express();
 
const yoga = createYoga({ schema });

app.use('/graphql', yoga);
 
app.listen(port, () => {
  console.log(`Running a GraphQL API server at http://localhost:${port}/graphql`);
});
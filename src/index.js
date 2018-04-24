'use strict';
const { GraphQLServer } = require('graphql-yoga');
const { Prisma } = require('prisma-binding');
const Query = require('./resolvers/Query');
const Mutation = require('./resolvers/Mutation');
const AuthPayload = require('./resolvers/AuthPayload');

const resolvers = {
  Query,
  Mutation,
  AuthPayload
};

const server = new GraphQLServer({
  typeDefs: './src/schema.graphql',
  resolvers,
  context: req => ({
    ...req,
    db: new Prisma({
      typeDefs: 'src/generated/prisma.graphql',
      endpoint:
        'https://us1.prisma.sh/public-bluetoucan-736/hackernews-graph-node/dev',
      secret: 'something-super-secret',
      debug: true
    })
  })
});
server.start(() => console.log('Server is running on localhost:4000'));

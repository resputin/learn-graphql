'use strict';
const { GraphQLServer } = require('graphql-yoga');
const { Prisma } = require('prisma-binding');

const resolvers = {
  Query: {
    info: () => 'This is the API for a Hackernews Clone',
    feed: (root, args, context, info) => {
      return context.db.query.links({}, info);
    },
    link: (root, args, context, info) => {
      return context.db.query.link({data: {
        id: args.id
      }}, info)
    }
  },
  Mutation: {
    post: (root, args, context, info) => {
      return context.db.mutation.createLink({
        data: {
          url: args.url,
          description: args.description
        }
      }, info);
    },
    updateLink: (root, args, context, info) => {
      const params = {
        data: Object.assign({}, args),
        where: { id: args.id }
      }
      delete params.data.id;
      return context.db.mutation.updateLink(params, info)
    },
    deleteLink: (root, args, context, info) => {
      return context.db.mutation.deleteLink({
        where: {
          id: args.id
        }
      });
    }
  }
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
        debug: true,
    }),
  }),
});
server.start(() => console.log('Server is running on localhost:4000'));
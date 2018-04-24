'use strict';
async function feed(root, args, context, info) {
  const where = args.filter
    ? {
        OR: [
          { url_contains: args.filter },
          { description_contains: args.filter }
        ]
      }
    : {};

  const queriedLinks = await context.db.query.links(
    { where, skip: args.skip, first: args.first, orderBy: args.orderBy },
    '{ id }'
  );

  const countSelectionSet = `{
      aggregate {
        count
      }
    }`;

  const linksConnection = await context.db.query.linksConnection(
    {},
    countSelectionSet
  );

  return {
    count: linksConnection.aggregate.count,
    linksId: queriedLinks.map(link => link.id)
  };
}

function link(root, args, context, info) {
  return context.db.query.link(
    {
      data: {
        id: args.id
      }
    },
    info
  );
}

module.exports = {
  link,
  feed
};

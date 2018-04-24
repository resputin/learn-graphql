'use strict';
function feed(root, args, context, info) {
  return context.db.query.links({}, info);
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
  link, feed
};

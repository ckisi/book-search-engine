const { User } = require("../models");

const resolvers = {
  Query: {
    user: async () => {
      User.find({});
    },
    books: async () => {
      // get books here
    }
  },
}

module.exports = resolvers;

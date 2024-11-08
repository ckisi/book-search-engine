const { User } = require('../models');
const { signToken } = require('../utils/auth');

const resolvers = {
  
  // queries for getting
  Query: {
    async getSingleUser(_, { id, username }) {
      const foundUser = await User.findOne({
        $or: [{ _id: id }, { username }],
      });

      if (!foundUser) {
        throw new Error('Cannot find user with this id');
      }

      return foundUser;
    },
    async me(_, __, context) {
      if (context.user) {
        const foundUser = await User.findById(context.user._id);
        return foundUser;
      }
      throw new Error('Not logged in');
    },
  },

  // mutations for posting and deleting
  Mutation: {
    // login user
    async login(_, { username, email, password }) {
      const user = await User.findOne({ $or: [{ username }, { email }] });
      if (!user) {
        throw new Error("Cannot find user");
      }

      const correctPw = await user.isCorrectPassword(password);
      if (!correctPw) {
        throw new Error('Wrong password');
      }
      const token = signToken(user);
      return { token, user };
    },
    // add a user
    async addUser(_, { username, email, password }) {
      const user = await User.create({ username, email, password });

      if (!user) {
        throw new Error('Cannot find user');
      }
      const token = signToken(user);
      return { token, user };
    },
    // save book to user
    async saveBook(_, { bookId, authors, description, title, image, link }, context) {
      if (context.user) {
        const updatedUser = await User.findOneAndUpdate(
          { _id: context.user._id },
          { $addToSet: { savedBooks: { bookId, authors, description, title, image, link } } },
          { new: true, runValidators: true }
        );
        return updatedUser;
      }
      throw new Error('Not logged in');
    },
    // remove book from user
    async removeBook(_, { bookId }, context) {
      if (context.user) {
        const updatedUser = await User.findOneAndUpdate(
          { _id: context.user._id },
          { $pull: { savedBooks: { bookId } } },
          { new: true }
        );
        if (!updatedUser) {
          throw new Error("Cannot find user with this id");
        }
        return updatedUser;
      }
      throw new Error('Not logged in');
    },
  },
};

module.exports = resolvers;

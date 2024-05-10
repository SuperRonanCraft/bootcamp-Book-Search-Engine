const { User } = require('../models');
const { signToken, AuthenticationError } = require('../utils/auth');

const resolvers = {
  //Queries
  Query: {
    me: async (parent, { userId }) => {
      return User.findById(userId);
    },
  },

  //Mutations done to our data
  Mutation: {
    //Login
    login: async (parent, { email, password }) => {
      const user = await User.findOne({ email });

      if (!user) {
        throw AuthenticationError;
      }

      const correctPw = await user.isCorrectPassword(password);

      if (!correctPw) {
        throw AuthenticationError;
      }

      const token = signToken(user);
      return { token, user };
    },

    //Add User
    addUser: async (parent, { username, email, password }) => {
      console.log(username, email, password);
      const user = await User.create({ username, email, password });
      const token = signToken(user);

      return { token, user };
    },

    //Save a book
    saveBook: async (
      parent,
      { authors, description, title, bookId, image, link, userId }
    ) => {
      const user = await User.findByIdAndUpdate(
        userId,
        {
          $addToSet: {
            savedBooks: { authors, description, title, bookId, image, link },
          },
        },
        {
          new: true,
          runValidators: true,
        }
      );
      console.log(user);
      return user;
    },

    //Remove a book
    removeBook: async (parent, { bookId, userId }) => {
      const user = await User.findByIdAndUpdate(userId, {
        $pull: {
          savedBooks: { bookId },
        },
      });
      return user;
    },
  },
};

module.exports = resolvers;

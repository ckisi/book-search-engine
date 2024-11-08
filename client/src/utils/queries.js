import { gql } from "@apollo/client";

// gets current user
export const GET_ME = gql`
  query Me {
    me {
      _id
      email
      savedBooks {
        authors
        bookId
        description
        image
        link
        title
      }
      username
    }
  }
`;

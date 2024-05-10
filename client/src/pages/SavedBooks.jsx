import { Container, Card, Button, Row, Col } from 'react-bootstrap';

//import { getMe, deleteBook } from '../utils/API';
import Auth from '../utils/auth';
import { GET_ME } from '../utils/queries';
import { useMutation, useQuery } from '@apollo/client';
import { REMOVE_BOOK } from '../utils/mutations';
import { removeBookId } from '../utils/localStorage';
import Book from '../components/Book';

const SavedBooks = () => {
  //const [userData, setUserData] = useState({});
  const [removeBook] = useMutation(REMOVE_BOOK, {
    refetchQueries: [GET_ME, 'me'],
  });

  //const userDataLength = Object.keys(userData).length;
  const {
    data: { _id },
  } = Auth.getProfile();

  const { loading, data } = useQuery(GET_ME, {
    variables: { userId: _id },
  });

  // if data isn't here yet, say so
  if (loading) {
    return <h2>LOADING...</h2>;
  }

  const userData = data.me;

  // create function that accepts the book's mongo _id value as param and deletes the book from the database
  const handleDeleteBook = async (bookId) => {
    const token = Auth.loggedIn() ? Auth.getToken() : null;

    if (!token) {
      return false;
    }

    try {
      //const response = await deleteBook(bookId, token);
      const {
        data: { _id: userId },
      } = Auth.getProfile();
      console.log(bookId);

      await removeBook({ variables: { bookId, userId } });

      // upon success, remove book's id from localStorage
      removeBookId(bookId);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <div className="text-light bg-dark p-5">
        <Container fluid>
          <h1>Viewing saved books!</h1>
        </Container>
      </div>
      <Container>
        <h2 className="pt-5">
          {userData.savedBooks.length
            ? `Viewing ${userData.savedBooks.length} saved ${
                userData.savedBooks.length === 1 ? 'book' : 'books'
              }:`
            : 'You have no saved books!'}
        </h2>
        <Row>
          {userData.savedBooks.map((book, index) => {
            return (
              <Book
                key={index}
                book={book}
                handleDeleteBook={handleDeleteBook}
              />
            );
          })}
        </Row>
      </Container>
    </>
  );
};

export default SavedBooks;

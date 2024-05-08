import { Col, Button, Card } from 'react-bootstrap';
import Auth from '../utils/auth';

export default function Book({
  book,
  savedBookIds,
  handleSaveBook,
  handleDeleteBook,
}) {
  return (
    <Col md="3" key={book.bookId} className="my-2">
      <Card border="dark">
        {book.image ? (
          <Card.Img
            src={book.image}
            alt={`The cover for ${book.title}`}
            variant="top"
          />
        ) : null}
        <Card.Body>
          <Card.Title>{book.title}</Card.Title>
          <p className="small">Authors: {book.authors}</p>
          <Card.Text>
            {book.description ? trimDesc(book.description) : ''}
          </Card.Text>
          {handleSaveBook ? (
            Auth.loggedIn() && (
              <Button
                disabled={savedBookIds?.some(
                  (savedBookId) => savedBookId === book.bookId
                )}
                className="btn-block btn-info"
                onClick={() => handleSaveBook(book.bookId)}
              >
                {savedBookIds?.some(
                  (savedBookId) => savedBookId === book.bookId
                )
                  ? 'This book has been saved!'
                  : 'Save this Book!'}
              </Button>
            )
          ) : (
            <Button
              className="btn-block btn-danger"
              onClick={() => handleDeleteBook(book.bookId)}
            >
              Delete this Book!
            </Button>
          )}
        </Card.Body>
      </Card>
    </Col>
  );
}

function trimDesc(string) {
  const length = 256;
  return string.length > length
    ? string.substring(0, length - 3) + '...'
    : string;
}

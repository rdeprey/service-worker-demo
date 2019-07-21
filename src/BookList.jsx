import React, { useState, useRef, useEffect } from 'react';
import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firebase-messaging';
import 'firebase/firestore';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import TextField from '@material-ui/core/TextField';

export default function BookList() {
  const [bookList, setBookList] = useState([]);
  const newBook = useRef(null);

  useEffect(() => {
    getBookList().then((bookList) => {
      setBookList(bookList);
    }).catch(err => {
      console.log('Couldn\'t get book list: ' + err);
    });
  }, []);

  const getBookList = async () => {
      const snapshot = await firebase.firestore().collection('books').get();
      const books = snapshot.docs.map(doc => doc.data());
      const bookList = books.map((book, key) => 
        <ListItem key={key}>
          <ListItemText primary={book.title} />
        </ListItem>
      );
      return bookList;
    }

  const addBook = async (event) => {
      const bookTitle = newBook.current.value;
      await firebase.firestore().collection('books').doc(bookTitle).set({
        id: bookList.length + 1,
        title: bookTitle
      }).then(async () => {
        const bookList = await getBookList();
        setBookList(bookList);
        newBook.current.value = '';
      }).catch(err => {
        console.log('There was an error adding the book.');
      });
    }

    return (
        <div>
            <form action="#">
            <TextField
                id="input-title"
                label="Book Title"
                variant="outlined"
                margin="dense"
                inputRef={newBook}
            />
            <button type="submit" id="add-book" onClick={addBook}>Add book</button>
        </form>

        <div className="bookList">
            <List>
            {bookList}
            </List>
        </div>
      </div>
    );
}
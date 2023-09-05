import React, { useState, useRef, useEffect, useCallback } from 'react';
import 'firebase/auth';
import 'firebase/messaging';
import 'firebase/firestore';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import TextField from '@material-ui/core/TextField';
import { firestore } from '.';
import { collection, doc, getDocs, setDoc } from 'firebase/firestore';

export default function BookList() {
  const booksCollectionRef = collection(firestore, 'books');
  const [bookList, setBookList] = useState([]);
  const newBook = useRef(null);

  const getBookList = useCallback(async () => {
    const snapshot = await getDocs(booksCollectionRef);
    const bookList = [];
    snapshot.forEach((doc) => {
      const { id, title } = doc.data();
      bookList.push(
        <ListItem key={id}>
          <ListItemText primary={title} />
        </ListItem>
      );
    });
    return bookList;
  }, [booksCollectionRef]);

  useEffect(() => {
    getBookList()
      .then((bookList) => {
        setBookList(bookList);
      })
      .catch((err) => {
        console.log("Couldn't get book list: " + err);
      });
  }, []);

  const addBook = (event) => {
    const bookTitle = newBook.current.value;
    setDoc(doc(firestore, 'books', bookTitle), {
      id: bookList.length + 1,
      title: bookTitle
    })
      .then(async () => {
        const bookList = await getBookList();
        setBookList(bookList);
        newBook.current.value = '';
      })
      .catch((err) => {
        console.log('There was an error adding the book.');
      });
  };

  return (
    <div>
      <form action='#'>
        <TextField
          id='input-title'
          label='Book Title'
          variant='outlined'
          margin='dense'
          inputRef={newBook}
        />
        <button type='submit' id='add-book' onClick={addBook}>
          Add book
        </button>
      </form>

      <div className='bookList'>
        <List>{bookList}</List>
      </div>
    </div>
  );
}

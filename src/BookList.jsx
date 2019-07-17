import React from 'react';
import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firebase-messaging';
import 'firebase/firestore';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import TextField from '@material-ui/core/TextField';
import PlusIcon from '@material-ui/icons/Add';

export default class BookList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            bookList: []
        };
        this.newBook = React.createRef();
    }

    componentDidMount() {
        this.getBookList().then((bookList) => {
          this.setState({
            bookList: bookList,
          });
        }).catch(err => {
          console.log('Couldn\'t get book list: ' + err);
        });
      }

    getBookList = async () => {
        const snapshot = await firebase.firestore().collection('books').get();
        const books = snapshot.docs.map(doc => doc.data());
        const bookList = books.map((book, key) => 
         <ListItem key={key}>
           <ListItemText primary={book.title} />
         </ListItem>
        );
        return bookList;
      }

    addBook = async () => {
        const newBook = this.newBook.current.value;
        await firebase.firestore().collection('books').doc(newBook).set({
          id: this.state.bookList.length + 1,
          title: newBook
        }).then(async () => {
          const bookList = await this.getBookList();
          this.setState({
            bookList: bookList
          });
          this.newBook.current.value = '';
        }).catch(err => {
          console.log('There was an error adding the book.');
        });
      }

    render() {
        return (
            <div>
                <form action="#">
                <TextField
                    id="input-title"
                    label="Add a Book"
                    variant="outlined"
                    margin="dense"
                    inputRef={this.newBook}
                />
                <button type="submit" id="add-book" onClick={this.addBook}><PlusIcon /></button>
            </form>

            <div className="bookList">
                <List>
                {this.state.bookList}
                </List>
            </div>
          </div>
        );
    }
}
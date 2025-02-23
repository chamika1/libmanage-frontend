import Table from 'react-bootstrap/Table';
import './Book.css';
import { useEffect,useState } from 'react';
import { GetBook, DeleteBook } from '../service/book/Book';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';

export const Book = ()=>{
     const tHeadings:string [] = [
        "BookId",
        "Title",
        "Publisher",
        "ISBN",
        "Author",
        "Edition",
        "Price",
        "Total Qty",
        "Avl Aty",
        "Last Updated Date",
        "Last Updated Time",
        "Actions"
     ]
     useEffect(()=>{
        //load book data
        const loadData = async ()=>{
           const getAllBooks = await GetBook()
           if (Array.isArray(getAllBooks)) {
               setBooks(getAllBooks)
           } else {
               console.error('Invalid data format received')
               setBooks([])
           }
           console.log("Get All Books",getAllBooks)
        };
        loadData();
    },[])
    interface Book {
        bookId: string;  // Changed to string since the ID comes as UUID
        title: string | null;
        publisher: string;
        isbn: string;
        author: string;
        edition: string;
        price: number | null;
        totalQty: number;
        avilableQty: number;  // Note: API returns "avilableQty" instead of "availableQty"
        lastUpdatedDate: string;
        lastUpdatedTime: string;
    }
    const [books, setBooks] = useState<Book[]>([]);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [bookToDelete, setBookToDelete] = useState<string | null>(null);
    const [editingBookId, setEditingBookId] = useState<string | null>(null);
    const [editedBook, setEditedBook] = useState<Book | null>(null);

    const handleEdit = (book: Book) => {
        setEditingBookId(book.bookId);
        setEditedBook({...book});
    };

    const handleCancelEdit = () => {
        setEditingBookId(null);
        setEditedBook(null);
    };

    const handleSaveEdit = async () => {
        if (editedBook) {
            // TODO: Implement save functionality
            console.log("Saving edited book:", editedBook);
            setEditingBookId(null);
            setEditedBook(null);
        }
    };

    const handleInputChange = (field: keyof Book, value: string | number) => {
        if (editedBook) {
            setEditedBook({
                ...editedBook,
                [field]: value
            });
        }
    };

    const renderTableCell = (book: Book, field: keyof Book) => {
        if (editingBookId === book.bookId && field !== 'bookId') {
            const value = editedBook ? editedBook[field] : book[field];
            
            if (field === 'price' || field === 'totalQty' || field === 'avilableQty') {
                return (
                    <Form.Control
                        type="number"
                        value={value || ''}
                        onChange={(e) => handleInputChange(field, Number(e.target.value))}
                        size="sm"
                    />
                );
            }
            
            return (
                <Form.Control
                    type="text"
                    value={value || ''}
                    onChange={(e) => handleInputChange(field, e.target.value)}
                    size="sm"
                />
            );
        }
        
        return book[field] || '-';
    };

    const handleDeleteClick = (bookId: string) => {
        setBookToDelete(bookId);
        setShowDeleteModal(true);
    };

    const handleDeleteConfirm = async () => {
        if (bookToDelete) {
            try {
                const isDeleted = await DeleteBook(bookToDelete);
                if (isDeleted) {
                    setBooks(prevBooks => prevBooks.filter(book => book.bookId !== bookToDelete));
                } else {
                    alert('Could not delete the book. Please try again.');
                }
            } catch (err) {
                console.error("Delete failed:", err);
                alert('Failed to delete book. Please try again.');
            }
        }
        setShowDeleteModal(false);
        setBookToDelete(null);
    };

    const handleDeleteCancel = () => {
        setShowDeleteModal(false);
        setBookToDelete(null);
    };

     return(
         <>
         <div className="table-wrapper">
            <Table striped bordered hover>
                <thead>
                    <tr>
                        {tHeadings.map((heading, index) => (
                            <th key={index}>{heading}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {books.map((book) => (
                        <tr key={book.bookId}>
                            <td>{book.bookId}</td>
                            <td>{renderTableCell(book, 'title')}</td>
                            <td>{renderTableCell(book, 'publisher')}</td>
                            <td>{renderTableCell(book, 'isbn')}</td>
                            <td>{renderTableCell(book, 'author')}</td>
                            <td>{renderTableCell(book, 'edition')}</td>
                            <td>{renderTableCell(book, 'price')}</td>
                            <td>{renderTableCell(book, 'totalQty')}</td>
                            <td>{renderTableCell(book, 'avilableQty')}</td>
                            <td>{renderTableCell(book, 'lastUpdatedDate')}</td>
                            <td>{renderTableCell(book, 'lastUpdatedTime')}</td>
                            <td>
                                {editingBookId === book.bookId ? (
                                    <>
                                        <Button 
                                            variant="success" 
                                            size="sm" 
                                            className="edit-btn"
                                            onClick={handleSaveEdit}
                                        >
                                            Save
                                        </Button>
                                        <Button 
                                            variant="secondary" 
                                            size="sm"
                                            className="delete-btn"
                                            onClick={handleCancelEdit}
                                        >
                                            Cancel
                                        </Button>
                                    </>
                                ) : (
                                    <>
                                        <Button 
                                            variant="outline-primary" 
                                            size="sm" 
                                            className="edit-btn"
                                            onClick={() => handleEdit(book)}
                                        >
                                            Edit
                                        </Button>
                                        <Button 
                                            variant="outline-danger" 
                                            size="sm"
                                            className="delete-btn"
                                            onClick={() => handleDeleteClick(book.bookId)}
                                        >
                                            Delete
                                        </Button>
                                    </>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
         </div>

         {/* Delete Confirmation Modal */}
         <Modal show={showDeleteModal} onHide={handleDeleteCancel}>
             <Modal.Header closeButton>
                 <Modal.Title>Confirm Delete</Modal.Title>
             </Modal.Header>
             <Modal.Body>
                 Are you sure you want to delete this book?
             </Modal.Body>
             <Modal.Footer>
                 <Button variant="secondary" onClick={handleDeleteCancel}>
                     Cancel
                 </Button>
                 <Button variant="danger" onClick={handleDeleteConfirm}>
                     Delete
                 </Button>
             </Modal.Footer>
         </Modal>
         </>
     )
}
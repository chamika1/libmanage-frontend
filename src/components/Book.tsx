import Table from 'react-bootstrap/Table';
import './Book.css';
import { useEffect,useState } from 'react';
import { GetBook, DeleteBook, UpdateBook } from '../service/book/Book';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import { Background } from './Background';

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
    const [editingBook, setEditingBook] = useState<Book | null>(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [showAlertModal, setShowAlertModal] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [alertType, setAlertType] = useState<'success' | 'error'>('success');
    const [showDeleteSuccessModal, setShowDeleteSuccessModal] = useState(false);

    const handleEditClick = (book: Book) => {
        setEditingBook({ ...book });
        setShowEditModal(true);
    };

    const handleEditChange = (field: keyof Book, value: any) => {
        if (editingBook) {
            setEditingBook({
                ...editingBook,
                [field]: value
            });
        }
    };

    const handleEditSave = async () => {
        if (editingBook) {
            setShowEditModal(false);  // Hide edit form first
            setShowConfirmModal(true); // Then show confirmation modal
        }
    };

    const handleEditCancel = () => {
        setShowEditModal(false);
        setEditingBook(null);
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
                    setShowDeleteModal(false);
                    setBookToDelete(null);
                    setShowDeleteSuccessModal(true);
                }
            } catch (err) {
                console.error("Delete failed:", err);
                alert('Failed to delete book. Please try again.');
            }
        }
    };

    const handleDeleteCancel = () => {
        setShowDeleteModal(false);
        setBookToDelete(null);
    };

    const handleConfirmEdit = async () => {
        try {
            const success = await UpdateBook(editingBook!.bookId, editingBook);
            if (success) {
                setBooks(books.map(book => 
                    book.bookId === editingBook!.bookId ? editingBook! : book
                ));
                setEditingBook(null);
                setAlertType('success');
                setAlertMessage('Book updated successfully!');
                setShowAlertModal(true);
            } else {
                setAlertType('error');
                setAlertMessage('Failed to update book. Please try again.');
                setShowAlertModal(true);
            }
        } catch (error) {
            console.error('Error updating book:', error);
            setAlertType('error');
            setAlertMessage('Failed to update book. Please try again.');
            setShowAlertModal(true);
        }
        setShowConfirmModal(false);
    };

     return(
         <>
         <Background />
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
                            <td>{book.title || '-'}</td>
                            <td>{book.publisher}</td>
                            <td>{book.isbn}</td>
                            <td>{book.author}</td>
                            <td>{book.edition}</td>
                            <td>{book.price || '-'}</td>
                            <td>{book.totalQty}</td>
                            <td>{book.avilableQty}</td>
                            <td>{book.lastUpdatedDate}</td>
                            <td>{book.lastUpdatedTime}</td>
                            <td>
                                <Button 
                                    variant="outline-primary" 
                                    size="sm" 
                                    className="edit-btn"
                                    onClick={() => handleEditClick(book)}
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
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
         </div>

         {/* Edit Modal */}
         <Modal show={showEditModal} onHide={handleEditCancel}>
             <Modal.Header closeButton>
                 <Modal.Title>Edit Book</Modal.Title>
             </Modal.Header>
             <Modal.Body>
                 {editingBook && (
                     <Form>
                         <Form.Group className="mb-3">
                             <Form.Label>Title</Form.Label>
                             <Form.Control
                                 type="text"
                                 value={editingBook.title || ''}
                                 onChange={(e) => handleEditChange('title', e.target.value)}
                             />
                         </Form.Group>
                         <Form.Group className="mb-3">
                             <Form.Label>Publisher</Form.Label>
                             <Form.Control
                                 type="text"
                                 value={editingBook.publisher}
                                 onChange={(e) => handleEditChange('publisher', e.target.value)}
                             />
                         </Form.Group>
                         <Form.Group className="mb-3">
                             <Form.Label>ISBN</Form.Label>
                             <Form.Control
                                 type="text"
                                 value={editingBook.isbn}
                                 onChange={(e) => handleEditChange('isbn', e.target.value)}
                             />
                         </Form.Group>
                         <Form.Group className="mb-3">
                             <Form.Label>Author</Form.Label>
                             <Form.Control
                                 type="text"
                                 value={editingBook.author}
                                 onChange={(e) => handleEditChange('author', e.target.value)}
                             />
                         </Form.Group>
                         <Form.Group className="mb-3">
                             <Form.Label>Edition</Form.Label>
                             <Form.Control
                                 type="text"
                                 value={editingBook.edition}
                                 onChange={(e) => handleEditChange('edition', e.target.value)}
                             />
                         </Form.Group>
                         <Form.Group className="mb-3">
                             <Form.Label>Price</Form.Label>
                             <Form.Control
                                 type="number"
                                 value={editingBook.price || ''}
                                 onChange={(e) => handleEditChange('price', Number(e.target.value))}
                             />
                         </Form.Group>
                         <Form.Group className="mb-3">
                             <Form.Label>Total Quantity</Form.Label>
                             <Form.Control
                                 type="number"
                                 value={editingBook.totalQty}
                                 onChange={(e) => handleEditChange('totalQty', Number(e.target.value))}
                             />
                         </Form.Group>
                         <Form.Group className="mb-3">
                             <Form.Label>Available Quantity</Form.Label>
                             <Form.Control
                                 type="number"
                                 value={editingBook.avilableQty}
                                 onChange={(e) => handleEditChange('avilableQty', Number(e.target.value))}
                             />
                         </Form.Group>
                     </Form>
                 )}
             </Modal.Body>
             <Modal.Footer>
                 <Button variant="secondary" onClick={handleEditCancel}>
                     Cancel
                 </Button>
                 <Button variant="primary" onClick={handleEditSave}>
                     Save Changes
                 </Button>
             </Modal.Footer>
         </Modal>

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

         {/* Confirmation Modal */}
         <Modal 
             show={showConfirmModal} 
             onHide={() => setShowConfirmModal(false)}
             className="confirm-modal"
             centered
         >
             <Modal.Header closeButton>
                 <Modal.Title>Confirm Changes</Modal.Title>
             </Modal.Header>
             <Modal.Body>
                 Are you sure you want to save these changes?
             </Modal.Body>
             <Modal.Footer>
                 <Button variant="secondary" onClick={() => setShowConfirmModal(false)}>
                     Cancel
                 </Button>
                 <Button variant="primary" onClick={handleConfirmEdit}>
                     Save Changes
                 </Button>
             </Modal.Footer>
         </Modal>

         {/* Alert Modal */}
         <Modal show={showAlertModal} onHide={() => setShowAlertModal(false)}>
             <Modal.Header closeButton className={alertType === 'success' ? 'alert-success' : 'alert-danger'}>
                 <Modal.Title>{alertType === 'success' ? 'Success' : 'Error'}</Modal.Title>
             </Modal.Header>
             <Modal.Body>
                 {alertType === 'success' && (
                     <div className="success-icon">
                         <svg viewBox="0 0 24 24">
                             <path d="M4.1 12.7L9 17.6 20.3 6.3" fill="none" stroke="currentColor" strokeWidth="2"/>
                         </svg>
                     </div>
                 )}
                 <p>{alertMessage}</p>
             </Modal.Body>
             <Modal.Footer>
                 <Button 
                     variant={alertType === 'success' ? 'success' : 'danger'} 
                     onClick={() => setShowAlertModal(false)}
                 >
                     Close
                 </Button>
             </Modal.Footer>
         </Modal>

         {/* Delete Success Modal */}
         <Modal show={showDeleteSuccessModal} onHide={() => setShowDeleteSuccessModal(false)}>
             <Modal.Header closeButton className="alert-danger">
                 <Modal.Title>Success</Modal.Title>
             </Modal.Header>
             <Modal.Body>
                 <div className="success-icon delete-success">
                     <svg viewBox="0 0 24 24">
                         <path d="M4.1 12.7L9 17.6 20.3 6.3" fill="none" stroke="currentColor" strokeWidth="2"/>
                     </svg>
                 </div>
                 <p>Book deleted successfully!</p>
             </Modal.Body>
             <Modal.Footer>
                 <Button 
                     variant="danger" 
                     onClick={() => setShowDeleteSuccessModal(false)}
                 >
                     Close
                 </Button>
             </Modal.Footer>
         </Modal>
         </>
     )
}
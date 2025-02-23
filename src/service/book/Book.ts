import axios from 'axios';

const BASE_URL = 'http://127.0.0.1:8075/libmgmt/api/v1/books';

export const GetBook = async () => {
    try {
        const response = await axios.get(`${BASE_URL}/getall`);
        return response.data;
    }
    catch(error) {
        if (axios.isAxiosError(error)) {
            console.error('Error fetching books:', error.response?.data || error.message);
        } else {
            console.error('Error fetching books:', error);
        }
        return []; // Return empty array to prevent undefined errors
    }
}

export const DeleteBook = async (bookId: string) => {
    try {
        const response = await axios.delete(`${BASE_URL}/${bookId}`);
        if (response.status === 204 || response.status === 200) {
            return true; // Successfully deleted
        }
        return false;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error('Error deleting book:', error.response?.data || error.message);
        } else {
            console.error('Error deleting book:', error);
        }
        throw error;
    }
}

export const UpdateBook = async (bookId: string, book: any) => {
    try {
        const response = await axios.patch(`${BASE_URL}?bookId=${bookId}`, book);
        if (response.status === 204) {
            console.log("Book updated successfully");
            return true;
        }
        return false;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error('Error updating book:', error.response?.data || error.message);
        } else {
            console.error('Error updating book:', error);
        }
        throw error;
    }
}


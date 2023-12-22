import { nanoid } from 'nanoid'
import { books } from './books.js'

export const addBookHandler = (request, h) => {
    const { name, year, author, summary, publisher, pageCount, readPage, reading } = request.payload

    if (!name) {
        const response = h.response({
            "status": "fail",
            "message": "Gagal menambahkan buku. Mohon isi nama buku"
        })
        response.code(400)

        return response
    }

    if (pageCount < readPage) {
        const response = h.response({
            "status": "fail",
            "message": "Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount"
        })
        response.code(400)

        return response
    }

    const id = nanoid(16)
    const insertedAt = new Date().toISOString()
    const updatedAt = insertedAt
    const finished = (pageCount === readPage)
    const newBook = {
        id, name, year, author, summary, publisher, pageCount, readPage, finished, reading, insertedAt, updatedAt
    }

    books.push(newBook)

    const success = books.filter((book) => book.id === id).length > 0

    if (success) {
        const response = h.response({
            "status": "success",
            "message": "Buku berhasil ditambahkan",
            "data": {
                "bookId": id
            }
        })
        response.code(201)

        return response
    }

    const response = h.response({
        status: 'fail',
        message: 'Buku gagal ditambahkan',
    });
    response.code(500);

    return response;
}

export const getAllBooksHandler = (request, h) => {

    const { name, reading, finished } = request.query

    if (!name && !reading && !finished) {
        const response = h.response({
            status: "success",
            data: {
                books: books.map((book) => ({
                    id: book.id, name: book.name, publisher: book.publisher,
                })),
            },
        });
        response.code(200);
        return response;
    }

    if (name) {
        const filteredBooksName = books.filter((book) => {
            const nameRegex = new RegExp(name, "gi");
            return nameRegex.test(book.name);
        });
        const response = h.response({
            status: "success",
            data: {
                books: filteredBooksName.map((book) => ({
                    id: book.id, name: book.name, publisher: book.publisher,
                })),
            },
        });
        response.code(200);
        return response;
    }

    if (reading) {
        const filteredBooksReading = books.filter((book) => Number(book.reading) === Number(reading),);
        const response = h.response({
            status: "success",
            data: {
                books: filteredBooksReading.map((book) => ({
                    id: book.id, name: book.name, publisher: book.publisher,
                })),
            },
        });
        response.code(200);
        return response;
    }

    const filteredBooksFinished = books.filter((book) => Number(book.finished) === Number(finished),);

    const response = h.response({
        status: "success",
        data: {
            books: filteredBooksFinished.map((book) => ({
                id: book.id, name: book.name, publisher: book.publisher,
            })),
        },
    });
    response.code(200);
    return response;
}

export const getBookByIdHandler = (request, h) => {
    const { id } = request.params
    const book = books.filter((book) => book.id === id)[0]

    if (book !== undefined) {
        return {
            status: 'success',
            data: {
                book,
            },
        };
    }

    const response = h.response({
        status: 'fail',
        message: 'Buku tidak ditemukan',
    });
    response.code(404)
    return response
};

export const editBookByIdHandler = (request, h) => {
    const { id } = request.params
    const { name, year, author, summary, publisher, pageCount, readPage, reading } = request.payload

    if (!name) {
        const response = h.response({
            status: 'fail',
            message: 'Gagal memperbarui buku. Mohon isi nama buku',
        });
        response.code(400)

        return response;
    }

    if (pageCount < readPage) {
        const response = h.response({
            "status": "fail",
            "message": "Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount"
        })
        response.code(400)

        return response
    }

    const finished = (pageCount === readPage)
    const updatedAt = new Date().toISOString()
    const index = books.findIndex((book) => book.id === id)

    if (index !== -1) {
        books[index] = {
            ...books[index], name, year, author, summary, publisher, pageCount, readPage, finished, reading, updatedAt,
        };

        const response = h.response({
            status: 'success',
            message: 'Buku berhasil diperbarui',
        });
        response.code(200);
        return response;
    }

    const response = h.response({
        status: 'fail',
        message: 'Gagal memperbarui buku. Id tidak ditemukan',
    });
    response.code(404);
    return response;

}

export const deleteBookByIdHandler = (request, h) => {
    const { id } = request.params;

    const index = books.findIndex((book) => book.id === id);

    if (index !== -1) {
        books.splice(index, 1);
        const response = h.response({
            status: 'success',
            message: 'Buku berhasil dihapus',
        });
        response.code(200);
        return response;
    }

    const response = h.response({
        status: 'fail',
        message: 'Buku gagal dihapus. Id tidak ditemukan',
    });
    response.code(404);
    return response;
}

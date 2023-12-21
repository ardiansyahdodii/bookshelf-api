import { nanoid } from "nanoid";

const books = []

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
                "bookId": "1L7ZtDUFeGs7VlEt"
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

    const response = h.response({
        status: 'success',
        data: {
            books: books.map((book) => ({
                id: book.id,
                name: book.name,
                publisher: book.publisher
            }))
        }
    })

    response.code(200)

    return response
}

export const getBookByIdHandler = (request, h) => {
    const { id } = request.params

    const book = books.filter((book) => book.id === id)[0];

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
    response.code(404);
    return response;
};

export const editBookByIdHandler = (request, h) => {
    const { id } = request.params
    const { name, year, author, summary, publisher, pageCount, readPage, reading } = request.payload
    const updatedAt = new Date().toISOString();
    const index = books.findIndex((book) => book.id === id);

    if (index !== -1) {

        if (!name) {
            const response = h.response({
                status: 'fail',
                message: 'Gagal memperbarui buku. Mohon isi nama buku',
            });
            response.code(400);

            return response;
        }

        if (pageCount < readPage) {
            const response = h.response({
                "status": "fail",
                "message": "Gagal meperbarui buku. readPage tidak boleh lebih besar dari pageCount"
            })
            response.code(400)

            return response
        }

        books[index] = {
            ...books[index], name, year, author, summary, publisher, pageCount, readPage, reading, updatedAt,
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
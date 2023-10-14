const express = require("express");
const fileMulter = require("../middleware/file");
const { v4: uuid } = require("uuid");
const axios = require("axios");

const router = express.Router();

class Book {
  constructor(
    title = "",
    description = "",
    authors = "",
    favorite = "",
    fileCover = "",
    fileName = "",
    fileBook = ""
    // id = uuid()
  ) {
    this.title = title;
    this.description = description;
    this.authors = authors;
    this.favorite = favorite;
    this.fileCover = fileCover;
    this.fileName = fileName;
    this.fileBook = fileBook;
    this.id = this.title + "-" + this.description;
  }
}

const bookStorage = {
  book: []
};

const newBook1 = new Book(
  (title = "Best book"),
  (description = "Book about programming"),
  (authors = "Secret information"),
  (favorite = "Prohibited"),
  (fileCover = "No need"),
  (fileName = "Universe"),
  (fileBook = ""),
  (id = "Best book-Book about programming")
);
const newBook2 = new Book(
  (title = "Worst book"),
  (description = "Book about nothing"),
  (authors = "Secret information"),
  (favorite = "Very common"),
  (fileCover = "No need"),
  (fileName = "Ground"),
  (fileBook = ""),
  (id = "Worst book-Book about nothing")
);

bookStorage.book.push(newBook1);
bookStorage.book.push(newBook2);

router.get("/", (req, res) => {
  const { book } = bookStorage;
  res.render("books/index", {
    title: "Books",
    books: book
  });
});

router.get("/create", (req, res) => {
  const { book } = bookStorage;
  res.render("books/create", {
    title: "Book create",
    books: book
  });
});

router.post("/create", fileMulter.single("fileBook"), (req, res) => {
  const { book } = bookStorage;

  const {
    title,
    description,
    authors,
    favorite,
    fileCover,
    fileName,
    fileBook
  } = req.body;
  const newBook = new Book(
    title,
    description,
    authors,
    favorite,
    fileCover,
    fileName,
    fileBook
  );
  book.push(newBook);
  res.redirect("/api/books");
});

router.get("/:id", (req, res) => {
  const { book } = bookStorage;

  const { id } = req.params;
  const idx = book.findIndex((el) => el.id === id);

  if (idx !== -1) {
    axios
      .get(`http://counter:3001/counter/:${id}`)
      .then((response) => {
        res.render("books/view", {
          title: "Book view",
          books: book[idx],
          views: response
        });
      })
      .catch((err) => {
        console.error(err);
      });

    axios.post(`http://counter:3001/counter/:${id}/incr`);
  } else {
    res.status(404).json({ errcode: 404, errmsg: "Cтраница не найдена" });
  }
});

router.get("/update/:id", (req, res) => {
  const { book } = bookStorage;

  const { id } = req.params;
  const idx = book.findIndex((el) => el.id === id);

  if (idx !== -1) {
    res.render("books/update", {
      title: "Book update",
      books: book[idx]
    });
  } else {
    res.status(404).json({ errcode: 404, errmsg: "Cтраница не найдена" });
  }
});

router.post("/update/:id", fileMulter.single("fileBook"), (req, res) => {
  const { book } = bookStorage;
  const {
    title,
    description,
    authors,
    favorite,
    fileCover,
    fileName,
    fileBook
  } = req.body;

  const { id } = req.params;
  const idx = book.findIndex((el) => el.id === id);

  if (idx !== -1) {
    book[idx] = {
      ...book[idx],
      title,
      description,
      authors,
      favorite,
      fileCover,
      fileName,
      fileBook
    };
    res.redirect(`/api/books/${id}`);
  } else {
    res.status(404).json({ errcode: 404, errmsg: "Cтраница не найдена" });
  }
});

router.put("/:id", fileMulter.single("fileBook"), (req, res) => {
  const { book } = bookStorage;
  const {
    title,
    description,
    authors,
    favorite,
    fileCover,
    fileName
  } = req.body;
  const fileBook = req.file.path;
  const { id } = req.params;
  const idx = book.findIndex((el) => el.id === id);

  if (idx !== -1) {
    book[idx] = {
      ...book[idx],
      title,
      description,
      authors,
      favorite,
      fileCover,
      fileName,
      fileBook
    };
    res.render("books/update", {
      title: "Book | view",
      books: book[idx]
    });
    res.json(book[idx]);
  } else {
    res.status(404).json({ errcode: 404, errmsg: "Cтраница не найдена" });
  }
});

router.get("/:id/download", (req, res) => {
  const { book } = bookStorage;
  const { id } = req.params;
  const idx = book.findIndex((el) => el.id === id);
  if (idx !== -1) {
    res.download(book[idx].fileBook, book[idx].fileName);
  } else {
    res.status(404).json({ errcode: 404, errmsg: "Cтраница не найдена" });
  }
});

router.delete("/:id", (req, res) => {
  const { book } = bookStorage;
  const { id } = req.params;
  const idx = book.findIndex((el) => el.id === id);

  if (idx !== -1) {
    book.splice(idx, 1);
    res.redirect("/book");
  } else {
    res.status(404).json({ errcode: 404, errmsg: "Cтраница не найдена" });
  }
});

router.post("/login", (req, res) => {
  res.status(201);
  res.json({ id: 1, mail: "test@mail.ru" });
});

module.exports = router;

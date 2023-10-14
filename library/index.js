const express = require("express");
const booksRouter = require("./routes/booksRouter");


const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");

app.use("/api/books", booksRouter);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log("Library app is listening on http://localhost:3000/api/books");
  });
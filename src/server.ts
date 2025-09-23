import express from "express";

const app = express();
const PORT = 3000;

app.listen(PORT, () =>
  console.log(`server running on http://localhost: ${PORT}`),
);

// adding a comment to test husky and lint-staged
// adding another comment to test husky and lint-staged

import { config } from 'dotenv';




config({ path: '../.env'});

import app from './app.js'
import { connectDB } from "./config/db.js";



console.log("ENV PORT:", process.env.PORT);

const PORT = process.env.PORT || 5000;

connectDB();

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
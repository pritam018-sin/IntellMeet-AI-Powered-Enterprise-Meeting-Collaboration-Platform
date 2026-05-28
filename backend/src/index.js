import dotenv from 'dotenv';
import connectDB from './config/db.js';
import app from './app.js';

dotenv.config({ path: "../.env" });

connectDB()
    .then(() => {
        app.listen(process.env.PORT || 3000, () => {
            console.log(`✅ Server is running on http://localhost:${process.env.PORT || 3000}`);
        });
    })
    .catch((error) => {
        console.error("❌ Database connection failed:", error);
    });
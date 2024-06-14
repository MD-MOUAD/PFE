import express from 'express';
import cors from 'cors';
import db from './config/db.js';
import authRoutes from './routes/auth.js';
import adminRoutes from './routes/adminRoutes.js';
import fileRoutes from './routes/FileRoutes.js'
import processRoutes from './routes/ChatRoute.js'
import bodyParser from 'body-parser';
import userRoutes from './routes/userRoutes.js'
const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());
app.use(bodyParser.json());

app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/prc', fileRoutes);
app.use('/api/prc', processRoutes);
app.use('/api/user', userRoutes);

db.authenticate()
    .then(() => console.log('Database connected...'))
    .catch(err => console.log('Error: ' + err));

db.sync()
    .then(() => console.log('Database synchronized'))
    .catch(err => console.log('Error: ' + err));

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

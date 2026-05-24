const express      = require('express');
const cors         = require('cors');
const cookieParser = require('cookie-parser');

const authRoutes      = require('./routes/authRoutes');
const userRoutes      = require('./routes/userRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const sharingRoutes   = require('./routes/sharingRoutes');
const documentRoutes  = require('./routes/documentRoutes');

const app = express();

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
}));

app.use(express.json());
app.use(cookieParser());

app.use('/api/auth',      authRoutes);
app.use('/api/users',     userRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/sharing',   sharingRoutes);
app.use('/api/documents', documentRoutes);

// Catch-all for undefined routes — helps debug 404s
app.use((req, res) => {
  res.status(404).json({ message: `Route ${req.method} ${req.path} not found.` });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

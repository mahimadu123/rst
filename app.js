const express = require('express');
const path = require('path');
const sequelize = require('./util/database');

const User = require('./models/user');
const ForgotPasswordRequests = require('./models/forgotPasswordRequest');
const passwordRoutes = require('./routes/passwordRoutes');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Define Database Associations (Many-to-One)
User.hasMany(ForgotPasswordRequests);
ForgotPasswordRequests.belongsTo(User);

// Routes
app.use('/password', passwordRoutes);

// Sync Database and Start Server
sequelize.sync()
  .then(() => {
    app.listen(3000, () => {
      console.log('Server is running on port 3000');
    });
  })
  .catch(err => console.error('Database connection error:', err));
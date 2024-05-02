const mongoose = require('mongoose');

mongoose.connect(process.env.DB_URL, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true }).then(() => {
    console.log('Database connection successful');
}).catch((error) => {
    console.log('Database connection failed');
    console.log(error);
});
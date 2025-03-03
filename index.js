const express = require('express');

const app = express();

app.use(express.json());

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.use('/auth', require('./routes/auth.route'));
app.use('/api', require('./routes/upload.route'));

app.listen(process.env.PORT, () => {
  console.log(`Server is running on http://localhost:${process.env.PORT}`);
});
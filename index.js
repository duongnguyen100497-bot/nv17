require('dotenv').config();

const app = require('./app');

const PORT = process.env.PORT || 12345;

app.listen(PORT, () => {
    console.log('localhost:' + PORT);
})

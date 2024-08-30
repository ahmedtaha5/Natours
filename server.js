const mongoose = require('mongoose');
//START SERVER

const dotenv = require('dotenv');

dotenv.config({ path: './config.env' });

const app = require('./app');

const port = process.env.PORT;
const DB = process.env.DB.replace('<PASSWORD>', process.env.DB_PASSWORD);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
    // useNewCreateIndex: true,
    // createIndexes: true
    //useFindAndModify: false
  })
  .then(() => console.log('DB Connected Successfully'));

// console.log(process.env);

app.listen(port, () => {
  console.log(`Server is running on Port ${port}`);
});

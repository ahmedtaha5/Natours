const mongoose = require('mongoose');
//START SERVER

const dotenv = require('dotenv');

dotenv.config({ path: './config.env' });

const app = require('./app');
//Handling Syncronous ERRORS // UNCAUGHT EXCEPTION;
// process.on('uncaughtException', (err) => {
//   console.log('uncaughtException💣...Shuting Down🤨');
//   console.log(err.name, err.message);
//   process.exit(-1);
// });

const port = process.env.PORT;
const DB = process.env.DB.replace('<PASSWORD>', process.env.DB_PASSWORD);
// mongoose.connect(process.env.DATABASE_LOCAl,{
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

// process.on('unhandeledRejection', (err) => {
//   console.log('Unhandeled Rejection💣...Shuting Down🤨');
//   console.log(err.name, err.message);
//   server.close(() => {
//     process.exit(-1);
//   });
// });

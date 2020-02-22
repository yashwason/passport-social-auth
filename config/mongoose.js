const mongoose = require(`mongoose`);

mongoose.connect(process.env.DB_URL, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useFindAndModify: false,
    dbName: process.env.DB_NAME
})
.then((data) => {
    console.log(`DB connected`);
})
.catch((err) => {
    console.log(`DB not connected`);
    console.log(err);
});
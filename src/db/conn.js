const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/swasthya", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
}).then(() => {
    console.log("DataBAse Connected");
}).catch((err) => {
    console.log(`DataBAse Connect Failed   =====>   ${err}`);
})

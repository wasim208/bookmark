const mongoose = require("mongoose");

mongoose
  .connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MONGODB");
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB: ", err);
  });

module.exports = mongoose;

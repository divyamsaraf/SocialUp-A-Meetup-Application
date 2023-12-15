const mongoose = require("mongoose");

const connect = () => {
  return mongoose.connect(
    "mongodb+srv://divyam:Db123@cluster0.wlknlyz.mongodb.net/?retryWrites=true&w=majority"
  );
};

module.exports = connect;

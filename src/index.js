const express = require("express");
const app = express();
const cors = require("cors");
const picocolors = require("picocolors");
require("dotenv").config();
const port = process.env.PORT || 3000;
app.use(express.json());
app.use(cors());

try {
  
  app.get("/", (req, res) => {
    res.send("Hello World");
  });

  //app.use('/fiscales', auth, fiscalizacionRouter);
  //app.use('/fiscales', auth, controlRouter);
  //


  app.listen(port, () => {
    console.log(picocolors.green(`Server is running on port ${port}`));
    console.log(picocolors.green(`http://127.0.0.1:${port}`));
    console.log(picocolors.green(`http://192.168.1.100:${port}`));
  });
} catch (error) {
  console.log(picocolors.red(`Error: ${error}`));
}


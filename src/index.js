const express = require("express");
const app = express();
const cors = require("cors");
const picocolors = require("picocolors");
const path = require("path");
require("dotenv").config();

const port = process.env.PORT || 3000;

// Configuración de EJS
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "view"));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());


const indexRouter = require("./routes/indexRouter");
const registerRouter = require("./routes/registerRouter");




try {
  
 
  app.use('/', indexRouter);
  app.use('/registro', registerRouter);
  //app.use('/login', auth, authRouter);
  //app.use('/fiscales', auth, fiscalizacionRouter);
  //app.use('/presentismo', auth, controlRouter);
  //app.use('/presentismo', auth, controlRouter);
  //app.use('/presentismo', auth, controlRouter);


  app.listen(port, () => {
    console.log(picocolors.green(`Server is running on port ${port}`));
    console.log(picocolors.green(`http://127.0.0.1:${port}`));
  });
} catch (error) {
  console.log(picocolors.red(`Error: ${error}`));
}


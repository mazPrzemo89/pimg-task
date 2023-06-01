import express from "express";
import 'dotenv/config'
import bodyParser from "body-parser";
import { router as uploadRouter } from './routers/upload'
import { router as downloadRouter } from './routers/download'

const app = express();
app.use(bodyParser.json());

app.use(uploadRouter);
app.use(downloadRouter);
  
app.listen(3000, () => {
    console.log("App listening on port 3000!!")
});
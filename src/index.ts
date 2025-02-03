import express from "express";

import {Client} from 'pg'
const app = express();
app.use(express.json())
const pgClient = new Client("postgresql://neondb_owner:npg_t4lCE5GBVZUF@ep-lucky-mode-a54x24er-pooler.us-east-2.aws.neon.tech/neondb?sslmode=require")
pgClient.connect();

//@ts-ignore
app.post("/signup",async (req,res) => {
   try{
    const username = req.body.username;
    const password = req.body.password;
    const email = req.body.email;
    const response = await pgClient.query(
        "INSERT INTO users (username, email, password) VALUES ($1, $2, $3)", 
        [username, email, password]
      );
      
    res.json({
        message : "you have signed up"
    })
   }
   catch(er){
    res.json({
        message : "error while signing up"
    })
   }


})
app.listen(3001)
import express from "express";

import {Client} from 'pg'
const app = express();
app.use(express.json())
const pgClient = new Client("postgresql://neondb_owner:npg_t4lCE5GBVZUF@ep-lucky-mode-a54x24er-pooler.us-east-2.aws.neon.tech/neondb?sslmode=require")
pgClient.connect();

//@ts-ignore
app.post("/signup",async (req,res) => {
    const username = req.body.username;
    const password = req.body.password;
    const email = req.body.email;
    const city = req.body.city;
    const country = req.body.country;
    const street = req.body.street;
    const pincode = req.body.pincode;
   try{
   


    await pgClient.query("BEGIN;")
    const response = await pgClient.query(
        `INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING id`, 
        [username, email, password]
      );
      const user_id = response.rows[0].id;
      const addressInsertQuery = await pgClient.query(
        `INSERT INTO address (user_id,city,country,street,pincode) VALUES ($1, $2, $3, $4, $5)`, 
        [user_id,city,country,street,pincode]
      );

    await pgClient.query("COMMIT;")
      
    res.json({
        message : "you have signed up"
    })
   }
   catch(er){
    res.json({
        message : "error while signing"
    })
   }


})
app.get("/metadata",async (req,res)=> {
    const id = req.query.id;
    const response1 = await pgClient.query("SELECT username,email,id FROM users WHERE id = $1",[id])
    const response2 = await pgClient.query("SELECT * FROM address WHERE user_id = $1",[id])
    res.json({
        user : response1.rows[0],
        address : response2.rows[0]
    })
}) 
app.get("/better-metadata",async (req,res)=>{
    const id = req.query.id;
    const response = await pgClient.query("SELECT users.id,users.username,users.email,address.city,address.country,address.pincode FROM users JOIN address ON users.id = address.user_id WHERE users.id = $1",[id])
    res.json({
        response : response.rows

    })
})
app.listen(3001)

const express = require("express");
const cors = require('cors');
// var dateFormat = require("dateformat");
const client = require("./db");

const app = express();

// middle ware
app.use(cors());
app.use(express.json());   // req.body()

// get a specific product.
app.get("/products/:id", async(req, res) => {
    try {
        const {id} = req.params;
        client.query("SELECT * FROM `product` WHERE `product_sku` = ?", [id], (err, results)=> {
            if (err) throw err;
            res.json(results[0]);          
        });
        
    } catch (error) {
        console.error(error.message);
    }
})

// get order status.
app.get("/order_status/:id", async(req, res) => {
    try {
        const {id} = req.params;
        client.query("SELECT * FROM `order_status` WHERE `id` = ?", [id], (err, results)=> {
            if (err) throw err;
            res.json(results[0]);          
        });
        
    } catch (error) {
        console.error(error.message);
    }
})

// database connection here. //
async function dbStart() {
    try { 
        await client.connect();
        console.log("DB connected successfully.");
        // await client.query("");

    }
    catch (e) {
        console.error(`The error has occured: ${e}`)
    }
}

app.listen(5000, () => {
    console.log("Server has started on port 5000");
    dbStart();
})
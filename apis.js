
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

// get product in specific price range.
app.get("/products/:item/:price", async(req, res) => {
    try {
        const {item} = req.params;
        const {price} = req.params;
        client.query("SELECT * FROM `product` WHERE LOCATE(?, `product_name`) > 0 and `product_price` < ?", [item, price], (err, results)=> {
            if (err) throw err;
            res.json(results);          
        });
        
    } catch (error) {
        console.error(error.message);
    }
})

// post complains    
app.post("/file_complain", async(req, res) => {
    
    try {
        const email = req.body.email;
        const cn = req.body.cn;
        const msg = req.body.msg;
        const order_n  = req.body.order_n;
        
        let ts = Date.now();
        let date_ob = new Date(ts);
        
        client.query("INSERT INTO product_complaint (name, email, contact_number, message, created_at, product_id) VALUES (?, ?, ?, ? ,?, ?)", ["Null", email, cn, msg, date_ob ,order_n],
        (err, results) => {
            if (err) {
                throw err;
            }
            else {
                res.json({
                    "msg": "complain done successfull",
                    "status" : 200
                });        
            } 
        });

    } catch(error){
        console.log(error);
    }
    
});

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
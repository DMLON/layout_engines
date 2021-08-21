const express = require('express');
const expressLayouts = require('express-ejs-layouts');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Set views folder and engine
app.set('views','./views');
app.set('view engine','ejs');

// ------- express layout config ---------
// Use layouts
app.use(expressLayouts)

// Give Layout file
app.set('layout', './layouts/layoutFrame')

// Throw all scripts to the end of the file
app.set("layout extractScripts", true)


// ------------- End Express Configuration ----------------

// Validation middleware
const validateProduct = require('./middlewares/productValidator');
const {Container} = require('./container'); 
const db = new Container('./products.json');

// main form containing infor for new products
app.get("/", (req, res) => {
    res.render("productsForm");
});

app.get('/products', async (req,res)=>{
    console.log('GET /products');
    products = await db.getAll();
    res.render("productsShow", {
        products,
    });
});

app.post('/products',validateProduct, async (req,res)=>{
    const {title,price,thumbnail} = req.body;
    try{
        const id = await db.save({title:title,price:price,thumbnail:thumbnail})//     // console.log('POST /products');
    }
    catch(error){
        console.log(error);
    }
    console.log("POST /products");
    res.status(301).redirect("/");
});



const PORT = 8080;
app.listen(PORT, (err) => {
    if(err)
        throw new Error(`Error creating server ${err }`);
    console.log(`Server started on ${PORT }`);
});



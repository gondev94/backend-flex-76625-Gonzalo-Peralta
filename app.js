import express from 'express';
import ProductManager from './productManager.js';
import CartManager from './cartManager.js';

const app = express();

const cartManager = new CartManager();

app.use( express.json() );//habilitamos poder recibir json en nuestro servidor - middleware
const productManager = new ProductManager("./products.json"); //instanciamos la clase pasamos la ruta del archivo

app.get("/", (req, res) =>{
    res.send("hola mundo");
});


// productos.

app.get("/api/productos",  async(req, res) =>{
    try {
        const products = await productManager.getProducts();
        res.status(200).json({ message: "Lista de productos", products});
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.delete("/api/productos/:pid", async(req, res) =>{
    try {
        const pid = req.params.pid;
        const products = await productManager.deleteProductById(pid);
        res.status(200).json( {message: "Producto eliminado", products});

    } catch (error) {
        res.status(500).json({ message: error.message });

    }
});

app.post("/api/productos", async(req, res) =>{
    try {
        const newProduct = req.body;
        const products = await productManager.addProduct(newProduct);
        res.status(200).json( {message: "Producto agregado", products} );
    } catch (error) {
        res.status(500).json({ message: error.message });

    }
});

app.put("/api/productos/:pid", async(req, res) =>{
    try {
        const pid = req.params.pid;
        const updates = req.body;
        const products = await productManager.setProductById(pid, updates);
        res.status(200).json( {message: "Producto actualizado", products} );
    } catch (error) {
        res.status(500).json({ message: error.message });

    }
})

//devolver un producto por su id
app.get("/api/productos/:pid", async (req, res) => {
    try {
        const pid = req.params.pid;
        const product = await productManager.getProductById(pid);
        
        if (!product) {
            return res.status(404).json({ message: "Producto no encontrado" });
        }
        
        res.status(200).json({ message: "Producto encontrado", product });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


// carts.

//este metodo crea carrito vacio
app.post("/api/carts", async(req, res) =>{
    const carts = await cartManager.addCart();
    res.status(201).json( {carts, message: 'Nuevo carrito creado'} );
});

//debe listar los productos que pertenecen al carrito
app.get("/api/carts/:cid", async(req, res) =>{
    const cid = req.params.cid;
    const products = await cartManager.getProductsInCartById(cid);
    res.status(200).json({ products, message: "Lista de productos" });

});

//debe agregar productos al carrito indicado
app.post("/api/carts/:cid/product/:pid", async(req, res) =>{
    const cid = req.params.cid;
    const pid = parseInt(req.params.pid);
    const quantity = req.body.quantity;

    const carts = await cartManager.addProductInCart(cid, pid, quantity);
    res.status(200).json({ carts, message: 'Nuevo producto añadido' });
});

app.listen(8081, () => {
    console.log("Servidor iniciado correctamente...")
});

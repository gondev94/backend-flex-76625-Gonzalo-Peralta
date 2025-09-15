import crypto from 'crypto';
import fs from 'fs/promises';

class ProductManager{

    constructor(pathFile){
        this.pathFile = pathFile;

    }

    generateNewId(){
        return crypto.randomUUID();
    }
    
    async addProduct(newProduct){
        try {
            //recuperar los productos
            const fileData = await fs.readFile(this.pathFile, 'utf-8');
            const products = JSON.parse(fileData);

            //agregar el id al producto
            const newId = this.generateNewId();

            //creamos el producto nuevo y lo pusheamos al array de products

            const product = { id: newId, ...newProduct };
            products.push(product);

            // guardar los productos en el archivo
            await fs.writeFile( this.pathFile, JSON.stringify(products, null, 2), 'utf-8');
            return products;
        } catch (error) {
            
        }
    }

    async getProducts(){
        try {
            // recuperamos los productos
            const fileData = await fs.readFile(this.pathFile, 'utf-8');
            const products = JSON.parse(fileData);
            return products; //{ message: `Lista de productos`, products}
        } catch (error) {
            
        }
    }

    async setProductById(productId, updates){
        try {
            const fileData = await fs.readFile(this.pathFile, 'utf-8');
            const products = JSON.parse(fileData);
            //find index para encontrar la posición de donde esta en el array el producto (el indice)

            const indexProduct = products.findIndex( product => product.id === productId );
            if( indexProduct === -1 ) throw new Error("Producto no encontrado");

            products[indexProduct] = { ...products[indexProduct], ...updates };

            // guardar los productos actualizados en el json
            await fs.writeFile( this.pathFile, JSON.stringify(products, null, 2), 'utf-8');
            return products;

        } catch (error) {

        }
    }

    async deleteProductById(productId){
        try {
            //recuperamos los productos
            const fileData = await fs.readFile(this.pathFile, 'utf-8');
            const products = JSON.parse(fileData);

            const filteredProduct = products.filter( product => product.id !== productId);

            //guardamos archivos en el json
            await fs.writeFile( this.pathFile, JSON.stringify(filteredProduct, null, 2), 'utf-8');
            return filteredProduct

        } catch (error) {
            
        }

    }
}

export default ProductManager;
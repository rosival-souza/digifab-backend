import express from 'express';
import dotenv from 'dotenv';
import supplier from './routes/supplier.routes';
import products from './routes/product.routes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use('/api', supplier);
// example use
app.use('/api', products);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`👉 Please access this URL to see the products: http://localhost:3000/api/supplier`);
  console.log('👉 To persist the consumer API data please call the post of this URL: $ curl -X POST http://localhost:3000/api/supplier')
});


// console.log(process.env)
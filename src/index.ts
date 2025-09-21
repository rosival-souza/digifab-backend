import express from 'express';
import dotenv from 'dotenv';
import supplier from './routes/supplier.routes';
import healths from './routes/healths.routes';
import products from './routes/product.routes';
import cors from 'cors';
dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

// ✅ enable CORS
app.use(cors({
  origin: "http://localhost:3000",
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json());
app.use('/api', healths);
app.use('/api', products);
app.use('/api', supplier);


app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`👉 Please access this URL to see the products: http://localhost:4000/api/supplier`);
  console.log('👉 To persist the consumer API data please call the get of this URL: $ curl -X GET http://localhost:4000/api/healths')
});

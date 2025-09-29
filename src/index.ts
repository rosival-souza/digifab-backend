import express from 'express';
import dotenv from 'dotenv';
import auth from './auth/controller/auth.controller'
import healths from './routes/healths.routes';
import dashboard from "./routes/dashboard.routes";
import productionOrder from "./routes/ordemProducao.routes"
import trackability from "./routes/rastreabilidade.route"

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
app.use('/auth', auth)
app.use('/api', healths);
app.use('/api', dashboard);
app.use('/api', productionOrder);
app.use('/api', trackability);


app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`👉 Please access this URL to realize login: http://localhost:${PORT}/auth/google`);
    console.log(`👉 Please access this URL to see the dashboard to orders count: http://localhost:${PORT}/api/dashboard/kpis/orders-count`);
    console.log(`👉 Please access this URL to see the dashboard to planned units: http://localhost:${PORT}/api/dashboard/kpis/planned-units`);
    console.log(`👉 Please access this URL to see the dashboard to raw mp consumed: http://localhost:${PORT}/api/dashboard/kpis/raw-mp-consumed`);
    console.log(`👉 Please access this URL to see the dashboard to served product lots: http://localhost:${PORT}/api/dashboard/kpis/served-product-lots`);
    console.log(`👉 Please access this URL to see the dashboard to line utilization average: http://localhost:${PORT}/api/dashboard/kpis/line-utilization-average`);
    console.log(`👉 Please access this URL to see the dashboard to line utilization simple average: http://localhost:${PORT}/api/dashboard/kpis/line-utilization-simple-average`);
    console.log(`👉 Please access this URL to see the dashboard to daily production by line: http://localhost:${PORT}/api/dashboard/series/daily-production-by-line`);
    console.log(`👉 Please access this URL to see the dashboard to top products: http://localhost:${PORT}/api/dashboard/rankings/top-products`);
    console.log(`👉 Please access this URL to see the dashboard to daily mp consumption: http://localhost:${PORT}/api/dashboard/series/daily-mp-consumption`);
    console.log(`👉 Please access this URL to see the dashboard to mp consumption by type: http://localhost:${PORT}/api/dashboard/aggregates/mp-consumption-by-type`);
    console.log(`👉 Please access this URL to see the dashboard to deviations mp summary: http://localhost:${PORT}/api/dashboard/deviations/mp-summary`);
    console.log(`👉 Please access this URL to see the list of production line: http://localhost:${PORT}/api/order-production/production-line`);
    console.log(`👉 Please access this URL to see the list of product lot: http://localhost:${PORT}/api/order-production/product-lot`);
    console.log(`👉 Please access this URL to see the list of order production: http://localhost:${PORT}/api/order-production`);
    console.log(`👉 Please access this URL to create order production: http://localhost:${PORT}/api/order-production/create`);
    console.log(`👉 Please access this URL to see the detail of order production: http://localhost:${PORT}/api/order-production/:id`);
    console.log(`👉 Please access this URL to see the list of balances by lot of raw material by order production: http://localhost:${PORT}/api/order-production/:id/balances-by-lot-mp`);
    console.log(`👉 Please access this URL to see the consumption pointing detail: http://localhost:${PORT}/api/order-production/:id/consumption-pointing-detail`);
    console.log(`👉 Please access this URL to see the list of consumption items: http://localhost:${PORT}/api/order-production/:id/consumption-items`);
    console.log(`👉 Please access this URL to create a consumption item: http://localhost:${PORT}/api/order-production/:id/consumption-item`);
    console.log(`👉 Please access this URL to see the list of trackability: http://localhost:${PORT}/api/trackability?codigoLoteProduto=`);
    console.log(`👉 To persist the consumer API data please call the get of this URL: $ curl -X GET http://localhost:${PORT}/api/healths`)
});

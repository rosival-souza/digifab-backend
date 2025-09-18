import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();
const RETRY_DELAY_MS = 20_000;

interface SellOrder {
  priceMarket: number;
  quantityCrypto: number;
  quantityCoin: number;
  coinPurchaseTarget: string;
  purchaseValue: number;
  originProcess: string;
  cryptoExchange: string;
  coinOriginPurchase: string;
  priceCoinBRL: number;
  // returnJSON?: any;
  // profitUSDT: number;
  profitBRL: number;
}
interface BuyOrder {
  priceMarket: number;
  quantityCrypto: number;
  quantityCoin: number;
  coinPurchaseTarget: string;
  purchaseValue: number;
  originProcess: string;
  cryptoExchange: string;
  coinOriginPurchase?: string | null;
  priceCoinBRL: number;
  returnJSON?: any;
  status: string;
}
/** digifab**/
async function createConnection() {
  return await mysql.createConnection({
    host: process.env.DB_HOST_MYSQL,
    database: process.env.DB_DATABASE_MYSQL,
    user: process.env.DB_USER_MYSQL,
    password: process.env.DB_PASSWORD_MYSQL,
    port: 3306,
    ssl: {
      rejectUnauthorized: false,
    }
  });
}
async function createConnectionWithRetry(): Promise<mysql.Connection> {

  while (true) {

    try {
      const connection = await mysql.createConnection({
        host: process.env.DB_HOST_MYSQL,
        database: process.env.DB_DATABASE_MYSQL,
        user: process.env.DB_USER_MYSQL,
        password: process.env.DB_PASSWORD_MYSQL,
        port: 3306,
        ssl: {
          rejectUnauthorized: false,
        }
      });

      console.log('✅ Connected to MySQL');
      return connection;

    } catch (error) {

      console.error('❌ Failed to connect to MySQL. Retrying in 20 seconds...', error);

      await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY_MS));

    }
  }

}
export async function getSupplier() {

  const connection = await createConnection();

  let rows: [] = [];

  try {
    const [result] = await connection.execute(
      `
        SELECT * FROM DIGIFAB.FORNECEDOR
      `);
    rows = result as [];

  } catch (error) {
    console.error('❌ Failed to fetch DIGIFAB.FORNECEDOR:', error);
  } finally {
    await connection.end();
  }

  return rows;
}
/** digifab**/
export async function insertBuyOrder(data: BuyOrder) {

  const connection = await createConnection();

  const query = `
    INSERT INTO CRYPTO_PURCHASES (
      PRICE_MARKET,
      QUANTITY_CRYPTO,
      QUANTITY_COIN,
      COIN_PURCHASE_TARGET,
      PURCHASE_VALUE,
      ORIGIN_PROCESS,
      CRYPTO_EXCHANGE,
      COIN_ORIGIN_PURCHASE,
      PRICE_COIN_BRL,
      RETURN_JSON,
      STATUS
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const values = [
    data.priceMarket,
    data.quantityCrypto,
    data.quantityCoin,
    data.coinPurchaseTarget,
    data.purchaseValue,
    data.originProcess,
    data.cryptoExchange,
    data.coinOriginPurchase ?? null,
    data.priceCoinBRL,
    JSON.stringify(data.returnJSON ?? {}),
    data.status ?? null
  ];

  try {
    const [result] = await connection.execute(query, values);
    console.log('✅ Buy order inserted:', result);
  } catch (error) {
    console.error('❌ Failed to insert BUY order:', error);
  } finally {
    await connection.end();
  }
}
export async function getCoinsPurchases() {

  const connection = await createConnection();

  let rows: any[] = [];

  try {
    const [result] = await connection.execute('SELECT * FROM CRYPTO_PURCHASES');
    rows = result as any[];
    console.log(rows);
  } catch (error) {
    console.error('❌ Failed to fetch CRYPTO_PURCHASES:', error);
  } finally {
    await connection.end();
  }

  return rows;
}
export async function insertSellOrder(data: SellOrder) {

  const connection = await createConnection();

  const query = `
    INSERT INTO CRYPTO_SELL (
      PRICE_MARKET,
      QUANTITY_CRYPTO,
      QUANTITY_COIN,
      COIN_PURCHASE_TARGET,
      PURCHASE_VALUE,
      ORIGIN_PROCESS,
      CRYPTO_EXCHANGE,
      COIN_ORIGIN_PURCHASE,
      PRICE_COIN_BRL,
      PROFIT_BRL
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const values = [
    data.priceMarket,
    data.quantityCrypto,
    data.quantityCoin,
    data.coinPurchaseTarget,
    data.purchaseValue,
    data.originProcess,
    data.cryptoExchange,
    data.coinOriginPurchase,
    data.priceCoinBRL,
    data.profitBRL
  ];

  try {
    const [result] = await connection.execute(query, values);
    console.log('✅ Sell order inserted:', result);
  } catch (error) {
    console.error('❌ Failed to insert SELL order:', error);
  } finally {
    await connection.end();
  }
}
export async function updatePurchaseStatus(id: number, status: string) {

  const connection = await createConnection();

  try {
    const query = `
      UPDATE CRYPTO_PURCHASES
      SET STATUS = ?
      WHERE ID = ?
    `;

    const [result] = await connection.execute(query, [status, id]);

    console.log(`✅ Status updated for ID ${id}:`, result);

  } catch (error) {

    console.error(`❌ Failed to update status for ID ${id}:`, error);

  } finally {

    await connection.end();
  }
}
export async function getSellMargin(symbol: string) {

  // const connection = await createConnection();
  const connection = await createConnectionWithRetry();

  let rows: [] = [];

  try {
    const [result] = await connection.execute(`SELECT * FROM PROFIT_SELL WHERE NAME_CRYPTO = '${symbol}' `);

    rows = result as [];

  } catch (error) {
    console.error('❌ Failed to fetch PROFIT_SELL:', error);
  } finally {
    await connection.end();
  }

  return rows;

}
export async function getCryptoTarget(target: string) {

  const connection = await createConnectionWithRetry();

  let rows: [] = [];

  try {
    const [result] = await connection.execute(`SELECT * FROM CRYPTO_TARGET WHERE TARGET = '${target}' `);

    rows = result as [];

  } catch (error) {
    console.error('❌ Failed to fetch CRYPTO_TARGET:', error);
  } finally {
    await connection.end();
  }

  return rows;

}
export async function getCryptoProcess(target: string) {

  const connection = await createConnectionWithRetry();

  let rows: [] = [];

  try {
    const [result] = await connection.execute(`SELECT * FROM CRYPTO_TARGET WHERE STATUS = '${target}' `);

    rows = result as [];

  } catch (error) {
    console.error('❌ Failed to fetch CRYPTO_TARGET:', error);
  } finally {
    await connection.end();
  }

  return rows;

}
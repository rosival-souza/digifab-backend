// src/controllers/productController.ts
import { Request, Response } from 'express';
import { getSupplier } from '../dataBase/mysqlClient';

export const fetchSupplier = async (req: Request, res: Response) => {

    try {

        const data = await getSupplier();
        
        // console.log('data ->', data)

        res.status(200).json(data);

    } catch (error) {

        res.status(500).json({ message: 'Failed to fetch Supplier.' });
    }
};

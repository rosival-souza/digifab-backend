import { Request, Response } from 'express';

import {buscarLinhasProducao, buscarOrdemProducao, buscarOrdensProducao} from "../services/ordemProducaoService";
import {LinhaProducao} from "../types/LinhaProducao";
import {OrdemProducaoSimples} from "../types/OrdemProducaoSimples";
import {OrdemProducaoDetalhado} from "../types/OrdemProducaoDetalhado";


export const getProductionLine = async (req: Request, res: Response) => {
    try {
        const dados: LinhaProducao[] = await buscarLinhasProducao()
        res.json(dados)
    } catch (exception) {
        res.status(500).json({ message: 'Failed to fetch production line list.' });
    }
}

export const getProductionOrderList = async (req: Request, res: Response) => {
    try {
        const dados: OrdemProducaoSimples[] = await buscarOrdensProducao()
        res.json(dados)
    } catch (exception) {
        res.status(500).json({ message: 'Failed to fetch orders production list.' });
    }
}

export const getProductionOrderDetail = async (req: Request, res: Response) => {
    const id = req.params.id;
    try {
        const dados: OrdemProducaoDetalhado | null = await buscarOrdemProducao(parseInt(id))
        res.json(dados)
    } catch (exception) {
        res.status(500).json({ message: 'Failed to fetch orders production detail.' });
    }
}

import { Request, Response } from 'express';

import {
    buscarLinhasProducao,
    buscarLotesProduto,
    buscarOrdemProducao,
    buscarOrdensProducao, criarOrdemProducao
} from "../services/ordemProducaoService";
import {LinhaProducao} from "../types/LinhaProducao";
import {OrdemProducaoSimples} from "../types/OrdemProducaoSimples";
import {OrdemProducaoDetalhado} from "../types/OrdemProducaoDetalhado";
import {LoteProduto} from "../types/LoteProduto";


export const getProductionLine = async (req: Request, res: Response) => {
    try {
        const dados: LinhaProducao[] = await buscarLinhasProducao()
        res.status(200).json(dados)
    } catch (exception) {
        res.status(500).json({ message: 'Failed to fetch production line list.' });
    }
}

export const getProductLot = async (req: Request, res: Response) => {
    try {
        const dados: LoteProduto[] = await buscarLotesProduto()
        res.status(200).json(dados)
    } catch (exception) {
        res.status(500).json({ message: 'Failed to fetch product lot list.' });
    }
}

export const getProductionOrderList = async (req: Request, res: Response) => {
    try {
        const dados: OrdemProducaoSimples[] = await buscarOrdensProducao()
        res.status(200).json(dados)
    } catch (exception) {
        res.status(500).json({ message: 'Failed to fetch orders production list.' });
    }
}


export const getProductionOrderDetail = async (req: Request, res: Response) => {
    const id = req.params.id;
    try {
        const dados: OrdemProducaoDetalhado | null = await buscarOrdemProducao(parseInt(id))
        if (dados === null) {
            res.status(404).json({})
        } else {
            res.status(200).json(dados)
        }

    } catch (exception) {
        res.status(500).json({ message: 'Failed to fetch orders production detail.' });
    }
}

export const createProductionOrder = async (req: Request, res: Response) => {
    const {
        codigo,
        idLoteProduto,
        idLinhaProducao,
        idResponsavel,
        quantidadeProduzir,
        dataHoraInicio
    } = req.body;

    try {
        if (!codigo ||
            !idLoteProduto ||
            !idLinhaProducao ||
            !idResponsavel ||
            !quantidadeProduzir ||
            !dataHoraInicio) {
            res.status(422).json({
                message: 'Arguments is required',
            })
        } else {
            let idOrdemProducao = criarOrdemProducao(codigo,
                idLoteProduto,
                idLinhaProducao,
                idResponsavel,
                quantidadeProduzir,
                dataHoraInicio)
            res.status(201).json({}).location('api/order-production/' + idOrdemProducao)
        }
    } catch (exception) {
        res.status(500).json({ message: 'Failed to fetch orders production detail.' });
    }
}

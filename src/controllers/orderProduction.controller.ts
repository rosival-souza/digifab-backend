import { Request, Response } from 'express';

import {
    buscarDetalhesApontamentoDeConsumo, buscarItensConsumidos,
    buscarLinhasProducao,
    buscarLotesProduto,
    buscarOrdemProducao,
    buscarOrdensProducao,
    buscarSaldoPorLoteMpPorOp, criarItemConsumido,
    criarOrdemProducao
} from "../services/ordemProducaoService";
import {LinhaProducao} from "../types/LinhaProducao";
import {OrdemProducaoSimples} from "../types/OrdemProducaoSimples";
import {OrdemProducaoDetalhado} from "../types/OrdemProducaoDetalhado";
import {LoteProduto} from "../types/LoteProduto";
import {SaldoPorLoteMp} from "../types/SaldoPorLoteMp";
import {ConsumoDetalhe} from "../types/ConsumoDetalhe";
import {ConsumoItem} from "../types/ConsumoItem";
import {getUserId} from "../auth/util/auth";


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
        quantidadeProduzir,
        dataHoraInicio
    } = req.body;

    try {

        const idResponsavel = getUserId(req)

        console.log(idResponsavel)

        if (!idResponsavel) {
            return res.status(403).json({"erro": "Usuário não autenticado!"})
        }

        if (!codigo ||
            !idLoteProduto ||
            !idLinhaProducao ||
            !idResponsavel ||
            !quantidadeProduzir ||
            !dataHoraInicio) {
            res.status(400).json({
                message: 'Arguments is required',
            })
        } else {
            let idOrdemProducao = await criarOrdemProducao(codigo,
                idLoteProduto,
                idLinhaProducao,
                idResponsavel.toString(),
                quantidadeProduzir,
                dataHoraInicio)

            res.location('/api/order-production/' + idOrdemProducao)
            res.status(201).json({})
        }
    } catch (exception) {
        res.status(500).json({ message: 'Failed to fetch orders production detail.' });
    }
}

export const getBalancesByRmLotByOpList = async (req: Request, res: Response) => {
    let id = req.params.id;
    try {
        const dados: SaldoPorLoteMp[] = await buscarSaldoPorLoteMpPorOp(parseInt(id))
        res.status(200).json(dados)
    } catch (exception) {
        res.status(500).json({ message: 'Failed to fetch the list of balances by lot of raw material.' });
    }
}

export const getConsumptionPointingDetail = async (req: Request, res: Response) => {
    let id = req.params.id;
    try {
        const dados: ConsumoDetalhe | null = await buscarDetalhesApontamentoDeConsumo(parseInt(id))
        if (dados === null) {
            res.status(404).json({})
        } else {
            res.status(200).json(dados)
        }
    } catch (exception) {
        res.status(500).json({ message: 'Failed to fetch the consumption pointing detail.' });
    }
}

export const getConsumptionItemList = async (req: Request, res: Response) => {
    let id = req.params.id;
    try {
        const dados: ConsumoItem[] = await buscarItensConsumidos(parseInt(id))
        res.status(200).json(dados)
    } catch (exception) {
        res.status(500).json({ message: 'Failed to fetch the list of consumption items.' });
    }
}

export const createConsumptionItem = async (req: Request, res: Response) => {
    const id = req.params.id;
    const {
        idLoteMp,
        quantidade
    } = req.body;
    try {
        if (!id ||
            !idLoteMp ||
            !quantidade) {
            res.status(400).json({
                message: 'Arguments is required',
            })
        } else {
            await criarItemConsumido(parseInt(id), idLoteMp, quantidade)
            res.status(201).json({})
        }
    } catch (exception) {
        // @ts-ignore
        if (exception.message === "Lote de matéria-prima não localizado! Verifique.") {
            res.status(404).json({ message: 'Raw material lot not exists. Verify it.' });
        } // @ts-ignore
        else if (exception.message === "Não há estoque para o consumo! Verifique."){
            res.status(422).json({ message: 'There is no stock for consumption! Verify it.' });
        } else {
            res.status(500).json({message: 'Failed to create consumption item.'});
        }
    }
}




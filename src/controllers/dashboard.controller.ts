import { Request, Response } from 'express';
import {
    buscarConsumoMpPorDia,
    buscarConsumoMpPorTipo,
    buscarProducaoPorDiaPorLinha,
    buscarTopProdutos
} from "../services/dashboardService";
import {ProducaoDiaLinha} from "../types/ProducaoDiaLinha";
import {TopProduto} from "../types/TopProduto";
import {ConsumoMpDia} from "../types/ConsumoMpDia";
import {ConsumoMpTipo} from "../types/ConsumoMpTipo";

export const getDailyProductionByLine = async (req: Request, res: Response) => {
    try {
        const dados: ProducaoDiaLinha[] = await buscarProducaoPorDiaPorLinha();
        res.json(dados);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch daily production by line.' });
    }
};

export const getTopProducts = async (req: Request, res: Response) => {
    try {
        const dados: TopProduto[] = await buscarTopProdutos();
        res.json(dados);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch top products.' });
    }
};

export const getDailyMpConsumption = async (req: Request, res: Response) => {
    try {
        const dados: ConsumoMpDia[] = await buscarConsumoMpPorDia();
        res.json(dados);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch daily mp consumption.' });
    }
};

export const getMpConsumptionByType = async (req: Request, res: Response) => {
    try {
        const dados: ConsumoMpTipo[] = await buscarConsumoMpPorTipo();
        res.json(dados);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch mp consumption by type.' });
    }
};



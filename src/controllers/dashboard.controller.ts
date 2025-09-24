import { Request, Response } from 'express';
import {
    buscarConsumoMpPorDia,
    buscarConsumoMpPorTipo,
    buscarLotesProdutoAtendidos,
    buscarMateriaPrimaConsumida,
    buscarOps,
    buscarProducaoPorDiaPorLinha,
    buscarTopProdutos,
    buscarUnidadesPlanejadas,
    buscarUtilizacaoMediaLinhas,
    buscarUtilizacaoMediaSimplesLinhas,
    buscarPlanejadoVersusConsumido
} from "../services/dashboardService";
import {ProducaoDiaLinha} from "../types/ProducaoDiaLinha";
import {TopProduto} from "../types/TopProduto";
import {ConsumoMpDia} from "../types/ConsumoMpDia";
import {ConsumoMpTipo} from "../types/ConsumoMpTipo";
import {PlanejadoVersusConsumido} from "../types/PlanejadoVersusConsumido";

export const getOrdersCount = async (req: Request, res: Response) => {
    try {
        const dados: number = await buscarOps();
        res.status(200).json([{dados}]);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch orders count.' });
    }
};

export const getPlannedUnits = async (req: Request, res: Response) => {
    try {
        const dados: number = await buscarUnidadesPlanejadas();
        res.status(200).json(dados);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch planned units.' });
    }
};

export const getRawMpMonsumed = async (req: Request, res: Response) => {
    try {
        const dados: number = await buscarMateriaPrimaConsumida();
        res.status(200).json(dados);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch raw mp consumed.' });
    }
};

export const getServedProductLots = async (req: Request, res: Response) => {
    try {
        const dados: number = await buscarLotesProdutoAtendidos();
        res.status(200).json(dados);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch served product lots.' });
    }
};

export const getLineUtilizationAverage = async (req: Request, res: Response) => {
    try {
        const dados: number = await buscarUtilizacaoMediaLinhas();
        res.status(200).json(dados);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch line utilization average.' });
    }
};

export const getLineUtilizationSimpleAverage = async (req: Request, res: Response) => {
    try {
        const dados: number = await buscarUtilizacaoMediaSimplesLinhas();
        res.status(200).json(dados);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch line utilization simple average.' });
    }
};

export const getDailyProductionByLine = async (req: Request, res: Response) => {
    try {
        const dados: ProducaoDiaLinha[] = await buscarProducaoPorDiaPorLinha();
        res.status(200).json(dados);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch daily production by line.' });
    }
};

export const getUsers = async (req: Request, res: Response) => {
    try {
        const dados: TopProduto[] = await buscarTopProdutos();
        res.status(200).json(dados);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch top products.' });
    }
};

export const getTopProducts = async (req: Request, res: Response) => {
    try {
        const dados: TopProduto[] = await buscarTopProdutos();
        res.status(200).json(dados);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch top products.' });
    }
};

export const getDailyMpConsumption = async (req: Request, res: Response) => {
    try {
        const dados: ConsumoMpDia[] = await buscarConsumoMpPorDia();
        res.status(200).json(dados);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch daily mp consumption.' });
    }
};

export const getMpConsumptionByType = async (req: Request, res: Response) => {
    try {
        const dados: ConsumoMpTipo[] = await buscarConsumoMpPorTipo();
        res.status(200).json(dados);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch mp consumption by type.' });
    }
};

export const getMpSummary = async (req: Request, res: Response) => {
    try {
        const dados: PlanejadoVersusConsumido[] = await buscarPlanejadoVersusConsumido();
        res.status(200).json(dados);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch deviations mp summary.' });
    }
};



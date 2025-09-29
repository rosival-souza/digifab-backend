import { Request, Response } from 'express';
import {buscarRastreabilidade} from "../services/rastreabilidadeService";

export const getTrakeability = async (req: Request, res: Response) => {
    const codigoLoteProduto = req.query.codigoLoteProduto;
    try {
        // @ts-ignore
        const dados = await buscarRastreabilidade(codigoLoteProduto.toString());
        res.status(200).json(dados);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch trackability.' });
    }
}
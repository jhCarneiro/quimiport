
import { Inspecao } from "../../domain/entities/Inspecao";

export interface InspecaoRepository {
    salvar(inspecao: Inspecao): Promise<void>;

    buscar(id: string): Promise<Inspecao | null>;

    listarPorCarga(cargaId: string): Promise<Inspecao[]>;
}

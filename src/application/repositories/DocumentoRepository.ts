
import { Documento } from "../../domain/entities/Documento";

export interface DocumentoRepository {
    salvar(cargaId: string, documento: Documento): Promise<void>;

    buscar(id: string): Promise<Documento | null>;

    listarPorCarga(cargaId: string): Promise<Documento[]>;
}

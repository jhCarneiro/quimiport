
import type { FastifyRequest, FastifyReply } from "fastify";
import { PrismaProdutoQuimicoRepository } from "../../../infrastructure/repositories/PrismaProdutoQuimicoRepository";
import { CadastrarProdutoQuimico } from "../../../application/use-cases/CadastrarProdutoQuimico";

interface CadastrarProdutoBody {
    nome: string;
    descricao: string;
    numeroONU: string;
    classeRisco: string;
    grupoCompatibilidade: string;
}

export async function CadastrarProdutoQuimicoController(
    request: FastifyRequest<{ Body: CadastrarProdutoBody }>,
    reply: FastifyReply
) {
    const {
        nome,
        descricao,
        numeroONU,
        classeRisco,
        grupoCompatibilidade
    } = request.body;

    const repository = new PrismaProdutoQuimicoRepository();
    const cadastrarProduto = new CadastrarProdutoQuimico(repository);

    const produto = await cadastrarProduto.execute({
        nome,
        descricao,
        numeroONU,
        classeRisco,
        grupoCompatibilidade
    });

    return reply.code(201).send({
        mensagem: "Produto cadastrado com sucesso",
        produto: {
            id: produto.getID(),
            nome: produto.getNome(),
            descricao: produto.getDescricao(),
            numeroONU: produto.getNumeroONU(),
            classeRisco: produto.getClasseRisco(),
            grupoCompatibilidade: produto.getGrupoCompatibilidade(),
            status: produto.getStatus()
        }
    });
}

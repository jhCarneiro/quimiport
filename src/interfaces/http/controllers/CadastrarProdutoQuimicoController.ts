
import { FastifyRequest, FastifyReply } from "fastify";
import { PrismaProdutoQuimicoRepository } from "../../../infrastructure/repositories/PrismaProdutoQuimicoRepository";
import { CadastrarProdutoQuimico } from "../../../application/use-cases/CadastrarProdutoQuimico";

interface CadastrarProdutoBody {
    nome: string;
    numeroONU: string;
    classeRisco: string;
}

export async function CadastrarProdutoQuimicoController(
    request: FastifyRequest<{ Body: CadastrarProdutoBody }>,
    reply: FastifyReply
) {
    const { nome, numeroONU, classeRisco } = request.body;

    const repository = new PrismaProdutoQuimicoRepository();

    const cadastrarProduto = new CadastrarProdutoQuimico(repository);

    const produto = await cadastrarProduto.execute({
        nome,
        numeroONU,
        classeRisco
    });

    return reply.code(201).send({
        mensagem: "Produto cadastrado com sucesso",
        produto: {
            id: produto.getID(),
            nome: produto.getNome(),
            numeroONU: produto.getNumeroONU(),
            classeRisco: produto.getClasseRisco()
        }
    });
}

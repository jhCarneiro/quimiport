
import { FastifyInstance } from "fastify";
import { CadastrarProdutoQuimicoController } from "../controllers/CadastrarProdutoQuimicoController";
import { ListarProdutosQuimicosController } from "../controllers/ListarProdutosQuimicosController";
import { BuscarProdutoQuimicoController } from "../controllers/BuscarProdutoQuimicoController";

export async function produtoQuimicoRoutes(app: FastifyInstance) {
    app.post(
        "/produtos-quimicos",
        {
            schema: {
                body: {
                    type: "object",
                    required: ["nome", "numeroONU", "classeRisco"],
                    additionalProperties: false,
                    properties: {
                        nome: { type: "string", minLength: 1, pattern: "\\S" },
                        numeroONU: { type: "string", minLength: 1, pattern: "\\S" },
                        classeRisco: { type: "string", minLength: 1, pattern: "\\S" }
                    }

                },

                tags: ["Produtos Químicos"],
                summary: "Cadastrar produto químico",
                response: {
                    201: {
                        type: "object",
                        properties: {
                            mensagem: { type: "string" },
                            produto: {
                                type: "object",
                                properties: {
                                    id: { type: "string" },
                                    nome: { type: "string" },
                                    numeroONU: { type: "string" },
                                    classeRisco: { type: "string" }
                                }
                            }
                        }
                    },
                    400: {
                        type: "object",
                        properties: {
                            statusCode: { type: "integer" },
                            error: { type: "string" },
                            message: { type: "string" }
                        }
                    }
                }

            }
        },
        CadastrarProdutoQuimicoController
    );

    app.get("/produtos-quimicos", {
        schema: {
            tags: ["Produtos Químicos"],
            summary: "Listar produtos químicos",
            response: {
                200: {
                    type: "array",
                    items: {
                        type: "object",
                        properties: {
                            id: { type: "string" },
                            nome: { type: "string" },
                            numeroONU: { type: "string" },
                            classeRisco: { type: "string" },
                            criadoEm: { type: "string", format: "date-time" },
                            atualizadoEm: { type: "string", format: "date-time" }
                        }
                    }
                }
            }
        }
    }, ListarProdutosQuimicosController);


    app.get(
        "/produtos-quimicos/:id",
        {
            schema: {
                tags: ["Produtos Químicos"],
                summary: "Buscar produto químico pelo ID",

                params: {
                    type: "object",
                    required: ["id"],
                    properties: {
                        id: { type: "string", format: "uuid" }
                    }
                },

                response: {
                    200: {
                        type: "object",
                        properties: {
                            id: { type: "string" },
                            nome: { type: "string" },
                            numeroONU: { type: "string" },
                            classeRisco: { type: "string" },
                            criadoEm: { type: "string", format: "date-time" },
                            atualizadoEm: { type: "string", format: "date-time" }
                        }
                    },

                    404: {
                        type: "object",
                        properties: {
                            mensagem: { type: "string" }
                        }
                    }
                }
            }
        },
        BuscarProdutoQuimicoController
    );

}

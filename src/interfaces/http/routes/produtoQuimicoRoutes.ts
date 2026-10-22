
import { FastifyInstance } from "fastify";
import { CadastrarProdutoQuimicoController } from "../controllers/CadastrarProdutoQuimicoController";
import { ListarProdutosQuimicosController } from "../controllers/ListarProdutosQuimicosController";
import { BuscarProdutoQuimicoController } from "../controllers/BuscarProdutoQuimicoController";

import { AtualizarProdutoQuimicoController } from "../controllers/AtualizarProdutoQuimicoController";
import { InativarProdutoQuimicoController } from "../controllers/InativarProdutoQuimicoController";


export async function produtoQuimicoRoutes(app: FastifyInstance) {
    app.post(
        "/produtos-quimicos",
        {
            schema: {

                body: {
                    type: "object",
                    required: [
                        "nome",
                        "descricao",
                        "numeroONU",
                        "classeRisco",
                        "grupoCompatibilidade"
                    ],
                    additionalProperties: false,
                    properties: {
                        nome: { type: "string", minLength: 1, pattern: "\\S" },
                        descricao: { type: "string", minLength: 1, pattern: "\\S" },
                        numeroONU: { type: "string", minLength: 1, pattern: "\\S" },
                        classeRisco: { type: "string", minLength: 1, pattern: "\\S" },
                        grupoCompatibilidade: { type: "string", minLength: 1, pattern: "\\S" }
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
                                    descricao: { type: "string" },
                                    numeroONU: { type: "string" },
                                    classeRisco: { type: "string" },
                                    grupoCompatibilidade: { type: "string" },
                                    status: {
                                        type: "string",
                                        enum: ["ATIVO"]
                                    }
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
                            id: { type: "string", format: "uuid" },
                            nome: { type: "string" },
                            descricao: { type: "string" },
                            numeroONU: { type: "string" },
                            classeRisco: { type: "string" },
                            grupoCompatibilidade: { type: "string" },
                            status: {
                                type: "string",
                                enum: ["ATIVO", "INATIVO"]
                            },
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
                            id: { type: "string", format: "uuid" },
                            nome: { type: "string" },
                            descricao: { type: "string" },
                            numeroONU: { type: "string" },
                            classeRisco: { type: "string" },
                            grupoCompatibilidade: { type: "string" },
                            status: {
                                type: "string",
                                enum: ["ATIVO", "INATIVO"]
                            },
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

    app.put(
        "/produtos-quimicos/:id",
        {
            schema: {
                tags: ["Produtos Químicos"],
                summary: "Atualizar produto químico",
                description: "Atualiza os dados de um produto químico ativo.",

                params: {
                    type: "object",
                    required: ["id"],
                    properties: {
                        id: { type: "string", format: "uuid" }
                    }
                },

                body: {
                    type: "object",
                    required: [
                        "nome",
                        "descricao",
                        "numeroONU",
                        "classeRisco",
                        "grupoCompatibilidade"
                    ],
                    additionalProperties: false,
                    properties: {
                        nome: {
                            type: "string",
                            minLength: 1,
                            pattern: "\\S"
                        },
                        descricao: {
                            type: "string",
                            minLength: 1,
                            pattern: "\\S"
                        },
                        numeroONU: {
                            type: "string",
                            minLength: 1,
                            pattern: "\\S"
                        },
                        classeRisco: {
                            type: "string",
                            minLength: 1,
                            pattern: "\\S"
                        },
                        grupoCompatibilidade: {
                            type: "string",
                            minLength: 1,
                            pattern: "\\S"
                        }
                    }
                },

                response: {
                    200: {
                        type: "object",
                        properties: {
                            mensagem: { type: "string" },
                            id: { type: "string" }
                        }
                    },

                    400: {
                        type: "object",
                        properties: {
                            mensagem: { type: "string" },
                            statusCode: { type: "integer" },
                            error: { type: "string" },
                            message: { type: "string" }
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
        AtualizarProdutoQuimicoController
    );


    app.patch(
        "/produtos-quimicos/:id/inativar",
        {
            schema: {
                tags: ["Produtos Químicos"],
                summary: "Inativar produto químico",
                description: "Altera o status de um produto químico de ATIVO para INATIVO.",

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
                            mensagem: { type: "string" },
                            id: { type: "string" },
                            status: {
                                type: "string",
                                enum: ["INATIVO"]
                            }
                        }
                    },

                    400: {
                        type: "object",
                        properties: {
                            mensagem: { type: "string" }
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
        InativarProdutoQuimicoController
    );



}

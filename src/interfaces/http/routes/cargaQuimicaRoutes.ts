import { AlterarStatusCargaQuimicaController } from "../controllers/AlterarStatusCargaQuimicaController";
import { StatusCarga } from "../../../domain/entities/CargaQuimica";
import { AlterarStatusCargaQuimica } from "../../../application/use-cases/AlterarStatusCargaQuimica";
import { PrismaCargaQuimicaRepository } from "../../../infrastructure/repositories/PrismaCargaQuimicaRepository";

import { FastifyInstance } from "fastify";

import { CadastrarCargaQuimicaController } from "../controllers/CadastrarCargaQuimicaController";
import { ListarCargasQuimicasController } from "../controllers/ListarCargasQuimicasController";
import { BuscarCargaQuimicaController } from "../controllers/BuscarCargaQuimicaController";
import { AdicionarItemCargaController } from "../controllers/AdicionarItemCargaController";
import { ListarItensCargaController } from "../controllers/ListarItensCargaController";
import { EnviarCargaParaInspecaoController } from "../controllers/EnviarCargaParaInspecaoController";
import { RegistrarInspecaoController } from "../controllers/RegistrarInspecaoController";
import { LiberarCargaQuimicaController } from "../controllers/LiberarCargaQuimicaController";
import { MovimentarCargaQuimicaController } from "../controllers/MovimentarCargaQuimicaController";
import { CadastrarDocumentoController } from "../controllers/CadastrarDocumentoController";
import { BloquearCargaQuimicaController } from "../controllers/BloquearCargaQuimicaController";
import { RegularizarCargaQuimicaController } from "../controllers/RegularizarCargaQuimicaController";


export async function cargaQuimicaRoutes(
    app: FastifyInstance
) {
    app.post(
        "/cargas-quimicas",
        {
            schema: {
                tags: ["Cargas Químicas"],
                summary: "Cadastrar uma carga química",
                description: "Registra carga com produto ativo e status REGISTRADA.",
                body: {
                    type: "object", additionalProperties: false,
                    required: ["codigo", "produtoQuimicoID", "quantidade", "unidade", "origem", "destino", "responsavelTecnico", "documentacaoObrigatoria"],
                    properties: {
                        codigo: { type: "string", minLength: 1, pattern: "\\S" },
                        produtoQuimicoID: { type: "string", format: "uuid" },
                        quantidade: { type: "number", exclusiveMinimum: 0 },
                        unidade: { type: "string", minLength: 1, pattern: "\\S" },
                        origem: { type: "string", minLength: 1, pattern: "\\S" },
                        destino: { type: "string", minLength: 1, pattern: "\\S" },
                        responsavelTecnico: { type: "string", minLength: 1, pattern: "\\S" },
                        documentacaoObrigatoria: { type: "string", minLength: 1, pattern: "\\S" },
                        dataEntrada: { type: "string", format: "date-time" }
                    },
                    examples: [{ codigo: "CARGA-001", produtoQuimicoID: "11111111-1111-4111-8111-111111111111", quantidade: 100,
                        unidade: "L", origem: "Santos", destino: "Campinas", responsavelTecnico: "Eng. Silva",
                        documentacaoObrigatoria: "FISPQ" }]
                },
                response: {
                    201: {
                        type: "object",
                        properties: {
                            id: { type: "string", format: "uuid" },
                            status: { type: "string" },
                            codigo: { type: "string" }, origem: { type: "string" }, destino: { type: "string" },
                            responsavelTecnico: { type: "string" }, documentacaoObrigatoria: { type: "string" },
                            dataEntrada: { type: "string", format: "date-time" },
                            itens: { type: "array", items: { type: "object", properties: {
                                produtoQuimicoID: { type: "string" }, quantidade: { type: "number" }, unidade: { type: "string" }
                            }}},
                            criadoEm: { type: "string", format: "date-time" },
                            atualizadoEm: { type: "string", format: "date-time" }
                        }
                    }
                }
            }
        },
        CadastrarCargaQuimicaController
    );


    app.get(
        "/cargas-quimicas",
        {
            schema: {
                tags: ["Cargas Químicas"],
                summary: "Listar todas as cargas químicas",
                description: "Consulta as cargas químicas cadastradas no banco de dados",
                response: {
                    200: {
                        type: "array",
                        items: {
                            type: "object",
                            properties: {
                                id: { type: "string", format: "uuid" },
                                status: { type: "string" },
                                criadoEm: { type: "string", format: "date-time" },
                                atualizadoEm: { type: "string", format: "date-time" }
                            }
                        }
                    }
                }
            }
        },
        ListarCargasQuimicasController
    );


    app.get(
        "/cargas-quimicas/:id",
        {
            schema: {
                tags: ["Cargas Químicas"],
                summary: "Buscar carga química pelo ID",
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
                            status: { type: "string" },
                            codigo: { type: "string" }, origem: { type: "string" }, destino: { type: "string" },
                            responsavelTecnico: { type: "string" }, documentacaoObrigatoria: { type: "string" },
                            dataEntrada: { type: "string", format: "date-time" },
                            itens: { type: "array", items: { type: "object", properties: {
                                produtoQuimicoID: { type: "string" }, quantidade: { type: "number" }, unidade: { type: "string" }
                            }}},
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
        BuscarCargaQuimicaController
    );


    app.post(
        "/cargas-quimicas/:id/itens",
        {
            schema: {
                tags: ["Cargas Químicas"],
                summary: "Adicionar produto químico a uma carga",
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
                        "produtoQuimicoID",
                        "quantidade",
                        "unidade"
                    ],
                    additionalProperties: false,
                    properties: {
                        produtoQuimicoID: {
                            type: "string",
                            format: "uuid"
                        },
                        quantidade: {
                            type: "number",
                            exclusiveMinimum: 0
                        },
                        unidade: {
                            type: "string",
                            minLength: 1,
                            pattern: "\\S"
                        }
                    }
                },

                response: {
                    201: {
                        description: "Item adicionado com sucesso",
                        type: "object",
                        properties: {
                            id: { type: "string" },
                            produtoQuimicoID: { type: "string" },
                            quantidade: { type: "number" },
                            unidade: { type: "string" }
                        }
                    },
                    400: {
                        description: "Produto inativo, dados inválidos ou carga que não permite novos itens",
                        type: "object",
                        properties: {
                            mensagem: { type: "string" }
                        },
                        required: ["mensagem"]
                    },
                    404: {
                        description: "Carga ou produto químico não encontrado",
                        type: "object",
                        properties: {
                            mensagem: { type: "string" }
                        },
                        required: ["mensagem"]
                    }
                }

            }
        },
        AdicionarItemCargaController
    );


    app.get(
        "/cargas-quimicas/:id/itens",
        {
            schema: {
                tags: ["Cargas Químicas"],
                summary: "Listar itens de uma carga química",
                params: {
                    type: "object",
                    required: ["id"],
                    properties: {
                        id: { type: "string", format: "uuid" }
                    }
                },
                response: {
                    200: {
                        type: "array",
                        items: {
                            type: "object",
                            properties: {
                                id: { type: "string", format: "uuid" },
                                produtoQuimicoID: { type: "string", format: "uuid" },
                                nomeProduto: { type: "string" },
                                quantidade: { type: "number" },
                                unidade: { type: "string" }
                            }
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
        ListarItensCargaController
    );


    app.patch(
        "/cargas-quimicas/:id/status",
        {
            schema: {
                tags: ["Cargas Químicas"],
                summary: "Enviar carga química para inspeção",
                description:
                    "Altera o status de PENDENTE_DOCUMENTACAO para PENDENTE_INSPECAO.",
                params: {
                    type: "object",
                    required: ["id"],
                    properties: {
                        id: {
                            type: "string",
                            format: "uuid"
                        }
                    }
                },
                response: {
                    200: {
                        type: "object",
                        properties: {
                            id: { type: "string" },
                            status: { type: "string" },
                            atualizadoEm: {
                                type: "string",
                                format: "date-time"
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
        EnviarCargaParaInspecaoController
    );


    app.post(
        "/cargas-quimicas/:id/inspecoes",
        {
            schema: {
                tags: ["Inspeções"],
                summary: "Registrar inspeção de uma carga química",
                description:
                    "Registra uma inspeção em uma carga com status PENDENTE_INSPECAO.",
                params: {
                    type: "object",
                    required: ["id"],
                    properties: {
                        id: {
                            type: "string",
                            format: "uuid"
                        }
                    }
                },
                body: {
                    type: "object",
                    required: [
                        "responsavelId",
                        "resultado",
                        "observacao",
                        "dataInspecao"
                    ],
                    additionalProperties: false,
                    properties: {
                        responsavelId: {
                            type: "string",
                            minLength: 1,
                            pattern: "\\S"
                        },
                        resultado: {
                            type: "string",
                            enum: ["Aprovada", "Reprovada"]
                        },
                        observacao: {
                            type: "string"
                        },
                        dataInspecao: {
                            type: "string",
                            format: "date-time"
                        }
                    }
                },
                response: {
                    201: {
                        type: "object",
                        properties: {
                            id: { type: "string", format: "uuid" },
                            cargaId: { type: "string", format: "uuid" },
                            responsavelId: { type: "string" },
                            resultado: { type: "string" },
                            observacao: { type: "string" },
                            dataInspecao: {
                                type: "string",
                                format: "date-time"
                            },
                            criadoEm: {
                                type: "string",
                                format: "date-time"
                            }
                        }
                    },

                    400: {
                        description: "Dados inválidos, produto inativo ou carga que não permite novos itens",
                        type: "object",
                        properties: {
                            mensagem: { type: "string" }
                        },
                        required: ["mensagem"]
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
        RegistrarInspecaoController
    );


    app.patch(
        "/cargas-quimicas/:id/liberar",
        {
            schema: {
                tags: ["Cargas Químicas"],
                summary: "Liberar carga química",
                description:
                    "Libera uma carga pendente de inspeção quando a última inspeção está aprovada.",
                params: {
                    type: "object",
                    required: ["id"],
                    properties: {
                        id: {
                            type: "string",
                            format: "uuid"
                        }
                    }
                },
                response: {
                    200: {
                        type: "object",
                        properties: {
                            mensagem: { type: "string" },
                            id: { type: "string" },
                            status: { type: "string" }
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
        LiberarCargaQuimicaController
    );


    app.patch(
        "/cargas-quimicas/:id/movimentar",
        {
            schema: {
                tags: ["Cargas Químicas"],
                summary: "Movimentar carga química",
                description:
                    "Movimenta uma carga química que esteja com status LIBERADA.",
                params: {
                    type: "object",
                    required: ["id"],
                    properties: {
                        id: {
                            type: "string",
                            format: "uuid"
                        }
                    }
                },
                response: {
                    200: {
                        type: "object",
                        properties: {
                            mensagem: { type: "string" },
                            id: { type: "string", format: "uuid" },
                            status: {
                                type: "string",
                                enum: ["MOVIMENTADA"]
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
        MovimentarCargaQuimicaController
    );


    app.post(
        "/cargas-quimicas/:id/documentos",
        {
            schema: {
                tags: ["Documentos"],
                summary: "Cadastrar documento de uma carga química",
                description:
                    "Cadastra um documento vinculado a uma carga química existente.",
                params: {
                    type: "object",
                    required: ["id"],
                    properties: {
                        id: {
                            type: "string",
                            format: "uuid"
                        }
                    }
                },
                body: {
                    type: "object",
                    required: [
                        "tipo",
                        "numero",
                        "dataEmissao",
                        "dataValidade"
                    ],
                    additionalProperties: false,
                    properties: {
                        tipo: {
                            type: "string",
                            minLength: 1,
                            pattern: "\\S"
                        },
                        numero: {
                            type: "string",
                            minLength: 1,
                            pattern: "\\S"
                        },
                        dataEmissao: {
                            type: "string",
                            format: "date-time"
                        },
                        dataValidade: {
                            type: "string",
                            format: "date-time"
                        }
                    }
                },
                response: {
                    201: {
                        type: "object",
                        properties: {
                            id: { type: "string", format: "uuid" },
                            cargaId: { type: "string", format: "uuid" },
                            tipo: { type: "string" },
                            numero: { type: "string" },
                            dataEmissao: {
                                type: "string",
                                format: "date-time"
                            },
                            dataValidade: {
                                type: "string",
                                format: "date-time"
                            },
                            criadoEm: {
                                type: "string",
                                format: "date-time"
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
        CadastrarDocumentoController
    );


    app.patch(
        "/cargas-quimicas/:id/bloquear",
        {
            schema: {
                tags: ["Cargas Químicas"],
                summary: "Bloquear carga química",
                description:
                    "Bloqueia uma carga química que possui documentos, respeitando as regras de negócio.",
                params: {
                    type: "object",
                    required: ["id"],
                    properties: {
                        id: {
                            type: "string",
                            format: "uuid"
                        }
                    }
                },
                response: {
                    200: {
                        type: "object",
                        properties: {
                            mensagem: { type: "string" },
                            cargaId: {
                                type: "string",
                                format: "uuid"
                            },
                            status: { type: "string" }
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
        BloquearCargaQuimicaController
    );


    app.patch(
        "/cargas-quimicas/:id/regularizar",
        {
            schema: {
                tags: ["Cargas Químicas"],
                summary: "Regularizar carga química",
                description:
                    "Regulariza uma carga bloqueada, alterando seu status para PENDENTE_INSPECAO.",
                params: {
                    type: "object",
                    required: ["id"],
                    properties: {
                        id: {
                            type: "string",
                            format: "uuid"
                        }
                    }
                },
                response: {
                    200: {
                        type: "object",
                        properties: {
                            mensagem: { type: "string" },
                            cargaId: {
                                type: "string",
                                format: "uuid"
                            },
                            status: { type: "string" }
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
        RegularizarCargaQuimicaController
    );

    const parametros = { type: "object", required: ["id"], properties: { id: { type: "string", format: "uuid" } } };
    const resposta = { type: "object", properties: { id: { type: "string" }, status: { type: "string" }, atualizadoEm: { type: "string", format: "date-time" } } };
    const erro = { type: "object", properties: { mensagem: { type: "string" } } };
    app.patch("/cargas-quimicas/:id/transicionar", {
        schema: { tags: ["Cargas Químicas"], summary: "Transicionar status segundo o fluxo oficial",
            params: parametros,
            body: { type: "object", additionalProperties: false, required: ["status"], properties: {
                status: { type: "string", enum: Object.values(StatusCarga) }
            }}, response: { 200: resposta, 400: erro, 404: erro } }
    }, AlterarStatusCargaQuimicaController);
    for (const [sufixo, destino] of [["cancelar", StatusCarga.CANCELADA], ["finalizar", StatusCarga.FINALIZADA]] as const) {
        app.patch(`/cargas-quimicas/:id/${sufixo}`, {
            schema: { tags: ["Cargas Químicas"], summary: `${sufixo} carga`, params: parametros,
                response: { 200: resposta, 400: erro, 404: erro } }
        }, async (request, reply) => {
            try {
                const carga = await new AlterarStatusCargaQuimica(new PrismaCargaQuimicaRepository()).executar((request.params as {id:string}).id, destino);
                return reply.send({ id: carga.getID(), status: carga.getStatus(), atualizadoEm: carga.getAtualizadoEm() });
            } catch (error) {
                if (error instanceof Error && error.message === "CARGA_NAO_ENCONTRADA") return reply.status(404).send({ mensagem: error.message });
                if (error instanceof Error && error.message === "TRANSICAO_STATUS_INVALIDA") return reply.status(400).send({ mensagem: error.message });
                throw error;
            }
        });
    }

}

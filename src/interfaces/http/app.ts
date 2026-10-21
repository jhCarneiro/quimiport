
import Fastify, { FastifyError } from "fastify";
import swagger from "@fastify/swagger";
import swaggerUI from "@fastify/swagger-ui";

import { produtoQuimicoRoutes } from "./routes/produtoQuimicoRoutes";
import { cargaQuimicaRoutes } from "./routes/cargaQuimicaRoutes";

export function criarApp() {

    const app = Fastify({
        logger: true
    });

    // Tratamento global de erros
    app.setErrorHandler((error, request, reply) => {

        if (error instanceof Error) {

            const fastifyError = error as FastifyError;

            if (fastifyError.validation) {
                return reply.status(400).send({
                    mensagem: "Dados inválidos na requisição"
                });
            }

            if (
                fastifyError.statusCode &&
                fastifyError.statusCode >= 400 &&
                fastifyError.statusCode < 500
            ) {
                return reply.status(fastifyError.statusCode).send({
                    mensagem: fastifyError.message
                });
            }
        }

        request.log.error(error);

        return reply.status(500).send({
            mensagem: "Erro interno do servidor"
        });
    });

    // Documentação Swagger
    app.register(swagger, {
        openapi: {
            info: {
                title: "QuimiPort API",
                description:
                    "API para gerenciamento de cargas e produtos químicos em ambiente portuário",
                version: "1.0.0"
            },
            tags: [
                {
                    name: "Produtos Químicos",
                    description: "Cadastro e consulta de produtos químicos"
                },
                {
                    name: "Cargas Químicas",
                    description: "Gerenciamento de cargas químicas"
                },
                {
                    name: "Inspeções",
                    description: "Inspeções de cargas químicas"
                },
                {
                    name: "Documentos",
                    description: "Documentação de cargas químicas"
                }
            ]
        }
    });

    app.register(swaggerUI, {
        routePrefix: "/docs"
    });

    // Healthcheck
    app.get("/health", async () => {
        return {
            status: "ok",
            sistema: "QuimiPort"
        };
    });

    // Rotas
    app.register(produtoQuimicoRoutes);
    app.register(cargaQuimicaRoutes);

    return app;
}


import { defineConfig } from "vitest/config";
import { config } from "dotenv";
import { resolve } from "node:path";

const resultado = config({
    path: resolve(process.cwd(), ".env.test"),
    override: true
});


if (resultado.error) {
    throw new Error(
        `Não foi possível carregar o arquivo .env.test: ${resultado.error.message}`
    );
}


const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
    throw new Error(
        "DATABASE_URL não configurada para os testes de integração"
    );
}

let url: URL;

try {
    url = new URL(databaseUrl);
} catch {
    throw new Error(
        "DATABASE_URL inválida para os testes de integração"
    );
}

const nomeBanco = decodeURIComponent(
    url.pathname.replace(/^\/+/, "")
);

if (nomeBanco !== "quimiport_test") {
    throw new Error(
        `OPERAÇÃO BLOQUEADA: banco "${nomeBanco}" não permitido`
    );
}

export default defineConfig({
    test: {
        include: [
            "src/**/*.integration.test.ts"
        ],
        fileParallelism: false,
        testTimeout: 15000
    }
});

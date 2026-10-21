
import { describe, it, expect, afterEach } from "vitest";

import { garantirBancoDeTeste } from "./garantirBancoDeTeste";

describe("Proteção do banco de testes", () => {

    const databaseUrlOriginal = process.env.DATABASE_URL;

    afterEach(() => {
        if (databaseUrlOriginal === undefined) {
            delete process.env.DATABASE_URL;
        } else {
            process.env.DATABASE_URL = databaseUrlOriginal;
        }
    });

    it("deve permitir o banco quimiport_test", () => {

        process.env.DATABASE_URL =
            "postgresql://quimiport:senha@localhost:5432/quimiport_test";

        expect(() => garantirBancoDeTeste()).not.toThrow();
    });

    it("deve bloquear o banco principal", () => {

        process.env.DATABASE_URL =
            "postgresql://quimiport:senha@localhost:5432/quimiport";

        expect(() => garantirBancoDeTeste()).toThrow(
            "OPERAÇÃO BLOQUEADA"
        );
    });

    it("deve bloquear quando DATABASE_URL não estiver configurada", () => {

        delete process.env.DATABASE_URL;

        expect(() => garantirBancoDeTeste()).toThrow(
            "DATABASE_URL não configurada"
        );
    });
});

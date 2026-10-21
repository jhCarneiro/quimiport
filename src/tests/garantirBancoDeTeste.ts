
export function garantirBancoDeTeste(): void {

    const databaseUrl = process.env.DATABASE_URL;

    if (!databaseUrl) {
        throw new Error(
            "DATABASE_URL não configurada para os testes de integração."
        );
    }

    let url: URL;

    try {
        url = new URL(databaseUrl);
    } catch {
        throw new Error(
            "DATABASE_URL inválida para os testes de integração."
        );
    }

    const nomeBanco = decodeURIComponent(
        url.pathname.replace(/^\/+/, "")
    );

    if (nomeBanco !== "quimiport_test") {
        throw new Error(
            `OPERAÇÃO BLOQUEADA: o banco "${nomeBanco}" não é o banco de testes.`
        );
    }
}

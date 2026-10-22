
import { criarApp } from "./app";

const app = criarApp();

async function iniciarServidor() {
    try {
        await app.listen({
            port: Number(process.env.PORT ?? 3000),
            host: "0.0.0.0"
        });

    } catch (error) {
        app.log.error(error);
        process.exit(1);
    }
}

iniciarServidor();

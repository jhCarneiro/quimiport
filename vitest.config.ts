
import { defineConfig } from "vitest/config";

export default defineConfig({
    test: {
        env: {
            DATABASE_URL:
                "postgresql://teste:teste@localhost:5432/quimiport_test"
        }
    }
});

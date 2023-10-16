import { createExpressMiddleware } from "@trpc/server/adapters/express";
import express from "express";
import { appRouter } from "./src/router";
import NextAuthHandler from "./src/auth";

async function main() {
  const app = express();

  app.get("/", (_req, res) => res.send("Zenith Server"));

  app.get("/api/auth/*", (req, res) => {
    const nextauth = req.path.split("/");
    nextauth.splice(0, 3);
    req.query.nextauth = nextauth;
    NextAuthHandler(req, res);
  });

  app.post("/api/auth/*", (req, res) => {
    const nextauth = req.path.split("/");
    nextauth.splice(0, 3);
    req.query.nextauth = nextauth;
    NextAuthHandler(req, res);
  });

  app.use(
    "/trpc",
    createExpressMiddleware({
      router: appRouter,
      createContext: () => ({}),
    })
  );

  app.listen(8080);
}

void main();

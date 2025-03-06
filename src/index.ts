import express from "express";
import dotenv from "dotenv";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import { createServer, Server } from "http";
import cluster from "cluster";
import os from "os";
import AppRouter from "./routes/AppRouter";
import Logger from "./utils/Logger";
import errorHandler from "./middleware/errorHandler";
import client from "prom-client";
import { Database } from "./config/Database";

// Load environment variables
dotenv.config();

class WeatherAPI {
  private app: express.Application;
  private server: Server;
  private PORT: string | number;

  constructor() {
    this.app = express();
    this.server = createServer(this.app);
    this.PORT = process.env.PORT || 3000;
    this.initializeMiddlewares();
    this.initializeRoutes();
    this.initializeMonitoring();
    this.initializeErrorHandling();
    this.connectDatabase();
    this.startServer();
  }

  private initializeMiddlewares(): void {
    this.app.use(helmet());
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(
      rateLimit({
        windowMs: 15 * 60 * 1000,
        max: 100,
        message: "Too many requests, please try again later.",
      })
    );
  }

  private initializeRoutes(): void {
    this.app.use("/api", AppRouter);
  }
  private async connectDatabase(): Promise<void> {
    await Database.getInstance().connect();
  }
  private initializeMonitoring(): void {
    const collectDefaultMetrics = client.collectDefaultMetrics;
    collectDefaultMetrics();

    const httpRequestCounter = new client.Counter({
      name: "http_requests_total",
      help: "Total number of HTTP requests",
    });

    this.app.use((req, res, next) => {
      httpRequestCounter.inc();
      next();
    });

    this.app.get("/metrics", async (req, res) => {
      res.set("Content-Type", client.register.contentType);
      res.end(await client.register.metrics());
    });

    Logger.info("✅ Prometheus monitoring initialized");
  }

  private initializeErrorHandling(): void {
    this.app.use(errorHandler);
  }

  private startServer(): void {
    this.server.listen(this.PORT, () => {
      Logger.info(`🚀 Server running on port ${this.PORT}`);
    });
  }
}

// ✅ دعم Node.js Clustering (Multiple Workers)
const numCPUs = os.cpus().length;

if (cluster.isPrimary) {
  Logger.info(`🚀 Primary process ${process.pid} is running`);
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }
  cluster.on("exit", (worker) => {
    Logger.error(`⚠️ Worker ${worker.process.pid} died. Restarting...`);
    cluster.fork();
  });
} else {
  new WeatherAPI();
  Logger.info(`✅ Worker ${process.pid} started`);
}

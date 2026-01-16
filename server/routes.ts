import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  app.get("/api/radar/:month/:nation", async (req, res) => {
    try {
      const { month, nation } = req.params;
      
      if (!month || !nation) {
        return res.status(400).json({ error: "Month and nation are required" });
      }
      
      if (nation !== "domestic" && nation !== "import") {
        return res.status(400).json({ error: "Nation must be 'domestic' or 'import'" });
      }
      
      const monthPattern = /^\d{4}-\d{2}-00$/;
      if (!monthPattern.test(month)) {
        return res.status(400).json({ error: "Month must be in format YYYY-MM-00" });
      }
      
      const models = await storage.getRadarModels(month, nation);
      return res.json(models);
    } catch (error) {
      console.error("Error fetching radar models:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  });

  return httpServer;
}

import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { generateContent } from "./openai";
import { contentGenerationSchema, insertContentSchema } from "@shared/schema";
import { z, ZodError } from "zod";
import { fromZodError } from "zod-validation-error";

export async function registerRoutes(app: Express): Promise<Server> {
  // Generate content
  app.post("/api/generate", async (req, res) => {
    try {
      const validatedData = contentGenerationSchema.parse(req.body);
      const generatedContent = await generateContent(validatedData);
      
      return res.json({
        ...validatedData,
        content: generatedContent,
      });
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: fromZodError(error).message });
      }
      console.error("Error generating content:", error);
      return res.status(500).json({ message: "Failed to generate content" });
    }
  });

  // Save content to history
  app.post("/api/content/save", async (req, res) => {
    try {
      const contentData = insertContentSchema.parse(req.body);
      const savedContent = await storage.saveContent(contentData);
      return res.json(savedContent);
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: fromZodError(error).message });
      }
      console.error("Error saving content:", error);
      return res.status(500).json({ message: "Failed to save content" });
    }
  });

  // Get content history
  app.get("/api/content-history", async (req, res) => {
    try {
      const contentHistory = await storage.getContentHistory();
      return res.json(contentHistory);
    } catch (error: any) {
      console.error("Error fetching content history:", error);
      return res.status(500).json({ message: "Failed to fetch content history" });
    }
  });

  // Delete content item
  app.delete("/api/content/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid ID format" });
      }
      
      await storage.deleteContent(id);
      return res.json({ success: true });
    } catch (error: any) {
      console.error("Error deleting content:", error);
      return res.status(500).json({ message: "Failed to delete content" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}

import { users, type User, type InsertUser, contentItems, ContentItem, InsertContent } from "@shared/schema";
import { eq } from "drizzle-orm";
import { db } from "./db";

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUserPlan(userId: number, planType: string, requestsLimit: number): Promise<boolean>;
  incrementUserRequests(userId: number): Promise<boolean>;
  checkUserRequestsAvailable(userId: number): Promise<boolean>;
  
  // Content methods
  saveContent(content: InsertContent): Promise<ContentItem>;
  getContentHistory(userId?: number): Promise<ContentItem[]>;
  getContentById(id: number): Promise<ContentItem | undefined>;
  deleteContent(id: number): Promise<void>;
  updateContent(id: number, content: Partial<InsertContent>): Promise<ContentItem | undefined>;
}

export class DatabaseStorage implements IStorage {
  // User methods
  async getUser(id: number): Promise<User | undefined> {
    try {
      const [user] = await db.select().from(users).where(eq(users.id, id)).limit(1);
      return user;
    } catch (error) {
      console.error("Erro ao buscar usuário por ID:", error);
      return undefined;
    }
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    try {
      const [user] = await db.select().from(users).where(eq(users.username, username)).limit(1);
      return user;
    } catch (error) {
      console.error("Erro ao buscar usuário por nome de usuário:", error);
      return undefined;
    }
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    try {
      const [user] = await db.select().from(users).where(eq(users.email, email)).limit(1);
      return user;
    } catch (error) {
      console.error("Erro ao buscar usuário por email:", error);
      return undefined;
    }
  }

  async createUser(user: InsertUser): Promise<User> {
    try {
      const [newUser] = await db.insert(users).values(user).returning();
      return newUser;
    } catch (error) {
      console.error("Erro ao criar usuário:", error);
      throw new Error("Erro ao criar usuário");
    }
  }

  async updateUserPlan(userId: number, planType: string, requestsLimit: number): Promise<boolean> {
    try {
      await db.update(users)
        .set({ 
          planType, 
          requestsLimit, 
          updatedAt: new Date() 
        })
        .where(eq(users.id, userId));
      return true;
    } catch (error) {
      console.error("Erro ao atualizar plano do usuário:", error);
      return false;
    }
  }

  async incrementUserRequests(userId: number): Promise<boolean> {
    try {
      const [user] = await db.select({ requestsUsed: users.requestsUsed })
        .from(users)
        .where(eq(users.id, userId))
        .limit(1);

      if (!user) return false;

      await db.update(users)
        .set({ 
          requestsUsed: user.requestsUsed + 1,
          updatedAt: new Date()
        })
        .where(eq(users.id, userId));

      return true;
    } catch (error) {
      console.error("Erro ao incrementar requisições do usuário:", error);
      return false;
    }
  }

  async checkUserRequestsAvailable(userId: number): Promise<boolean> {
    try {
      const [user] = await db.select({
        requestsUsed: users.requestsUsed,
        requestsLimit: users.requestsLimit
      })
        .from(users)
        .where(eq(users.id, userId))
        .limit(1);

      if (!user) return false;

      return user.requestsUsed < user.requestsLimit;
    } catch (error) {
      console.error("Erro ao verificar requisições disponíveis:", error);
      return false;
    }
  }

  // Content methods
  async saveContent(content: InsertContent): Promise<ContentItem> {
    try {
      const [newContent] = await db.insert(contentItems).values(content).returning();
      return newContent;
    } catch (error) {
      console.error("Erro ao salvar conteúdo:", error);
      throw new Error("Erro ao salvar conteúdo");
    }
  }

  async getContentHistory(userId?: number): Promise<ContentItem[]> {
    try {
      if (userId) {
        return await db.select()
          .from(contentItems)
          .where(eq(contentItems.userId, userId))
          .orderBy(contentItems.createdAt);
      } else {
        return await db.select()
          .from(contentItems)
          .orderBy(contentItems.createdAt);
      }
    } catch (error) {
      console.error("Erro ao obter histórico de conteúdo:", error);
      return [];
    }
  }

  async getContentById(id: number): Promise<ContentItem | undefined> {
    try {
      const [content] = await db.select()
        .from(contentItems)
        .where(eq(contentItems.id, id))
        .limit(1);
      return content;
    } catch (error) {
      console.error("Erro ao buscar conteúdo por ID:", error);
      return undefined;
    }
  }

  async deleteContent(id: number): Promise<void> {
    try {
      await db.delete(contentItems).where(eq(contentItems.id, id));
    } catch (error) {
      console.error("Erro ao excluir conteúdo:", error);
      throw new Error("Erro ao excluir conteúdo");
    }
  }

  async updateContent(id: number, content: Partial<InsertContent>): Promise<ContentItem | undefined> {
    try {
      const [updatedContent] = await db.update(contentItems)
        .set(content)
        .where(eq(contentItems.id, id))
        .returning();
      return updatedContent;
    } catch (error) {
      console.error("Erro ao atualizar conteúdo:", error);
      return undefined;
    }
  }
}

export const storage = new DatabaseStorage();

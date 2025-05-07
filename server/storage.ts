import { users, type User, type InsertUser, ContentItem, InsertContent } from "@shared/schema";

export interface IStorage {
  // User methods (from the existing code)
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Content methods (new)
  saveContent(content: InsertContent): Promise<ContentItem>;
  getContentHistory(): Promise<ContentItem[]>;
  getContentById(id: number): Promise<ContentItem | undefined>;
  deleteContent(id: number): Promise<void>;
  updateContent(id: number, content: Partial<InsertContent>): Promise<ContentItem | undefined>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private contentItems: Map<number, ContentItem>;
  private userId: number;
  private contentId: number;

  constructor() {
    this.users = new Map();
    this.contentItems = new Map();
    this.userId = 1;
    this.contentId = 1;
  }

  // User methods (from the existing code)
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // Content methods (new)
  async saveContent(insertContent: InsertContent): Promise<ContentItem> {
    const id = this.contentId++;
    const now = new Date();
    const contentItem: ContentItem = {
      ...insertContent,
      id,
      createdAt: now,
    };
    this.contentItems.set(id, contentItem);
    return contentItem;
  }

  async getContentHistory(): Promise<ContentItem[]> {
    // Sort by most recent first
    return Array.from(this.contentItems.values()).sort((a, b) => {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }

  async getContentById(id: number): Promise<ContentItem | undefined> {
    return this.contentItems.get(id);
  }

  async deleteContent(id: number): Promise<void> {
    this.contentItems.delete(id);
  }

  async updateContent(id: number, content: Partial<InsertContent>): Promise<ContentItem | undefined> {
    const existingContent = this.contentItems.get(id);
    if (!existingContent) return undefined;

    const updatedContent: ContentItem = {
      ...existingContent,
      ...content,
    };
    this.contentItems.set(id, updatedContent);
    return updatedContent;
  }
}

export const storage = new MemStorage();

import { type User, type InsertUser, type Project, type InsertProject, type Template, type InsertTemplate, type ModelConfig, type InsertModelConfig, type MCPServer, type InsertMCPServer, type LibraryConfig, type InsertLibraryConfig, users, projects, templates, modelConfigs, mcpServers, libraryConfigs } from "@shared/schema";
import { db } from "./db";
import { eq, desc } from "drizzle-orm";
import bcrypt from "bcryptjs";

export interface IStorage {
  // Users
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: string, user: Partial<InsertUser>): Promise<User | undefined>;

  // Projects (deprecated - keeping for backwards compatibility)
  getProjects(): Promise<Project[]>;
  getProjectsByUser(userId: string): Promise<Project[]>;
  getProject(id: string): Promise<Project | undefined>;
  createProject(userId?: string, project?: InsertProject): Promise<Project>;
  updateProject(id: string, project: Partial<InsertProject>): Promise<Project | undefined>;
  deleteProject(id: string): Promise<boolean>;

  // Templates
  getTemplates(): Promise<Template[]>;
  getTemplate(id: string): Promise<Template | undefined>;
  createTemplate(template: InsertTemplate): Promise<Template>;

  // Model Configs
  getModelConfigs(): Promise<ModelConfig[]>;
  getModelConfig(id: string): Promise<ModelConfig | undefined>;
  getActiveModelConfig(): Promise<ModelConfig | undefined>;
  createModelConfig(config: InsertModelConfig): Promise<ModelConfig>;
  updateModelConfig(id: string, config: Partial<InsertModelConfig>): Promise<ModelConfig | undefined>;
  deleteModelConfig(id: string): Promise<boolean>;
  setActiveModel(id: string): Promise<void>;

  // MCP Servers
  getMCPServers(): Promise<MCPServer[]>;
  getMCPServer(id: string): Promise<MCPServer | undefined>;
  createMCPServer(server: InsertMCPServer): Promise<MCPServer>;
  updateMCPServer(id: string, server: Partial<InsertMCPServer>): Promise<MCPServer | undefined>;
  deleteMCPServer(id: string): Promise<boolean>;

  // Library Configs
  getLibraryConfigs(): Promise<LibraryConfig[]>;
  getLibraryConfig(id: string): Promise<LibraryConfig | undefined>;
  createLibraryConfig(config: InsertLibraryConfig): Promise<LibraryConfig>;
  updateLibraryConfig(id: string, config: Partial<InsertLibraryConfig>): Promise<LibraryConfig | undefined>;
  deleteLibraryConfig(id: string): Promise<boolean>;
}

export class DbStorage implements IStorage {
  // Users
  async getUser(id: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.id, id));
    return result[0];
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.email, email));
    return result[0];
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const result = await db.insert(users).values(insertUser).returning();
    return result[0];
  }

  async updateUser(id: string, updates: Partial<InsertUser>): Promise<User | undefined> {
    const result = await db.update(users).set(updates).where(eq(users.id, id)).returning();
    return result[0];
  }

  // Projects
  async getProjectsByUser(userId: string): Promise<Project[]> {
    return await db.select().from(projects).where(eq(projects.userId, userId)).orderBy(desc(projects.lastModified));
  }

  async getProject(id: string): Promise<Project | undefined> {
    const result = await db.select().from(projects).where(eq(projects.id, id));
    return result[0];
  }

  async createProject(userIdOrProject?: string | InsertProject, projectData?: InsertProject): Promise<Project> {
    // Handle both old (project only) and new (userId, project) signatures
    let userId: string | undefined;
    let insertProject: InsertProject;

    if (typeof userIdOrProject === 'string') {
      userId = userIdOrProject;
      insertProject = projectData!;
    } else {
      insertProject = userIdOrProject || projectData!;
    }

    const result = await db.insert(projects).values({ ...insertProject, ...(userId && { userId: userId as any }) }).returning();
    return result[0];
  }

  async updateProject(id: string, updates: Partial<InsertProject>): Promise<Project | undefined> {
    const result = await db
      .update(projects)
      .set({ ...updates, lastModified: new Date() })
      .where(eq(projects.id, id))
      .returning();
    return result[0];
  }

  async deleteProject(id: string): Promise<boolean> {
    const result = await db.delete(projects).where(eq(projects.id, id)).returning();
    return result.length > 0;
  }

  // Templates
  async getTemplates(): Promise<Template[]> {
    return await db.select().from(templates);
  }

  async getTemplate(id: string): Promise<Template | undefined> {
    const result = await db.select().from(templates).where(eq(templates.id, id));
    return result[0];
  }

  async createTemplate(insertTemplate: InsertTemplate): Promise<Template> {
    const result = await db.insert(templates).values(insertTemplate).returning();
    return result[0];
  }

  // Model Configs
  async getModelConfigs(): Promise<ModelConfig[]> {
    return await db.select().from(modelConfigs).orderBy(desc(modelConfigs.createdAt));
  }

  async getModelConfig(id: string): Promise<ModelConfig | undefined> {
    const result = await db.select().from(modelConfigs).where(eq(modelConfigs.id, id));
    return result[0];
  }

  async getActiveModelConfig(): Promise<ModelConfig | undefined> {
    const result = await db.select().from(modelConfigs).where(eq(modelConfigs.isActive, true));
    return result[0];
  }

  async createModelConfig(insertConfig: InsertModelConfig): Promise<ModelConfig> {
    const result = await db.insert(modelConfigs).values(insertConfig as any).returning();
    return result[0];
  }

  async updateModelConfig(id: string, updates: Partial<InsertModelConfig>): Promise<ModelConfig | undefined> {
    const result = await db.update(modelConfigs).set(updates as any).where(eq(modelConfigs.id, id)).returning();
    return result[0];
  }

  async deleteModelConfig(id: string): Promise<boolean> {
    const result = await db.delete(modelConfigs).where(eq(modelConfigs.id, id)).returning();
    return result.length > 0;
  }

  async setActiveModel(id: string): Promise<void> {
    // Deactivate all other models
    await db.update(modelConfigs).set({ isActive: false }).where(eq(modelConfigs.isActive, true));
    // Activate the selected model
    await db.update(modelConfigs).set({ isActive: true }).where(eq(modelConfigs.id, id));
  }

  // MCP Servers
  async getMCPServers(): Promise<MCPServer[]> {
    return await db.select().from(mcpServers).orderBy(desc(mcpServers.createdAt));
  }

  async getMCPServer(id: string): Promise<MCPServer | undefined> {
    const result = await db.select().from(mcpServers).where(eq(mcpServers.id, id));
    return result[0];
  }

  async createMCPServer(insertServer: InsertMCPServer): Promise<MCPServer> {
    const result = await db.insert(mcpServers).values(insertServer as any).returning();
    return result[0];
  }

  async updateMCPServer(id: string, updates: Partial<InsertMCPServer>): Promise<MCPServer | undefined> {
    const result = await db.update(mcpServers).set(updates as any).where(eq(mcpServers.id, id)).returning();
    return result[0];
  }

  async deleteMCPServer(id: string): Promise<boolean> {
    const result = await db.delete(mcpServers).where(eq(mcpServers.id, id)).returning();
    return result.length > 0;
  }

  // Library Configs
  async getLibraryConfigs(): Promise<LibraryConfig[]> {
    return await db.select().from(libraryConfigs).orderBy(desc(libraryConfigs.createdAt));
  }

  async getLibraryConfig(id: string): Promise<LibraryConfig | undefined> {
    const result = await db.select().from(libraryConfigs).where(eq(libraryConfigs.id, id));
    return result[0];
  }

  async createLibraryConfig(insertConfig: InsertLibraryConfig): Promise<LibraryConfig> {
    const result = await db.insert(libraryConfigs).values(insertConfig as any).returning();
    return result[0];
  }

  async updateLibraryConfig(id: string, updates: Partial<InsertLibraryConfig>): Promise<LibraryConfig | undefined> {
    const result = await db.update(libraryConfigs).set(updates as any).where(eq(libraryConfigs.id, id)).returning();
    return result[0];
  }

  async deleteLibraryConfig(id: string): Promise<boolean> {
    const result = await db.delete(libraryConfigs).where(eq(libraryConfigs.id, id)).returning();
    return result.length > 0;
  }
}

export const storage = new DbStorage();

// Seed templates on startup if none exist
async function seedTemplates() {
  try {
    const existingTemplates = await storage.getTemplates();
    if (existingTemplates.length > 0) return;
  } catch (error) {
    console.error("Error checking existing templates:", error);
    throw error;
  }

  const templateData: InsertTemplate[] = [
    {
      name: "Modern Landing Page",
      description: "A clean, responsive landing page with hero section, features grid, and call-to-action",
      category: "landing",
      language: "html",
      techStack: ["HTML", "CSS", "JavaScript"],
      thumbnail: null,
      code: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Modern Landing Page</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; }
    .hero { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 100px 20px; text-align: center; }
    .hero h1 { font-size: 3rem; margin-bottom: 20px; }
    .hero p { font-size: 1.2rem; margin-bottom: 30px; opacity: 0.9; }
    .btn { background: white; color: #667eea; padding: 15px 40px; border: none; border-radius: 50px; font-size: 1rem; cursor: pointer; font-weight: bold; }
    .features { padding: 80px 20px; max-width: 1200px; margin: 0 auto; }
    .feature-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 40px; margin-top: 40px; }
    .feature { padding: 30px; background: #f8f9fa; border-radius: 10px; }
    .feature h3 { margin-bottom: 15px; color: #667eea; }
  </style>
</head>
<body>
  <div class="hero">
    <h1>Build Something Amazing</h1>
    <p>The fastest way to launch your project</p>
    <button class="btn">Get Started</button>
  </div>
  <div class="features">
    <h2 style="text-align: center; font-size: 2.5rem; margin-bottom: 20px;">Features</h2>
    <div class="feature-grid">
      <div class="feature">
        <h3>Fast & Easy</h3>
        <p>Get started in minutes with our intuitive interface</p>
      </div>
      <div class="feature">
        <h3>Responsive</h3>
        <p>Looks great on all devices, from mobile to desktop</p>
      </div>
      <div class="feature">
        <h3>Customizable</h3>
        <p>Easily customize to match your brand</p>
      </div>
    </div>
  </div>
</body>
</html>`,
    },
    {
      name: "SaaS Dashboard",
      description: "Professional dashboard template with sidebar navigation and data visualization",
      category: "saas",
      language: "html",
      techStack: ["HTML", "CSS", "JavaScript"],
      thumbnail: null,
      code: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>SaaS Dashboard</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; display: flex; height: 100vh; background: #f5f5f5; }
    .sidebar { width: 250px; background: #1a1a2e; color: white; padding: 20px; }
    .sidebar h2 { margin-bottom: 30px; }
    .nav-item { padding: 12px; margin: 5px 0; border-radius: 8px; cursor: pointer; }
    .nav-item:hover { background: #16213e; }
    .main { flex: 1; padding: 30px; overflow-y: auto; }
    .header { background: white; padding: 20px; border-radius: 10px; margin-bottom: 30px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
    .cards { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 20px; }
    .card { background: white; padding: 25px; border-radius: 10px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
    .card h3 { color: #666; font-size: 0.9rem; margin-bottom: 10px; }
    .card .value { font-size: 2rem; font-weight: bold; color: #1a1a2e; }
  </style>
</head>
<body>
  <div class="sidebar">
    <h2>Dashboard</h2>
    <div class="nav-item">📊 Overview</div>
    <div class="nav-item">📈 Analytics</div>
    <div class="nav-item">👥 Users</div>
    <div class="nav-item">⚙️ Settings</div>
  </div>
  <div class="main">
    <div class="header">
      <h1>Welcome back!</h1>
      <p style="color: #666; margin-top: 5px;">Here's what's happening with your app today.</p>
    </div>
    <div class="cards">
      <div class="card">
        <h3>TOTAL USERS</h3>
        <div class="value">2,543</div>
      </div>
      <div class="card">
        <h3>REVENUE</h3>
        <div class="value">$12,345</div>
      </div>
      <div class="card">
        <h3>GROWTH</h3>
        <div class="value">+23%</div>
      </div>
    </div>
  </div>
</body>
</html>`,
    },
    {
      name: "AI Chatbot Interface",
      description: "Simple chatbot UI with message history and input",
      category: "chatbot",
      language: "html",
      techStack: ["HTML", "CSS", "JavaScript"],
      thumbnail: null,
      code: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>AI Chatbot</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; display: flex; justify-content: center; align-items: center; height: 100vh; background: #f0f2f5; }
    .chat-container { width: 100%; max-width: 600px; height: 80vh; background: white; border-radius: 20px; box-shadow: 0 10px 40px rgba(0,0,0,0.1); display: flex; flex-direction: column; }
    .chat-header { padding: 20px; border-bottom: 1px solid #e5e5e5; }
    .chat-header h2 { font-size: 1.3rem; }
    .messages { flex: 1; padding: 20px; overflow-y: auto; }
    .message { margin-bottom: 15px; display: flex; }
    .message.user { justify-content: flex-end; }
    .message-bubble { max-width: 70%; padding: 12px 18px; border-radius: 18px; }
    .message.bot .message-bubble { background: #e5e5e5; }
    .message.user .message-bubble { background: #007aff; color: white; }
    .input-area { padding: 20px; border-top: 1px solid #e5e5e5; display: flex; gap: 10px; }
    .input-area input { flex: 1; padding: 12px; border: 1px solid #e5e5e5; border-radius: 20px; font-size: 1rem; }
    .input-area button { padding: 12px 24px; background: #007aff; color: white; border: none; border-radius: 20px; cursor: pointer; font-weight: 600; }
  </style>
</head>
<body>
  <div class="chat-container">
    <div class="chat-header">
      <h2>AI Assistant</h2>
    </div>
    <div class="messages" id="messages">
      <div class="message bot">
        <div class="message-bubble">Hello! How can I help you today?</div>
      </div>
    </div>
    <div class="input-area">
      <input type="text" id="messageInput" placeholder="Type a message...">
      <button onclick="sendMessage()">Send</button>
    </div>
  </div>
  <script>
    function sendMessage() {
      const input = document.getElementById('messageInput');
      const messages = document.getElementById('messages');
      if (input.value.trim()) {
        messages.innerHTML += '<div class="message user"><div class="message-bubble">' + input.value + '</div></div>';
        input.value = '';
        messages.scrollTop = messages.scrollHeight;
        setTimeout(() => {
          messages.innerHTML += '<div class="message bot"><div class="message-bubble">Thanks for your message! This is a demo chatbot.</div></div>';
          messages.scrollTop = messages.scrollHeight;
        }, 1000);
      }
    }
    document.getElementById('messageInput').addEventListener('keypress', (e) => {
      if (e.key === 'Enter') sendMessage();
    });
  </script>
</body>
</html>`,
    },
  ];

  try {
    for (const template of templateData) {
      await storage.createTemplate(template);
    }
    console.log(`Successfully seeded ${templateData.length} templates`);
  } catch (error) {
    console.error("Error creating template:", error);
    throw error;
  }
}

// Seed templates with error handling
seedTemplates().catch((error) => {
  console.error("Failed to seed templates:", error);
  // Don't crash the app if seeding fails - templates can be added later
});
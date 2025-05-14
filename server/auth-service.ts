import { db } from './db';
import { users, RegisterUser, LoginUser, InsertUser } from '@shared/schema';
import { eq, and } from 'drizzle-orm';
import * as crypto from 'crypto';

// Função para gerar um hash de senha usando SHA-256 com sal
function hashPassword(password: string, salt: string = ''): { hash: string, salt: string } {
  // Se o salt não for fornecido, gerar um novo
  if (!salt) {
    salt = crypto.randomBytes(16).toString('hex');
  }
  
  // Criar o hash combinando a senha com o salt
  const hash = crypto
    .createHash('sha256')
    .update(password + salt)
    .digest('hex');
  
  return { hash, salt };
}

// Função para verificar se uma senha corresponde ao hash armazenado
function verifyPassword(plainPassword: string, storedHash: string, salt: string): boolean {
  const { hash } = hashPassword(plainPassword, salt);
  return hash === storedHash;
}

// Serviço de autenticação
export const authService = {
  // Registrar um novo usuário
  async registerUser(userData: RegisterUser): Promise<{ success: boolean; userId?: number; message?: string }> {
    try {
      // Verificar se o usuário ou email já existe
      const existingUser = await db.select({ id: users.id })
        .from(users)
        .where(
          or(
            eq(users.username, userData.username),
            eq(users.email, userData.email)
          )
        )
        .limit(1);

      if (existingUser.length > 0) {
        return { 
          success: false, 
          message: 'Usuário ou email já cadastrado' 
        };
      }

      // Criar hash da senha
      const { hash, salt } = hashPassword(userData.password);
      
      // Criar um objeto com os dados do usuário para inserção
      const userToInsert: InsertUser = {
        username: userData.username,
        email: userData.email,
        name: userData.name,
        password: `${hash}:${salt}`, // Armazenar o hash e o salt juntos
        planType: 'free',
        requestsUsed: 0,
        requestsLimit: 10,
        createdAt: new Date(),
        updatedAt: new Date(),
        emailVerified: 0
      };

      // Inserir o usuário no banco de dados
      const [newUser] = await db.insert(users).values(userToInsert).returning({ id: users.id });

      return { 
        success: true, 
        userId: newUser.id 
      };
    } catch (error) {
      console.error('Erro ao registrar usuário:', error);
      return { 
        success: false, 
        message: 'Erro ao registrar usuário' 
      };
    }
  },

  // Login de usuário
  async loginUser(credentials: LoginUser): Promise<{ success: boolean; user?: any; message?: string }> {
    try {
      // Buscar o usuário pelo email
      const [foundUser] = await db.select()
        .from(users)
        .where(eq(users.email, credentials.email))
        .limit(1);

      if (!foundUser) {
        return { 
          success: false, 
          message: 'Usuário não encontrado' 
        };
      }

      // Extrair o hash e o salt da senha armazenada
      const [storedHash, salt] = foundUser.password.split(':');
      
      // Verificar a senha
      if (!verifyPassword(credentials.password, storedHash, salt)) {
        return { 
          success: false, 
          message: 'Senha incorreta' 
        };
      }

      // Atualizar a data do último login
      await db.update(users)
        .set({ 
          lastLoginAt: new Date(),
          updatedAt: new Date()
        })
        .where(eq(users.id, foundUser.id));

      // Remover a senha antes de retornar o usuário
      const { password, ...userWithoutPassword } = foundUser;
      
      return { 
        success: true, 
        user: userWithoutPassword 
      };
    } catch (error) {
      console.error('Erro ao fazer login:', error);
      return { 
        success: false, 
        message: 'Erro ao fazer login' 
      };
    }
  },

  // Obter informações do usuário
  async getUserById(userId: number): Promise<any> {
    try {
      const [foundUser] = await db.select()
        .from(users)
        .where(eq(users.id, userId))
        .limit(1);

      if (foundUser) {
        // Remover a senha antes de retornar o usuário
        const { password, ...userWithoutPassword } = foundUser;
        return userWithoutPassword;
      }
      
      return null;
    } catch (error) {
      console.error('Erro ao buscar usuário:', error);
      return null;
    }
  },

  // Atualizar o plano do usuário
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
      console.error('Erro ao atualizar plano do usuário:', error);
      return false;
    }
  },

  // Incrementar o contador de requisições do usuário
  async incrementUserRequests(userId: number): Promise<boolean> {
    try {
      const [user] = await db.select({ requestsUsed: users.requestsUsed })
        .from(users)
        .where(eq(users.id, userId));

      if (user) {
        await db.update(users)
          .set({ 
            requestsUsed: user.requestsUsed + 1,
            updatedAt: new Date()
          })
          .where(eq(users.id, userId));
        
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Erro ao incrementar requisições do usuário:', error);
      return false;
    }
  },

  // Verificar se o usuário ainda tem requisições disponíveis
  async checkUserRequestsAvailable(userId: number): Promise<boolean> {
    try {
      const [user] = await db.select({ 
        requestsUsed: users.requestsUsed,
        requestsLimit: users.requestsLimit
      })
        .from(users)
        .where(eq(users.id, userId));

      if (user) {
        return user.requestsUsed < user.requestsLimit;
      }
      
      return false;
    } catch (error) {
      console.error('Erro ao verificar requisições disponíveis:', error);
      return false;
    }
  }
};
import { db } from './db';
import { users, RegisterUser, LoginUser, InsertUser, ForgotPassword, ResetPassword } from '@shared/schema';
import { eq, and, or, isNull, gt } from 'drizzle-orm';
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
  },

  // Criar token para redefinição de senha
  async createPasswordResetToken(email: string): Promise<{ success: boolean; message?: string }> {
    try {
      // Verificar se o usuário existe
      const [foundUser] = await db.select({ id: users.id })
        .from(users)
        .where(eq(users.email, email))
        .limit(1);

      if (!foundUser) {
        // Por questões de segurança, não informamos se o email existe ou não
        return { 
          success: true, 
          message: 'Se o email existir, um link de redefinição será enviado.' 
        };
      }

      // Gerar token
      const token = crypto.randomBytes(32).toString('hex');
      const expiresAt = new Date();
      expiresAt.setHours(expiresAt.getHours() + 1); // Token válido por 1 hora

      // Salvar o token e a data de expiração no banco de dados
      await db.update(users)
        .set({ 
          resetPasswordToken: token,
          resetPasswordExpires: expiresAt,
          updatedAt: new Date()
        })
        .where(eq(users.id, foundUser.id));

      // Aqui implementaríamos o envio de email (em uma aplicação real)
      // Por enquanto apenas retornamos sucesso
      console.log(`[DEBUG] Token de redefinição gerado para ${email}: ${token}`);

      return { 
        success: true, 
        message: 'Se o email existir, um link de redefinição será enviado.' 
      };

    } catch (error) {
      console.error('Erro ao criar token de redefinição:', error);
      return { 
        success: false, 
        message: 'Erro ao processar a solicitação' 
      };
    }
  },

  // Verificar token e redefinir senha
  async resetPassword(token: string, newPassword: string): Promise<{ success: boolean; message?: string }> {
    try {
      // Buscar usuário com o token fornecido
      const now = new Date();
      const [foundUser] = await db.select()
        .from(users)
        .where(
          and(
            eq(users.resetPasswordToken, token),
            gt(users.resetPasswordExpires!, now) // Token ainda não expirou
          )
        )
        .limit(1);

      if (!foundUser) {
        return { 
          success: false, 
          message: 'Token inválido ou expirado' 
        };
      }

      // Criar hash da nova senha
      const { hash, salt } = hashPassword(newPassword);

      // Atualizar a senha e limpar o token
      await db.update(users)
        .set({ 
          password: `${hash}:${salt}`,
          resetPasswordToken: null,
          resetPasswordExpires: null,
          updatedAt: new Date()
        })
        .where(eq(users.id, foundUser.id));

      return { 
        success: true, 
        message: 'Senha redefinida com sucesso' 
      };
    } catch (error) {
      console.error('Erro ao redefinir senha:', error);
      return { 
        success: false, 
        message: 'Erro ao redefinir senha' 
      };
    }
  }
};
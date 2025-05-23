import express from 'express';
import { authService } from './auth-service';
import { registerUserSchema, loginUserSchema, forgotPasswordSchema, resetPasswordSchema } from '@shared/schema';
import { ZodError } from 'zod';
import crypto from 'crypto';

// Estender o tipo SessionData para incluir o userId
declare module 'express-session' {
  interface SessionData {
    userId: number;
  }
}

// Tipos para as requisições de recuperação de senha
interface ForgotPasswordRequest {
  email: string;
}

interface ResetPasswordRequest {
  token: string;
  password: string;
}

const router = express.Router();

// Middleware para verificar se o usuário está autenticado
export const isAuthenticated = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  if (req.session && req.session.userId) {
    return next();
  }
  return res.status(401).json({ success: false, message: 'Não autenticado' });
};

// Função auxiliar para segurança: sempre usar req.session.userId! ou 0 quando não estiver definido
// para evitar erros de tipo ao passar para authService
function getUserId(req: express.Request): number {
  return req.session?.userId || 0;
};

// Rota para registrar um novo usuário
router.post('/register', async (req, res) => {
  try {
    // Validar dados de entrada usando Zod
    const userData = registerUserSchema.parse(req.body);
    
    // Registrar o usuário
    const result = await authService.registerUser(userData);
    
    if (result.success && result.userId) {
      // Definir o ID do usuário na sessão
      req.session.userId = result.userId;
      
      return res.status(201).json({
        success: true,
        message: 'Usuário registrado com sucesso'
      });
    } else {
      return res.status(400).json({
        success: false,
        message: result.message || 'Erro ao registrar usuário'
      });
    }
  } catch (error) {
    console.error('Erro ao processar registro:', error);
    
    // Se for um erro de validação do Zod
    if (error instanceof ZodError) {
      return res.status(400).json({
        success: false,
        message: 'Dados de registro inválidos',
        errors: error.errors
      });
    }
    
    return res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

// Rota para login
router.post('/login', async (req, res) => {
  try {
    // Validar dados de entrada usando Zod
    const credentials = loginUserSchema.parse(req.body);
    
    // Fazer login
    const result = await authService.loginUser(credentials);
    
    if (result.success && result.user) {
      // Definir o ID do usuário na sessão
      req.session.userId = result.user.id;
      
      return res.status(200).json({
        success: true,
        message: 'Login realizado com sucesso',
        user: {
          id: result.user.id,
          username: result.user.username,
          email: result.user.email,
          name: result.user.name,
          profileImageUrl: result.user.profileImageUrl,
          planType: result.user.planType
        }
      });
    } else {
      return res.status(401).json({
        success: false,
        message: result.message || 'Credenciais inválidas'
      });
    }
  } catch (error) {
    console.error('Erro ao processar login:', error);
    
    // Se for um erro de validação do Zod
    if (error instanceof ZodError) {
      return res.status(400).json({
        success: false,
        message: 'Dados de login inválidos',
        errors: error.errors
      });
    }
    
    return res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

// Rota para logout
router.post('/logout', (req, res) => {
  if (req.session) {
    req.session.destroy(err => {
      if (err) {
        return res.status(500).json({
          success: false,
          message: 'Erro ao fazer logout'
        });
      }
      
      return res.status(200).json({
        success: true,
        message: 'Logout realizado com sucesso'
      });
    });
  } else {
    return res.status(200).json({
      success: true,
      message: 'Usuário já desconectado'
    });
  }
});

// Rota para obter informações do usuário atual
router.get('/me', isAuthenticated, async (req, res) => {
  try {
    const userId = getUserId(req);
    const user = await authService.getUserById(userId);
    
    if (user) {
      return res.status(200).json({
        success: true,
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          name: user.name,
          profileImageUrl: user.profileImageUrl,
          planType: user.planType,
          requestsUsed: user.requestsUsed,
          requestsLimit: user.requestsLimit
        }
      });
    } else {
      return res.status(404).json({
        success: false,
        message: 'Usuário não encontrado'
      });
    }
  } catch (error) {
    console.error('Erro ao obter informações do usuário:', error);
    return res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

// Rota para verificar se o usuário ainda tem requisições disponíveis
router.get('/check-requests', isAuthenticated, async (req, res) => {
  try {
    const userId = getUserId(req);
    const hasRequestsAvailable = await authService.checkUserRequestsAvailable(userId);
    
    return res.status(200).json({
      success: true,
      hasRequestsAvailable
    });
  } catch (error) {
    console.error('Erro ao verificar requisições disponíveis:', error);
    return res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

// Rota para solicitar redefinição de senha (esqueci minha senha)
router.post('/forgot-password', async (req, res) => {
  try {
    // Validar dados de entrada usando Zod
    const data = forgotPasswordSchema.parse(req.body);
    
    // Solicitar criação de token para redefinição
    const result = await authService.createPasswordResetToken(data.email);
    
    return res.status(200).json({
      success: true,
      message: 'Se o email existir, um link de redefinição será enviado.'
    });
    
  } catch (error) {
    console.error('Erro ao processar solicitação de redefinição:', error);
    
    // Se for um erro de validação do Zod
    if (error instanceof ZodError) {
      return res.status(400).json({
        success: false,
        message: 'Email inválido',
        errors: error.errors
      });
    }
    
    return res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

// Rota para redefinir senha com token
router.post('/reset-password', async (req, res) => {
  try {
    // Validar dados de entrada usando Zod
    const data = resetPasswordSchema.parse(req.body);
    
    // Tentar redefinir a senha
    const result = await authService.resetPassword(data.token, data.password);
    
    if (result.success) {
      return res.status(200).json({
        success: true,
        message: 'Senha redefinida com sucesso'
      });
    } else {
      return res.status(400).json({
        success: false,
        message: result.message || 'Erro ao redefinir senha'
      });
    }
    
  } catch (error) {
    console.error('Erro ao processar redefinição de senha:', error);
    
    // Se for um erro de validação do Zod
    if (error instanceof ZodError) {
      return res.status(400).json({
        success: false,
        message: 'Dados de redefinição inválidos',
        errors: error.errors
      });
    }
    
    return res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

// Middleware para incrementar contador de requisições após cada geração de conteúdo
export const incrementUserRequests = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  if (req.session && req.session.userId) {
    try {
      await authService.incrementUserRequests(getUserId(req));
    } catch (error) {
      console.error('Erro ao incrementar contador de requisições:', error);
    }
  }
  next();
};

export default router;
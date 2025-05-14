import React, { useState } from 'react';
import { useLocation } from 'wouter';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useToast } from "@/hooks/use-toast";
import { Sparkles, Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

// Esquema para validação do formulário de login
const loginSchema = z.object({
  email: z.string().email({ message: "E-mail inválido" }),
  password: z.string().min(6, { message: "Senha deve ter pelo menos 6 caracteres" }),
});

// Esquema para validação do formulário de registro
const registerSchema = z.object({
  name: z.string().min(2, { message: "Nome deve ter pelo menos 2 caracteres" }),
  email: z.string().email({ message: "E-mail inválido" }),
  password: z.string().min(6, { message: "Senha deve ter pelo menos 6 caracteres" }),
  confirmPassword: z.string().min(6, { message: "Confirmação de senha deve ter pelo menos 6 caracteres" }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "As senhas não coincidem",
  path: ["confirmPassword"],
});

type LoginFormValues = z.infer<typeof loginSchema>;
type RegisterFormValues = z.infer<typeof registerSchema>;

export default function Login() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  
  // Formulário de login
  const loginForm = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // Formulário de registro
  const registerForm = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onLoginSubmit = async (values: LoginFormValues) => {
    try {
      setIsLoading(true);
      const success = await login(values.email, values.password);
      
      if (success) {
        toast({
          title: "Login realizado com sucesso!",
          description: "Redirecionando para o gerador de roteiros...",
        });
        
        // Redirecionamento após o login
        setTimeout(() => {
          setLocation("/generator");
        }, 1500);
      } else {
        toast({
          title: "Erro ao fazer login",
          description: "Verifique suas credenciais e tente novamente.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Erro ao fazer login",
        description: "Ocorreu um erro ao processar sua solicitação.",
        variant: "destructive",
      });
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const onRegisterSubmit = (values: RegisterFormValues) => {
    console.log(values);
    // Aqui você adicionaria a lógica de registro
    toast({
      title: "Conta criada com sucesso!",
      description: "Você já pode fazer login.",
    });
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 py-12">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-amber-400 to-amber-600">
              Acesse
            </span>{" "}
            sua conta
          </h1>
          <p className="text-gray-400 mt-2">
            Faça login para acessar o gerador de roteiros profissionais
          </p>
        </div>

        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="register">Criar Conta</TabsTrigger>
          </TabsList>
          
          {/* Aba de Login */}
          <TabsContent value="login">
            <Card className="bg-gray-800/80 backdrop-blur-sm border border-gray-700/50 shadow-xl">
              <CardHeader>
                <CardTitle className="text-white">Login</CardTitle>
                <CardDescription>
                  Entre com seu e-mail e senha para acessar sua conta
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...loginForm}>
                  <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-4">
                    <FormField
                      control={loginForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-white">E-mail</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="seunome@exemplo.com"
                              className="bg-gray-900 border-gray-700 text-white"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={loginForm.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-white">Senha</FormLabel>
                          <FormControl>
                            <Input
                              type="password"
                              placeholder="••••••••"
                              className="bg-gray-900 border-gray-700 text-white"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <Button 
                      type="submit"
                      className="w-full py-5 mt-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Processando...
                        </>
                      ) : (
                        "Entrar"
                      )}
                    </Button>
                  </form>
                </Form>
              </CardContent>
              <CardFooter className="flex justify-center border-t border-gray-700/50 pt-4">
                <div className="text-sm text-gray-400">
                  <a href="#" className="text-amber-400 hover:underline">
                    Esqueci minha senha
                  </a>
                </div>
              </CardFooter>
            </Card>
          </TabsContent>
          
          {/* Aba de Registro */}
          <TabsContent value="register">
            <Card className="bg-gray-800/80 backdrop-blur-sm border border-gray-700/50 shadow-xl">
              <CardHeader>
                <CardTitle className="text-white">Criar Conta</CardTitle>
                <CardDescription>
                  Preencha os dados abaixo para criar sua conta
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...registerForm}>
                  <form onSubmit={registerForm.handleSubmit(onRegisterSubmit)} className="space-y-4">
                    <FormField
                      control={registerForm.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-white">Nome</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Seu nome completo"
                              className="bg-gray-900 border-gray-700 text-white"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={registerForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-white">E-mail</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="seunome@exemplo.com"
                              className="bg-gray-900 border-gray-700 text-white"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={registerForm.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-white">Senha</FormLabel>
                          <FormControl>
                            <Input
                              type="password"
                              placeholder="••••••••"
                              className="bg-gray-900 border-gray-700 text-white"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={registerForm.control}
                      name="confirmPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-white">Confirmar Senha</FormLabel>
                          <FormControl>
                            <Input
                              type="password"
                              placeholder="••••••••"
                              className="bg-gray-900 border-gray-700 text-white"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <Button 
                      type="submit"
                      className="w-full py-5 mt-2 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold"
                    >
                      <Sparkles className="w-5 h-5 mr-2" />
                      Criar Conta
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        
        <div className="mt-8 text-center">
          <div className="text-sm text-gray-400">
            Ao criar uma conta, você concorda com nossos{" "}
            <a href="#" className="text-amber-400 hover:underline">
              Termos de Serviço
            </a>{" "}
            e{" "}
            <a href="#" className="text-amber-400 hover:underline">
              Política de Privacidade
            </a>
          </div>
          
          <div className="mt-6 bg-gray-900/50 p-4 rounded-lg border border-gray-800">
            <div className="text-sm text-gray-300 flex items-center justify-center">
              <span className="bg-amber-500/20 text-amber-400 text-xs px-2 py-1 rounded-full mr-2">NOVO</span>
              Experimente 7 dias grátis no plano Premium!
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
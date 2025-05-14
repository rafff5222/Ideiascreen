import React, { useState } from 'react';
import { useLocation } from 'wouter';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useToast } from "@/hooks/use-toast";
import { Sparkles, Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

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

type RegisterFormValues = z.infer<typeof registerSchema>;

export default function Register() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  
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

  const onRegisterSubmit = async (values: RegisterFormValues) => {
    try {
      setIsLoading(true);
      
      // Simulando um cadastro (em produção, você enviaria para o backend)
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Após o cadastro bem-sucedido, fazemos login automaticamente
      const success = await login(values.email, values.password);
      
      if (success) {
        toast({
          title: "Conta criada com sucesso!",
          description: "Bem-vindo ao IDEIASCREEN. Redirecionando para o gerador...",
        });
        
        // Redirecionamento após o registro e login
        setTimeout(() => {
          setLocation("/generator");
        }, 1500);
      } else {
        toast({
          title: "Conta criada, mas falha ao fazer login automático",
          description: "Por favor, tente fazer login manualmente.",
          variant: "destructive",
        });
        
        setTimeout(() => {
          setLocation("/login");
        }, 1500);
      }
    } catch (error) {
      toast({
        title: "Erro ao criar conta",
        description: "Ocorreu um erro ao processar sua solicitação.",
        variant: "destructive",
      });
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 py-12">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-amber-400 to-amber-600">
              Crie
            </span>{" "}
            sua conta
          </h1>
          <p className="text-gray-400 mt-2">
            Registre-se para acessar o gerador de roteiros profissionais
          </p>
        </div>

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
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Processando...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5 mr-2" />
                      Criar Conta
                    </>
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
          <CardFooter className="flex justify-center border-t border-gray-700/50 pt-4">
            <div className="text-sm text-gray-400">
              Já tem uma conta?{" "}
              <a href="/login" className="text-amber-400 hover:underline">
                Faça login
              </a>
            </div>
          </CardFooter>
        </Card>
        
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
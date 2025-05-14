import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link, useLocation } from "wouter";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, CheckCircle2, ArrowRight, UserPlus } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

// Esquema de validação
const registerSchema = z.object({
  username: z.string()
    .min(3, { message: "Nome de usuário deve ter pelo menos 3 caracteres" })
    .max(20, { message: "Nome de usuário não pode ter mais de 20 caracteres" })
    .regex(/^[a-zA-Z0-9_]+$/, { 
      message: "Nome de usuário pode conter apenas letras, números e sublinhado (_)" 
    }),
  email: z.string()
    .email({ message: "Email inválido" }),
  name: z.string()
    .min(2, { message: "Nome deve ter pelo menos 2 caracteres" }),
  password: z.string()
    .min(6, { message: "Senha deve ter pelo menos 6 caracteres" }),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "As senhas não coincidem",
  path: ["confirmPassword"]
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export default function Register() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  // Inicializar form
  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: "",
      email: "",
      name: "",
      password: "",
      confirmPassword: ""
    }
  });

  // Função para lidar com o envio do formulário
  const onSubmit = async (values: RegisterFormValues) => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Remover confirmPassword antes de enviar para a API
      const { confirmPassword, ...registerData } = values;
      
      // Enviar dados para a API
      const response = await apiRequest("POST", "/api/auth/register", registerData);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || "Erro ao registrar usuário");
      }
      
      // Registro bem-sucedido
      setSuccess(true);
      toast({
        title: "Registro realizado com sucesso!",
        description: "Você já pode acessar todos os recursos da plataforma.",
        variant: "success"
      });
      
      // Redirecionar após 2 segundos
      setTimeout(() => {
        setLocation("/");
      }, 2000);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Erro ao registrar usuário";
      setError(errorMessage);
      toast({
        title: "Erro no cadastro",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container flex items-center justify-center min-h-[calc(100vh-80px)] py-8">
      <Card className="w-full max-w-lg shadow-lg border-amber-100/20">
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl font-bold">Criar Conta</CardTitle>
            <UserPlus className="h-6 w-6 text-amber-500" />
          </div>
          <CardDescription>
            Crie sua conta gratuita para acessar todos os recursos da plataforma.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Mensagem de erro */}
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Erro</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          {/* Mensagem de sucesso */}
          {success && (
            <Alert variant="success" className="mb-4 bg-green-50 text-green-800 border-green-200">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <AlertTitle>Conta criada com sucesso!</AlertTitle>
              <AlertDescription>Redirecionando para a página inicial...</AlertDescription>
            </Alert>
          )}
          
          {/* Formulário de registro */}
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome de usuário</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Seu nome de usuário único" 
                        {...field} 
                        disabled={isLoading || success}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome completo</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Seu nome completo" 
                        {...field} 
                        disabled={isLoading || success}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input 
                        type="email" 
                        placeholder="seu.email@exemplo.com" 
                        {...field} 
                        disabled={isLoading || success}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Senha</FormLabel>
                    <FormControl>
                      <Input 
                        type="password" 
                        placeholder="Crie uma senha segura" 
                        {...field} 
                        disabled={isLoading || success}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirmar senha</FormLabel>
                    <FormControl>
                      <Input 
                        type="password" 
                        placeholder="Confirme sua senha" 
                        {...field} 
                        disabled={isLoading || success}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <Button 
                type="submit" 
                disabled={isLoading || success} 
                className="w-full bg-amber-500 hover:bg-amber-600 text-white"
              >
                {isLoading ? "Registrando..." : "Criar conta"}
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex flex-col">
          <div className="text-sm text-center w-full mt-2">
            Já tem uma conta?{" "}
            <Link href="/login" className="text-amber-500 hover:text-amber-600 font-medium">
              Fazer login
            </Link>
          </div>
          
          <div className="flex justify-center w-full mt-4">
            <Link href="/" className="text-gray-600 hover:text-amber-600 text-sm flex items-center">
              <ArrowRight className="mr-1 h-4 w-4" />
              Voltar para página inicial
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
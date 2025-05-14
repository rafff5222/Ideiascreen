import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link, useLocation } from "wouter";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, LogIn, ArrowRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

// Esquema de validação
const loginSchema = z.object({
  email: z.string()
    .email({ message: "Email inválido" }),
  password: z.string()
    .min(1, { message: "A senha é obrigatória" })
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function Login() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { login, isAuthenticated } = useAuth();
  
  // Redirecionar se já estiver autenticado
  useEffect(() => {
    if (isAuthenticated) {
      setLocation("/");
    }
  }, [isAuthenticated, setLocation]);

  // Inicializar form
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: ""
    }
  });

  // Função para lidar com o envio do formulário
  const onSubmit = async (values: LoginFormValues) => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Utilizar função de login do contexto de autenticação
      const success = await login(values.email, values.password);
      
      if (success) {
        // Login bem-sucedido
        toast({
          title: "Login realizado com sucesso!",
          description: "Redirecionando para a página inicial...",
          variant: "default"
        });
        
        // Redirecionar para a página principal
        setTimeout(() => {
          setLocation("/");
        }, 1000);
      } else {
        throw new Error("Falha na autenticação. Verifique seu email e senha.");
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Erro ao fazer login";
      setError(errorMessage);
      toast({
        title: "Erro no login",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container flex items-center justify-center min-h-[calc(100vh-80px)] py-8">
      <Card className="w-full max-w-md shadow-lg border-amber-100/20">
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl font-bold">Entrar</CardTitle>
            <LogIn className="h-6 w-6 text-amber-500" />
          </div>
          <CardDescription>
            Entre com suas credenciais para acessar a plataforma.
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
          
          {/* Formulário de login */}
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
                        disabled={isLoading}
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
                    <div className="flex items-center justify-between">
                      <FormLabel>Senha</FormLabel>
                      <Link 
                        href="/forgot-password" 
                        className="text-xs text-amber-500 hover:text-amber-600 hover:underline"
                      >
                        Esqueceu a senha?
                      </Link>
                    </div>
                    <FormControl>
                      <Input 
                        type="password" 
                        placeholder="Digite sua senha" 
                        {...field} 
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <Button 
                type="submit" 
                disabled={isLoading} 
                className="w-full bg-amber-500 hover:bg-amber-600 text-white"
              >
                {isLoading ? "Entrando..." : "Entrar"}
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex flex-col">
          <div className="text-sm text-center w-full mt-2">
            Ainda não tem uma conta?{" "}
            <Link href="/register" className="text-amber-500 hover:text-amber-600 font-medium">
              Criar conta
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
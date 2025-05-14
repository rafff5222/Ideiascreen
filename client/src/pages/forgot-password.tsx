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
import { AlertCircle, KeyRound, ArrowRight, CheckCircle2 } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

// Esquema de validação
const forgotPasswordSchema = z.object({
  email: z.string()
    .email({ message: "Email inválido" }),
});

type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPassword() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { isAuthenticated } = useAuth();
  
  // Redirecionar se já estiver autenticado
  useEffect(() => {
    if (isAuthenticated) {
      setLocation("/");
    }
  }, [isAuthenticated, setLocation]);

  // Inicializar form
  const form = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    }
  });

  // Função para lidar com o envio do formulário
  const onSubmit = async (values: ForgotPasswordFormValues) => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Enviar requisição para o backend
      const response = await apiRequest("POST", "/api/auth/forgot-password", values);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || "Erro ao processar a solicitação");
      }
      
      // Mostrar mensagem de sucesso
      setSuccess(true);
      toast({
        title: "E-mail enviado!",
        description: "Verifique sua caixa de entrada para redefinir sua senha.",
        variant: "default"
      });
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Erro ao processar a solicitação";
      setError(errorMessage);
      toast({
        title: "Erro",
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
            <CardTitle className="text-2xl font-bold">Recuperar Senha</CardTitle>
            <KeyRound className="h-6 w-6 text-amber-500" />
          </div>
          <CardDescription>
            Digite seu e-mail para receber um link de recuperação de senha.
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
            <Alert className="mb-4 bg-green-50 text-green-800 border-green-200">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <AlertTitle>E-mail enviado!</AlertTitle>
              <AlertDescription>
                Enviamos um link de recuperação para o seu e-mail. Verifique sua caixa de entrada e siga as instruções.
              </AlertDescription>
            </Alert>
          )}
          
          {/* Formulário de recuperação */}
          {!success && (
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
                
                <Button 
                  type="submit" 
                  disabled={isLoading} 
                  className="w-full bg-amber-500 hover:bg-amber-600 text-white"
                >
                  {isLoading ? "Enviando..." : "Enviar link de recuperação"}
                </Button>
              </form>
            </Form>
          )}
          
          {/* Botão de voltar para login (quando a operação for bem-sucedida) */}
          {success && (
            <Button 
              className="w-full mt-4 bg-blue-500 hover:bg-blue-600 text-white"
              asChild
            >
              <Link href="/login">
                Voltar para o login
              </Link>
            </Button>
          )}
        </CardContent>
        <CardFooter className="flex flex-col">
          <div className="text-sm text-center w-full mt-2">
            Lembrou sua senha?{" "}
            <Link href="/login" className="text-amber-500 hover:text-amber-600 font-medium">
              Voltar para o login
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
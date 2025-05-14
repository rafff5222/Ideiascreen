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
import { AlertCircle, KeyRound, ArrowRight, CheckCircle2 } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

// Esquema de validação
const resetPasswordSchema = z.object({
  password: z.string()
    .min(6, { message: "Senha deve ter pelo menos 6 caracteres" }),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "As senhas não coincidem",
  path: ["confirmPassword"]
});

type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;

export default function ResetPassword() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  // Pegar token da URL (em uma implementação real)
  // const [, params] = useRoute('/reset-password/:token');
  // const token = params?.token;

  // Inicializar form
  const form = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: ""
    }
  });

  // Esta função será implementada quando tivermos o serviço completo
  // Por enquanto, apenas simula a redefinição de senha
  const onSubmit = async (values: ResetPasswordFormValues) => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Simulando uma chamada de API (será implementada futuramente)
      // Neste momento apenas mostraremos mensagem de sucesso
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mostrar mensagem de sucesso
      setSuccess(true);
      toast({
        title: "Senha redefinida!",
        description: "Sua senha foi alterada com sucesso.",
        variant: "default"
      });
      
      // Redirecionar após 2 segundos
      setTimeout(() => {
        setLocation("/login");
      }, 2000);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Erro ao redefinir senha";
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
            <CardTitle className="text-2xl font-bold">Redefinir Senha</CardTitle>
            <KeyRound className="h-6 w-6 text-amber-500" />
          </div>
          <CardDescription>
            Crie uma nova senha para sua conta.
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
              <AlertTitle>Senha redefinida!</AlertTitle>
              <AlertDescription>
                Sua senha foi alterada com sucesso. Redirecionando para a página de login...
              </AlertDescription>
            </Alert>
          )}
          
          {/* Formulário de redefinição de senha */}
          {!success && (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nova senha</FormLabel>
                      <FormControl>
                        <Input 
                          type="password" 
                          placeholder="Digite sua nova senha" 
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
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirmar nova senha</FormLabel>
                      <FormControl>
                        <Input 
                          type="password" 
                          placeholder="Confirme sua nova senha" 
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
                  {isLoading ? "Processando..." : "Redefinir senha"}
                </Button>
              </form>
            </Form>
          )}
        </CardContent>
        <CardFooter className="flex flex-col">
          <div className="flex justify-center w-full mt-4">
            <Link href="/login" className="text-gray-600 hover:text-amber-600 text-sm flex items-center">
              <ArrowRight className="mr-1 h-4 w-4" />
              Voltar para login
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
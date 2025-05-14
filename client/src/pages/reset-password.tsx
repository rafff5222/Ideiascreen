import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Link, useLocation } from "wouter";
import { apiRequest } from "@/lib/queryClient";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Lock, Loader2, Check, AlertTriangle } from "lucide-react";

// Schema de validação
const resetPasswordSchema = z.object({
  password: z.string().min(6, { message: "A senha deve ter pelo menos 6 caracteres" }),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "As senhas não conferem",
  path: ["confirmPassword"],
});

type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;

export default function ResetPassword() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);
  const [resetError, setResetError] = useState("");
  const [location, setLocation] = useLocation();
  const { toast } = useToast();
  
  // Extrair o token da URL (usando URLSearchParams)
  const searchParams = new URLSearchParams(window.location.search);
  const token = searchParams.get("token");

  // Validar se existe um token
  useEffect(() => {
    if (!token) {
      setResetError("Token de redefinição inválido ou ausente.");
    }
  }, [token]);

  const form = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (values: ResetPasswordFormValues) => {
    if (!token) {
      setResetError("Token de redefinição inválido ou ausente.");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await apiRequest("POST", "/api/auth/reset-password", {
        token,
        password: values.password,
      });
      
      const data = await response.json();

      if (data.success) {
        setResetSuccess(true);
        toast({
          title: "Senha redefinida",
          description: "Sua senha foi redefinida com sucesso. Você já pode fazer login.",
          variant: "default",
        });
      } else {
        setResetError(data.message || "Ocorreu um erro ao redefinir sua senha.");
        toast({
          title: "Erro",
          description: data.message || "Ocorreu um erro ao redefinir sua senha.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Erro ao redefinir senha:", error);
      setResetError("Ocorreu um erro ao processar sua solicitação. Tente novamente mais tarde.");
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao processar sua solicitação. Tente novamente mais tarde.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Redirecionar para login após 5 segundos em caso de sucesso
  useEffect(() => {
    let redirectTimer: ReturnType<typeof setTimeout>;
    
    if (resetSuccess) {
      redirectTimer = setTimeout(() => {
        setLocation("/login");
      }, 5000);
    }
    
    return () => {
      if (redirectTimer) clearTimeout(redirectTimer);
    };
  }, [resetSuccess, setLocation]);

  return (
    <div className="container mx-auto flex flex-col justify-center items-center min-h-screen py-10">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Redefinição de Senha</CardTitle>
          <CardDescription className="text-center">
            {!resetSuccess 
              ? "Crie uma nova senha segura para sua conta"
              : "Senha redefinida com sucesso!"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {resetError && (
            <Alert variant="destructive" className="mb-6">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Erro</AlertTitle>
              <AlertDescription>
                {resetError}
              </AlertDescription>
            </Alert>
          )}

          {resetSuccess ? (
            <div className="text-center py-4">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-green-100 mb-4">
                <Check className="h-6 w-6 text-green-600" />
              </div>
              <p className="mb-4 text-green-600 font-medium">
                Sua senha foi redefinida com sucesso!
              </p>
              <p className="text-sm text-muted-foreground mb-2">
                Você será redirecionado para a página de login em alguns segundos...
              </p>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setLocation("/login")}
                className="mt-2"
              >
                Ir para o login agora
              </Button>
            </div>
          ) : (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nova Senha</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Lock className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                          <Input
                            type="password"
                            placeholder="••••••••"
                            className="pl-10"
                            {...field}
                          />
                        </div>
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
                      <FormLabel>Confirme a Nova Senha</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Lock className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                          <Input
                            type="password"
                            placeholder="••••••••"
                            className="pl-10"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  className="w-full"
                  disabled={isSubmitting || !!resetError}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Redefinindo...
                    </>
                  ) : (
                    "Redefinir Senha"
                  )}
                </Button>
              </form>
            </Form>
          )}
        </CardContent>
        <CardFooter className="flex justify-center border-t pt-4">
          <Button variant="ghost" size="sm" onClick={() => setLocation("/login")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar para o login
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
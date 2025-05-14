import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Link, useLocation } from "wouter";
import { apiRequest } from "@/lib/queryClient";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Mail, Loader2 } from "lucide-react";

// Schema de validação
const forgotPasswordSchema = z.object({
  email: z.string().email({ message: "E-mail inválido" }),
});

type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPassword() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [_, setLocation] = useLocation();
  const { toast } = useToast();

  const form = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (values: ForgotPasswordFormValues) => {
    setIsSubmitting(true);
    try {
      const response = await apiRequest("POST", "/api/auth/forgot-password", values);
      const data = await response.json();

      if (data.success) {
        setEmailSent(true);
        toast({
          title: "E-mail enviado",
          description: "Se o email existir no sistema, você receberá as instruções para redefinir sua senha.",
          variant: "default",
        });
      } else {
        toast({
          title: "Erro",
          description: data.message || "Ocorreu um erro ao processar sua solicitação.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Erro ao solicitar redefinição de senha:", error);
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao processar sua solicitação. Tente novamente mais tarde.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto flex flex-col justify-center items-center min-h-screen py-10">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Recuperação de Senha</CardTitle>
          <CardDescription className="text-center">
            {!emailSent 
              ? "Informe seu e-mail para receber um link de redefinição de senha" 
              : "Instruções de redefinição enviadas"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!emailSent ? (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>E-mail</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Mail className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                          <Input
                            placeholder="seu@email.com"
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
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Enviando...
                    </>
                  ) : (
                    "Enviar Instruções"
                  )}
                </Button>
              </form>
            </Form>
          ) : (
            <div className="text-center py-4">
              <p className="mb-4 text-green-600 font-medium">
                Se o e-mail existir em nosso sistema, você receberá um link para redefinir sua senha em instantes.
              </p>
              <p className="text-sm text-muted-foreground">
                Verifique também sua pasta de spam caso não encontre o e-mail na caixa de entrada.
              </p>
            </div>
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
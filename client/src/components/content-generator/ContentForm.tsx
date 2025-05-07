import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { apiRequest } from "@/lib/queryClient";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { contentTypes, platforms, communicationStyles } from "@/lib/utils";

const formSchema = z.object({
  contentType: z.string({
    required_error: "Selecione um tipo de conteúdo",
  }),
  platform: z.string({
    required_error: "Selecione uma plataforma",
  }),
  topic: z.string().min(3, {
    message: "O tema deve ter pelo menos 3 caracteres",
  }),
  communicationStyle: z.string({
    required_error: "Selecione um estilo de comunicação",
  }),
});

export default function ContentForm() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [activeContentType, setActiveContentType] = useState(contentTypes[0].id);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      contentType: contentTypes[0].id,
      platform: platforms[0].id,
      topic: "",
      communicationStyle: communicationStyles[0].id,
    },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: async (values: z.infer<typeof formSchema>) => {
      const res = await apiRequest("POST", "/api/generate", values);
      return res.json();
    },
    onSuccess: (data) => {
      // Update the content display component with the generated content
      queryClient.setQueryData(["currentGeneratedContent"], data);
      
      // Save to history
      queryClient.invalidateQueries({ queryKey: ["/api/content-history"] });
      
      toast({
        title: "Conteúdo gerado com sucesso!",
        description: "Seu conteúdo está pronto para uso.",
      });
    },
    onError: (error) => {
      toast({
        title: "Erro ao gerar conteúdo",
        description: error.message || "Tente novamente mais tarde.",
        variant: "destructive",
      });
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    mutate(values);
  }

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Gerador de Conteúdo</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-4">
              <FormLabel>Tipo de conteúdo</FormLabel>
              <div className="flex flex-wrap gap-2">
                {contentTypes.map((type) => (
                  <Button
                    key={type.id}
                    type="button"
                    variant={activeContentType === type.id ? "default" : "outline"}
                    className={`flex items-center gap-2 ${activeContentType === type.id ? "bg-primary" : ""}`}
                    onClick={() => {
                      setActiveContentType(type.id);
                      form.setValue("contentType", type.id);
                    }}
                  >
                    <i className={type.icon}></i>
                    {type.label}
                  </Button>
                ))}
              </div>
            </div>

            <FormField
              control={form.control}
              name="platform"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Plataforma</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione uma plataforma" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {platforms.map((platform) => (
                        <SelectItem key={platform.id} value={platform.id}>
                          <div className="flex items-center gap-2">
                            <i className={platform.icon}></i>
                            {platform.label}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="topic"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tema do conteúdo</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Ex: Dicas de produtividade" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="communicationStyle"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Estilo de comunicação</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione um estilo" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {communicationStyles.map((style) => (
                        <SelectItem key={style.id} value={style.id}>
                          {style.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Gerando Conteúdo...
                </>
              ) : (
                "Gerar Conteúdo"
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

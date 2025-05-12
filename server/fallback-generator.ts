import type { Request, Response } from "express";

// Função de fallback para geração de roteiros quando nenhuma API está disponível
export async function fallbackScriptGeneration(req: Request, res: Response) {
  try {
    const { prompt } = req.body;
    
    if (!prompt) {
      return res.status(400).json({ error: 'Prompt é obrigatório' });
    }
    
    console.log('Usando gerador de roteiros de fallback (interno)');
    
    // Extrair informações do prompt para personalizar o roteiro
    const isTutorial = prompt.toLowerCase().includes('tutorial') || prompt.toLowerCase().includes('como');
    const isStorytelling = prompt.toLowerCase().includes('história') || prompt.toLowerCase().includes('conto');
    const isPodcast = prompt.toLowerCase().includes('podcast') || prompt.toLowerCase().includes('entrevista');
    const isYoutube = prompt.toLowerCase().includes('youtube') || prompt.toLowerCase().includes('vídeo');
    
    // Gerar um roteiro básico baseado no tipo de conteúdo
    let scriptTemplate = '';
    
    if (isTutorial) {
      scriptTemplate = generateTutorialScript(prompt);
    } else if (isStorytelling) {
      scriptTemplate = generateStoryScript(prompt);
    } else if (isPodcast) {
      scriptTemplate = generatePodcastScript(prompt);
    } else if (isYoutube) {
      scriptTemplate = generateYoutubeScript(prompt);
    } else {
      scriptTemplate = generateGeneralScript(prompt);
    }
    
    // Responder com o roteiro gerado
    return res.json({
      script: scriptTemplate,
      metadata: {
        modelUsed: 'fallback-internal-generator',
        generatedAt: new Date().toISOString(),
        promptTokens: prompt.length,
        outputTokens: scriptTemplate.length
      }
    });
    
  } catch (error: any) {
    console.error('Erro ao gerar roteiro de fallback:', error);
    return res.status(500).json({
      error: `Erro ao gerar roteiro: ${error.message}`,
      script: `Não foi possível gerar um roteiro no momento. Por favor, tente novamente mais tarde.`
    });
  }
}

function generateTutorialScript(prompt: string): string {
  // Extrair tema do tutorial do prompt
  const temaMatch = prompt.match(/sobre\s+([^,\.]+)/i);
  const tema = temaMatch ? temaMatch[1] : 'este tema';
  
  return `TÍTULO: TUTORIAL - ${tema.toUpperCase()}
  
INTRODUÇÃO:
[Apresentador olha para a câmera]
Olá pessoal! Hoje vou mostrar como vocês podem dominar ${tema}. Se você está assistindo esse vídeo, provavelmente já tentou fazer isso antes, mas encontrou algumas dificuldades. Não se preocupe, vou mostrar o passo a passo de forma simples e direta.

PARTE 1 - PREPARAÇÃO:
[Close na bancada/mesa mostrando os materiais/ferramentas]
Antes de começarmos, vamos falar sobre o que você vai precisar:
- Primeiro item necessário
- Segundo item necessário
- Terceiro item necessário

PARTE 2 - PASSO A PASSO:
[Demonstração com as mãos visíveis]
Vamos começar com o primeiro passo. Pegue o primeiro item e posicione desta forma.

[Close no processo]
Agora, com cuidado, faça este movimento. Perceba como é importante manter esta posição.

[Ângulo mais aberto mostrando o resultado parcial]
Ótimo! Agora vamos para o segundo passo.

PARTE 3 - DICAS EXTRAS:
[Apresentador volta a olhar para a câmera]
Aqui vão algumas dicas que aprendi com minha experiência:
1. Primeira dica importante
2. Segunda dica importante
3. Terceira dica importante

CONCLUSÃO:
[Mostra o resultado final]
E pronto! Veja como ficou incrível. Se você seguiu todos os passos, deve ter conseguido um resultado semelhante.

[Apresentador convida para engajamento]
Se gostou deste tutorial, não esqueça de deixar seu like e se inscrever no canal para mais conteúdos como este. Deixe nos comentários que outros tutoriais você gostaria de ver por aqui!

FIM`;
}

function generateStoryScript(prompt: string): string {
  // Extrair tema da história
  const temaMatch = prompt.match(/sobre\s+([^,\.]+)/i);
  const tema = temaMatch ? temaMatch[1] : 'uma aventura inesperada';
  
  return `TÍTULO: "${tema.toUpperCase()} - Uma história para refletir"

FADE IN:

EXT. PAISAGEM ABERTA - DIA

[Plano aberto mostrando uma vasta paisagem. O sol brilha intensamente, criando sombras longas no terreno.]

NARRADOR (V.O.)
Em um mundo onde tudo parecia comum, algo extraordinário estava prestes a acontecer.

[A câmera se move lentamente, revelando um personagem solitário caminhando à distância]

CENA 1 - INT. CASA DO PROTAGONISTA - MANHÃ

[Close no rosto do PROTAGONISTA, expressão pensativa enquanto olha pela janela]

PROTAGONISTA
(sussurrando para si mesmo)
Hoje é o dia. Não posso mais adiar.

[O PROTAGONISTA caminha pelo cômodo, pegando alguns objetos pessoais e colocando em uma mochila]

CENA 2 - EXT. INÍCIO DA JORNADA - POUCO DEPOIS

[O PROTAGONISTA para diante de uma bifurcação no caminho. Hesita, olhando para ambas as direções]

PROTAGONISTA
(determinado)
Às vezes precisamos seguir o caminho menos percorrido.

[Escolhe a trilha da direita, mais densa e escura]

CENA 3 - EXT. ENCONTRO INESPERADO - TARDE

[PROTAGONISTA caminha com dificuldade pela trilha quando ouve um ruído]

OUTRO PERSONAGEM (O.C.)
Quem está aí?

[PROTAGONISTA congela. A câmera revela lentamente o OUTRO PERSONAGEM emergindo entre as árvores]

PROTAGONISTA
(surpreso)
Não esperava encontrar alguém aqui.

OUTRO PERSONAGEM
(sorrindo misteriosamente)
Às vezes encontramos exatamente o que precisamos, não o que esperamos.

CENA 4 - CLÍMAX DA HISTÓRIA - ANOITECER

[Os personagens chegam a um local especial, iluminado por uma luz incomum]

OUTRO PERSONAGEM
(revelando uma verdade importante)
Agora você entende por que foi trazido aqui?

[Close no rosto do PROTAGONISTA enquanto uma revelação transforma sua expressão]

PROTAGONISTA
(com voz embargada)
Tudo faz sentido agora...

CENA 5 - RESOLUÇÃO - NASCER DO SOL

[PROTAGONISTA retornando, transformado pela experiência]

NARRADOR (V.O.)
E assim, com uma nova compreensão do mundo e de si mesmo, nosso herói retorna - não o mesmo que partiu, mas alguém muito mais sábio.

[A câmera se afasta, mostrando o PROTAGONISTA caminhando em direção ao horizonte]

FADE OUT.

FIM`;
}

function generatePodcastScript(prompt: string): string {
  // Extrair tema do podcast
  const temaMatch = prompt.match(/sobre\s+([^,\.]+)/i);
  const tema = temaMatch ? temaMatch[1] : 'o assunto de hoje';
  
  return `TÍTULO DO EPISÓDIO: "Desvendando ${tema} - Um novo olhar"

NOTAS DE PRODUÇÃO:
- Duração estimada: 45 minutos
- Convidado: Especialista em ${tema}
- Material necessário: 2 microfones principais, 1 microfone reserva, gravador

ROTEIRO:

[MÚSICA DE ABERTURA - 10 segundos]

APRESENTADOR:
Olá, pessoal! Bem-vindos a mais um episódio do nosso podcast. Eu sou [Nome do Apresentador] e hoje vamos mergulhar em um tema fascinante: ${tema}. Para nos ajudar a entender melhor este assunto, temos um convidado especial.

[PAUSA BREVE - 2 segundos]

APRESENTADOR:
Antes de apresentar nosso convidado, gostaria de agradecer a vocês que nos acompanham todas as semanas. Se você ainda não é inscrito, não esqueça de seguir nosso podcast na sua plataforma preferida.

[TRANSIÇÃO - 3 segundos]

APRESENTADOR:
Hoje temos conosco [Nome do Convidado], que é [credenciais/experiência]. [Nome], é um prazer enorme ter você aqui!

CONVIDADO:
O prazer é meu! Obrigado pelo convite.

APRESENTADOR:
Para começar, poderia nos contar como você se envolveu com ${tema}?

[ESPAÇO PARA RESPOSTA - aproximadamente 3 minutos]

APRESENTADOR:
Fascinante! E para nossos ouvintes que estão tendo o primeiro contato com esse tema, como você explicaria ${tema} de forma simples?

[ESPAÇO PARA RESPOSTA - aproximadamente 5 minutos]

APRESENTADOR:
Vamos fazer uma pequena pausa e já voltamos com mais dessa conversa incrível sobre ${tema}.

[INTERVALO COMERCIAL - 30 segundos]

APRESENTADOR:
Estamos de volta! Continuando nossa conversa com [Nome do Convidado] sobre ${tema}. Uma pergunta que muitos ouvintes nos enviaram: quais são os maiores equívocos que as pessoas têm sobre este assunto?

[ESPAÇO PARA DISCUSSÃO - aproximadamente 10 minutos]

APRESENTADOR:
Chegando na parte final do nosso episódio, gostaria que você compartilhasse alguns recursos para quem quer se aprofundar mais em ${tema}. Livros, sites, outros podcasts...

[ESPAÇO PARA RESPOSTA - aproximadamente 5 minutos]

APRESENTADOR:
[Nome do Convidado], muito obrigado por compartilhar seu conhecimento conosco hoje. Onde nossos ouvintes podem encontrar mais do seu trabalho?

CONVIDADO:
Foi um prazer estar aqui! Vocês podem me encontrar em [redes sociais/site/livros].

APRESENTADOR:
E isso encerra nosso episódio de hoje. Não esqueçam de deixar sua avaliação e comentários sobre o que acharam. Na próxima semana estaremos discutindo [tema do próximo episódio]. Até lá!

[MÚSICA DE ENCERRAMENTO - 10 segundos]

FIM DO EPISÓDIO`;
}

function generateYoutubeScript(prompt: string): string {
  // Extrair tema do vídeo
  const temaMatch = prompt.match(/sobre\s+([^,\.]+)/i);
  const tema = temaMatch ? temaMatch[1] : 'este tema interessante';
  
  return `TÍTULO DO VÍDEO: "${tema.toUpperCase()} | Tudo o que você precisa saber"

DURAÇÃO ESTIMADA: 10-12 minutos
TAGS SUGERIDAS: ${tema}, guia, explicação, tutorial

[ESTRUTURA DO VÍDEO]

0:00 - 0:30 | INTRODUÇÃO/GANCHO
------------------------------------------
[PLANO MÉDIO - Apresentador falando diretamente para a câmera]

Olá pessoal, tudo bem com vocês? Hoje vamos falar sobre ${tema}, algo que muita gente tem curiosidade mas poucos realmente entendem. No final deste vídeo, você vai saber exatamente como [benefício principal relacionado ao tema].

[GRÁFICO NA TELA: Mostrar os tópicos que serão abordados]

Vamos cobrir:
- O que é ${tema} realmente
- Por que você deveria se importar
- Como aplicar esse conhecimento
- Erros comuns para evitar

Antes de começarmos, não esqueça de deixar seu like e se inscrever no canal para mais conteúdos como este!

0:30 - 2:30 | PARTE 1: CONTEXTO E DEFINIÇÃO
------------------------------------------
[PLANO MÉDIO alternando com IMAGENS/GRÁFICOS ILUSTRATIVOS]

Muita gente acha que ${tema} é [conceito equivocado comum], mas na verdade...

[INSERIR EXPLICAÇÃO DETALHADA]

Uma coisa interessante sobre isso é que [fato surpreendente sobre o tema].

2:30 - 5:00 | PARTE 2: IMPORTÂNCIA DO TEMA
------------------------------------------
[PLANO MÉDIO com B-ROLL relacionado ao tema]

Você pode estar se perguntando: "Por que eu deveria me importar com isso?"

Bem, vou te contar por que ${tema} pode transformar a maneira como você [atividade relacionada].

[LISTA DE BENEFÍCIOS aparecendo na tela enquanto o apresentador explica cada um]

5:00 - 8:00 | PARTE 3: APLICAÇÕES PRÁTICAS
------------------------------------------
[DEMONSTRAÇÃO PRÁTICA - Close nos detalhes importantes]

Agora vamos à parte mais legal: como aplicar esse conhecimento no seu dia a dia.

Primeiro, você precisa [primeira etapa prática].
[MOSTRAR EXEMPLO]

Em seguida, [segunda etapa prática].
[DEMONSTRAÇÃO]

Por último, mas não menos importante, [terceira etapa prática].

8:00 - 10:00 | PARTE 4: ERROS COMUNS E DICAS
------------------------------------------
[PLANO MÉDIO com GRÁFICOS de "O que fazer" vs. "O que evitar"]

Existem alguns erros que quase todo mundo comete quando se trata de ${tema}:

1. [Primeiro erro comum]
2. [Segundo erro comum]
3. [Terceiro erro comum]

Em vez disso, tente:
[LISTAR ALTERNATIVAS CORRETAS]

10:00 - FIM | CONCLUSÃO
------------------------------------------
[PLANO MÉDIO - Apresentador falando diretamente para a câmera]

E aí está! Tudo o que você precisa saber sobre ${tema}. Espero que esse vídeo tenha sido útil para você.

Se você tem alguma dúvida, deixe nos comentários abaixo. Não esqueça de deixar seu like, compartilhar com quem precisa dessa informação e se inscrever no canal para mais conteúdos como este.

Até o próximo vídeo!

[TELA FINAL com cards para outros vídeos relacionados]

FIM`;
}

function generateGeneralScript(prompt: string): string {
  return `ROTEIRO: ${prompt.toUpperCase()}

CENA 1 - INTRODUÇÃO

[VISUAL: Ambiente relacionado ao tema do roteiro]

NARRADOR
(voz clara e calma)
Bem-vindo a esta jornada sobre um tema fascinante que tem capturado a atenção de muitas pessoas.

[TRANSIÇÃO SUAVE]

CENA 2 - CONTEXTO E HISTÓRIA

[VISUAL: Imagens históricas ou representativas do tema]

NARRADOR
Para entendermos melhor o assunto, precisamos voltar um pouco no tempo e explorar suas origens.

[MOSTRAR LINHA DO TEMPO OU PROGRESSÃO]

CENA 3 - PONTOS PRINCIPAIS

[VISUAL: Demonstração do primeiro ponto importante]

NARRADOR
O primeiro aspecto crucial é a compreensão de como este tema afeta nosso dia a dia.

[TRANSIÇÃO]

[VISUAL: Ilustração do segundo ponto]

NARRADOR
Igualmente importante é reconhecer os desafios e oportunidades que surgem quando exploramos mais a fundo.

[TRANSIÇÃO]

CENA 4 - APLICAÇÕES PRÁTICAS

[VISUAL: Demonstração de uso ou aplicação]

NARRADOR
Agora, vamos ver como podemos aplicar este conhecimento de forma prática e eficiente.

[SÉRIE DE EXEMPLOS RÁPIDOS]

CENA 5 - CONCLUSÃO

[VISUAL: Retorno ao ambiente inicial, mas com nova perspectiva]

NARRADOR
Ao final desta jornada, espero que você tenha uma nova apreciação e entendimento sobre este tema. 
As possibilidades são infinitas quando aplicamos este conhecimento em nossas vidas.

[CRÉDITOS FINAIS]

FIM`;
}
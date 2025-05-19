# 📜 Script Generator AI

Gerador de roteiros automatizado usando Inteligência Artificial. Basta inserir um tema ou ideia e receba um roteiro completo em segundos!

## Recursos

- ✨ Interface limpa e intuitiva
- 📝 Gere roteiros para diversos formatos (curta-metragem, documentário, comercial, entrevista)
- 💾 Salve seus roteiros localmente para acessar mais tarde
- 🖨️ Exporte para PDF com um clique
- 📋 Copie facilmente para a área de transferência
- 🔄 Escolha entre OpenAI ou Hugging Face (gratuito)

## Tecnologias

- Node.js e Express para o backend
- HTML, CSS e JavaScript vanilla para o frontend
- OpenAI API para geração de texto (modelo gpt-4o)
- Hugging Face API como alternativa gratuita

## Como Usar

1. Clone o repositório
2. Crie um arquivo `.env` baseado no `.env.example`
3. Adicione sua chave da API OpenAI (ou use Hugging Face configurando `USE_HUGGINGFACE=true`)
4. Instale as dependências: `npm install`
5. Inicie o servidor: `npm run dev`
6. Acesse http://localhost:3000

## Interface

1. Selecione um template ou escreva seu próprio prompt
2. Clique em "Gerar Roteiro"
3. O roteiro aparecerá formatado abaixo
4. Use as opções para salvar, copiar ou exportar o resultado

## Exemplos de Prompts

- "Um curta-metragem sobre um detetive que resolve crimes através de sonhos"
- "Documentário sobre as mudanças climáticas na Amazônia"
- "Comercial para um novo smartphone com recursos de IA"
- "Entrevista com um especialista em psicologia infantil sobre educação digital"

## Opções Avançadas

- Para usar modelos gratuitos do Hugging Face, configure `USE_HUGGINGFACE=true` no arquivo `.env`
- Personalize os templates no arquivo `client/public/index.html`
- Ajuste os parâmetros de geração de texto no servidor para controlar criatividade e comprimento
- Atualizando para novo deploy

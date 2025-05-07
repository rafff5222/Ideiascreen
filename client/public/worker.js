/**
 * Web Worker para processamento avançado de dados de conversão
 * Executa análises pesadas sem impactar a performance do thread principal
 */

// Configurações
const INTEREST_THRESHOLD = 0.5;
const ENGAGEMENT_THRESHOLD = 50;

/**
 * Analisa dados de engajamento do usuário para identificar padrões
 * @param {Object} data - Dados de interação do usuário
 */
function analyzeEngagementData(data) {
  // Simula um cálculo computacionalmente intensivo
  let engagementScore = 0;
  
  // Critérios de pontuação (seria ajustado com dados reais):
  // 1. Duração da navegação
  if (data.browseDuration > 60) {
    engagementScore += data.browseDuration / 10;
  }
  
  // 2. Cliques em elementos importantes
  if (data.clickedElements) {
    const importantElements = ['pricing', 'features', 'testimonials', 'cta'];
    const clickedImportant = data.clickedElements.filter(el => 
      importantElements.includes(el)
    );
    
    engagementScore += clickedImportant.length * 15;
  }
  
  // 3. Origem (maior valor para tráfego referenciado)
  if (data.referrer && !data.referrer.includes(self.location.origin)) {
    engagementScore += 20;
  }
  
  // Limitação da pontuação em 100
  engagementScore = Math.min(100, engagementScore);
  
  return {
    engagementScore,
    isHighEngagement: engagementScore > ENGAGEMENT_THRESHOLD,
    recommendations: getRecommendations(engagementScore)
  };
}

/**
 * Gera recomendações baseadas na pontuação de engajamento
 */
function getRecommendations(score) {
  if (score > 80) {
    return [
      'Mostrar oferta premium',
      'Propor cadastro para trial',
      'Exibir depoimentos de autoridades'
    ];
  } else if (score > 50) {
    return [
      'Enfatizar benefícios do produto',
      'Mostrar comparativo de planos',
      'Oferecer desconto por tempo limitado'
    ];
  } else {
    return [
      'Destacar garantia de satisfação',
      'Mostrar depoimentos de clientes',
      'Enfatizar facilidade de uso'
    ];
  }
}

/**
 * Otimiza conteúdo para melhorar taxas de conversão
 * @param {Object} content - Conteúdo a ser otimizado
 */
function optimizeContentForConversion(content) {
  // Simula processamento que seria feito por um modelo de IA
  const optimized = {
    original: content,
    optimized: {
      title: content.title ? `${content.title} - Resultados Garantidos!` : '',
      desc: content.desc ? `${content.desc} Milhares de clientes satisfeitos!` : '',
      cta: content.cta ? content.cta.toUpperCase() : 'COMECE AGORA'
    },
    expectedImprovements: {
      clickRate: '+25%',
      conversionRate: '+14%',
      confidence: 0.87
    }
  };
  
  return optimized;
}

/**
 * Prevê interesses do usuário com base em comportamentos
 * @param {Object} userData - Dados do usuário
 */
function predictUserInterests(userData) {
  // Algoritmo que seria treinado com dados reais:
  // Calcula probabilidades para diferentes categorias
  const categories = [
    { name: 'vendas', baseWeight: 0.2 },
    { name: 'design', baseWeight: 0.3 },
    { name: 'marketing', baseWeight: 0.2 },
    { name: 'automação', baseWeight: 0.3 }
  ];
  
  // Fatores de ajuste baseados nos dados do usuário
  const browseFactor = userData.browseDuration / 1000;
  
  // Calcula pontuações finais (com aleatoriedade para simulação)
  const totalWeight = categories.reduce((sum, c) => sum + c.baseWeight, 0);
  const interests = categories.map(category => {
    // Adiciona aleatoriedade para simular variações em predições
    const randomFactor = Math.random() * 0.4 - 0.2;
    const adjustedWeight = category.baseWeight / totalWeight + randomFactor;
    
    // Garante que o valor fique entre 0 e 1
    const clampedWeight = Math.max(0, Math.min(1, adjustedWeight));
    
    return {
      category: category.name,
      score: (clampedWeight * 100).toFixed(2)
    };
  });
  
  // Ordena por pontuação (decrescente)
  interests.sort((a, b) => parseFloat(b.score) - parseFloat(a.score));
  
  // Determina recomendações de conteúdo com base nos principais interesses
  const topInterests = interests.slice(0, 2);
  const recommendedContent = `Conteúdo sobre ${topInterests[0].category}` + 
    (topInterests[1].score > 30 ? ` e ${topInterests[1].category}` : '');
  
  return {
    topInterests,
    recommendedContent
  };
}

// Processamento de mensagens
self.onmessage = function(e) {
  const { task, data } = e.data;
  
  switch (task) {
    case 'analyzeEngagement':
      const engagementResults = analyzeEngagementData(data);
      self.postMessage({
        task: 'engagementResults',
        result: engagementResults
      });
      break;
      
    case 'optimizeContent':
      const optimizedContent = optimizeContentForConversion(data);
      self.postMessage({
        task: 'contentOptimized',
        result: optimizedContent
      });
      break;
      
    case 'predictInterests':
      const interests = predictUserInterests(data);
      // Mostra resultado no console (apenas para desenvolvimento)
      console.log('Interesses do usuário preditos:', interests.topInterests);
      
      self.postMessage({
        task: 'interestsPredicted',
        result: interests
      });
      break;
      
    default:
      self.postMessage({
        task: 'error',
        error: `Tarefa desconhecida: ${task}`
      });
  }
};
import React, { useState } from 'react';
import { FaCheck, FaRocket, FaVideo, FaMagic, FaArrowRight, FaPlayCircle } from 'react-icons/fa';

export default function DemoPage() {
  const [scriptText, setScriptText] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [videoGenerated, setVideoGenerated] = useState<boolean>(false);
  const [showMessage, setShowMessage] = useState<boolean>(false);

  const generateVideo = () => {
    if (!scriptText.trim()) {
      alert('Por favor, adicione um roteiro de vídeo primeiro!');
      return;
    }

    setIsLoading(true);
    
    // Simulação de geração de vídeo
    setTimeout(() => {
      setIsLoading(false);
      setVideoGenerated(true);
      setShowMessage(true);
      
      // Esconde a mensagem após 5 segundos
      setTimeout(() => {
        setShowMessage(false);
      }, 5000);
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
            Transforme <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-indigo-600">Roteiros em Vídeos</span> Automaticamente
          </h1>
          <p className="text-lg text-gray-700 max-w-2xl mx-auto">
            Nosso recurso exclusivo transforma seu roteiro em um vídeo completo com edição profissional em apenas alguns segundos.
          </p>
        </div>

        <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden mb-10">
          <div className="p-6 md:p-8">
            <div className="flex flex-col md:flex-row gap-8">
              <div className="w-full md:w-1/2">
                <h2 className="text-xl font-semibold mb-4 flex items-center">
                  <FaRocket className="text-indigo-600 mr-2" /> 
                  Seu Roteiro
                </h2>
                <textarea
                  value={scriptText}
                  onChange={(e) => setScriptText(e.target.value)}
                  placeholder="Cole ou escreva seu roteiro aqui... Exemplo: Olá pessoal! Hoje vou falar sobre como a inteligência artificial está revolucionando nosso dia a dia. Vamos começar com alguns exemplos práticos..."
                  className="w-full h-64 p-4 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none resize-none"
                ></textarea>
                <button
                  onClick={generateVideo}
                  disabled={isLoading}
                  className="mt-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 px-6 rounded-md font-medium hover:from-indigo-700 hover:to-purple-700 transition-all shadow-md w-full flex items-center justify-center"
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                      Processando...
                    </>
                  ) : (
                    <>
                      <FaMagic className="mr-2" /> Transformar em Vídeo <FaArrowRight className="ml-2" />
                    </>
                  )}
                </button>
              </div>
              
              <div className="w-full md:w-1/2">
                <h2 className="text-xl font-semibold mb-4 flex items-center">
                  <FaVideo className="text-indigo-600 mr-2" /> 
                  Vídeo Resultante
                </h2>
                <div className="bg-gray-100 h-64 rounded-md flex items-center justify-center relative">
                  {videoGenerated ? (
                    <>
                      <div className="absolute inset-0 rounded-md bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
                        <div className="p-4 text-center">
                          <FaPlayCircle className="text-6xl text-white opacity-80 hover:opacity-100 hover:text-indigo-400 transition-all cursor-pointer mx-auto" />
                          <p className="text-white mt-4">Vídeo pronto para download</p>
                        </div>
                      </div>
                    </>
                  ) : (
                    <p className="text-gray-500 text-center p-4">
                      {isLoading 
                        ? "Criando seu vídeo com IA..." 
                        : "Seu vídeo aparecerá aqui após a geração"}
                    </p>
                  )}
                </div>
                
                {videoGenerated && (
                  <div className="mt-4">
                    <button className="bg-green-600 text-white py-2.5 px-4 rounded-md font-medium hover:bg-green-700 transition-all shadow-md w-full flex items-center justify-center">
                      <FaCheck className="mr-2" /> Baixar Vídeo
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {showMessage && (
          <div className="bg-gradient-to-r from-green-50 to-teal-50 border border-green-200 rounded-lg p-4 mb-12 mx-auto max-w-2xl">
            <div className="flex items-start">
              <FaCheck className="text-green-500 flex-shrink-0 mt-1" />
              <div className="ml-3">
                <p className="text-green-800 font-medium">Vídeo gerado com sucesso!</p>
                <p className="text-green-700 text-sm">Esta é uma versão demo. Para acessar recursos avançados, assine um de nossos planos.</p>
              </div>
            </div>
          </div>
        )}

        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold mb-6 text-center">Como funciona?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center justify-center h-12 w-12 rounded-md bg-indigo-100 text-indigo-600 mb-4 mx-auto">
                <span className="font-bold">1</span>
              </div>
              <h3 className="text-lg font-medium text-center mb-2">Escreva seu roteiro</h3>
              <p className="text-gray-600 text-center text-sm">Você escreve ou cola um roteiro que deseja transformar em vídeo.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center justify-center h-12 w-12 rounded-md bg-indigo-100 text-indigo-600 mb-4 mx-auto">
                <span className="font-bold">2</span>
              </div>
              <h3 className="text-lg font-medium text-center mb-2">IA processa o conteúdo</h3>
              <p className="text-gray-600 text-center text-sm">Nossa tecnologia analisa o texto e gera automaticamente elementos visuais correspondentes.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center justify-center h-12 w-12 rounded-md bg-indigo-100 text-indigo-600 mb-4 mx-auto">
                <span className="font-bold">3</span>
              </div>
              <h3 className="text-lg font-medium text-center mb-2">Vídeo pronto para uso</h3>
              <p className="text-gray-600 text-center text-sm">Receba seu vídeo editado com transições, legendas e efeitos profissionais.</p>
            </div>
          </div>
        </div>

        <div className="mt-16 text-center">
          <h2 className="text-2xl font-bold mb-4">Pronto para criar vídeos profissionais?</h2>
          <p className="text-lg text-gray-700 mb-6 max-w-2xl mx-auto">
            Experimente a funcionalidade completa assinando agora mesmo!
          </p>
          <a 
            href="/"
            className="inline-block bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 px-8 rounded-md font-medium hover:from-indigo-700 hover:to-purple-700 transition-all shadow-md"
          >
            Ver Planos
          </a>
        </div>
      </div>
    </div>
  );
}
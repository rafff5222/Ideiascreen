import { useEffect } from 'react';

/**
 * Componente Otimizador de Formulário com Auto-preenchimento
 * Melhora a experiência de preenchimento de formulários através de auto-detecção inteligente
 * e preenchimento proativo de campos para reduzir atrito na conversão
 */
export default function SmartFormOptimizer() {
  useEffect(() => {
    // Mapeia domínios de email para características de usuário
    const emailDomainMap: Record<string, { type: string; size?: string }> = {
      'gmail.com': { type: 'personal' },
      'hotmail.com': { type: 'personal' },
      'outlook.com': { type: 'personal' },
      'yahoo.com': { type: 'personal' },
      'uol.com.br': { type: 'personal' },
      'terra.com.br': { type: 'personal' },
      'bol.com.br': { type: 'personal' },
      'icloud.com': { type: 'personal' },
      'me.com': { type: 'personal' },
      'empresa.com.br': { type: 'business', size: 'small' },
      'agencia.com.br': { type: 'business', size: 'small' },
      'corporativo.com': { type: 'business', size: 'large' },
      'acme.com': { type: 'business', size: 'large' }
    };
    
    // Aplica otimizações a um formulário
    const applyFormOptimizations = (form: HTMLFormElement) => {
      // Evita processar o mesmo formulário múltiplas vezes
      if (form.getAttribute('data-optimized') === 'true') return;
      form.setAttribute('data-optimized', 'true');
      
      // Encontra campos de email no formulário
      const emailFields = form.querySelectorAll('input[type="email"], input[name*="email"], input[id*="email"]');
      
      emailFields.forEach(emailField => {
        // Registra os eventos de saída do campo para verificar o email
        emailField.addEventListener('blur', handleEmailBlur);
      });
      
      // Aplica maior acessibilidade aos campos do formulário
      enhanceFormFields(form);
      
      // Adiciona feedback visual durante digitação
      addRealtimeFeedback(form);
      
      // Otimiza a ordem dos campos para fluxo lógico
      optimizeFieldOrder(form);
      
      // Registra o evento
      console.log('Analytics:', {
        event: 'form_optimized',
        form_id: form.id || 'unnamed-form',
        form_action: form.action,
        fields_count: form.elements.length,
        timestamp: new Date().toISOString()
      });
    };
    
    // Manipula o evento de saída do campo de email
    const handleEmailBlur = (e: Event) => {
      const emailField = e.target as HTMLInputElement;
      const email = emailField.value.trim();
      
      if (!email || !email.includes('@')) return;
      
      const form = emailField.closest('form');
      if (!form) return;
      
      // Tenta extrair nome do usuário do email
      const username = email.split('@')[0];
      const domain = email.split('@')[1];
      
      // Campos comuns para nome e tipo de usuário
      const nameFields = form.querySelectorAll('input[name*="name"], input[id*="name"], input[placeholder*="nome"]');
      const businessTypeFields = form.querySelectorAll('input[name*="business"], input[id*="business"], select[name*="business_type"], select[id*="business_type"], input[type="checkbox"][id*="business"]');
      const companyFields = form.querySelectorAll('input[name*="company"], input[id*="company"], input[name*="empresa"], input[id*="empresa"]');
      
      // Determina o tipo de usuário pelo domínio de email
      const emailType = domain && emailDomainMap[domain] ? emailDomainMap[domain].type : null;
      const businessSize = domain && emailDomainMap[domain] ? emailDomainMap[domain].size : null;
      
      // Auto-preenche o nome com base no email (se campo estiver vazio)
      nameFields.forEach(field => {
        if (field instanceof HTMLInputElement && !field.value) {
          // Formata o nome adequadamente
          const formattedName = formatNameFromEmail(username);
          field.value = formattedName;
          
          // Simula um evento de mudança para acionar validadores
          field.dispatchEvent(new Event('change', { bubbles: true }));
          
          // Adiciona classe de campo auto-preenchido
          field.classList.add('auto-filled');
          
          // Efeito visual temporário
          field.style.backgroundColor = 'rgba(139, 92, 246, 0.1)';
          setTimeout(() => {
            field.style.backgroundColor = '';
          }, 2000);
        }
      });
      
      // Auto-seleciona tipo de negócio se for um email corporativo
      if (emailType === 'business') {
        businessTypeFields.forEach(field => {
          if (field instanceof HTMLInputElement && field.type === 'checkbox') {
            field.checked = true;
            field.dispatchEvent(new Event('change', { bubbles: true }));
          } else if (field instanceof HTMLSelectElement) {
            // Procura uma opção adequada no select
            const options = Array.from(field.options);
            const businessOption = options.find(option => 
              option.value.toLowerCase().includes('business') || 
              option.text.toLowerCase().includes('business') ||
              option.value.toLowerCase().includes('empresa') || 
              option.text.toLowerCase().includes('empresa')
            );
            
            if (businessOption) {
              field.value = businessOption.value;
              field.dispatchEvent(new Event('change', { bubbles: true }));
            }
          }
        });
        
        // Tenta extrair o nome da empresa do domínio
        const companyName = extractCompanyFromDomain(domain);
        
        // Preenche o campo de empresa se encontrou um possível nome
        if (companyName) {
          companyFields.forEach(field => {
            if (field instanceof HTMLInputElement && !field.value) {
              field.value = companyName;
              field.dispatchEvent(new Event('change', { bubbles: true }));
            }
          });
        }
      }
      
      // Registra o evento de auto-preenchimento
      console.log('Analytics:', {
        event: 'form_autofill',
        email_domain: domain,
        email_type: emailType,
        fields_autofilled: nameFields.length + (emailType === 'business' ? businessTypeFields.length : 0),
        timestamp: new Date().toISOString()
      });
    };
    
    // Formata nome a partir do email
    const formatNameFromEmail = (username: string): string => {
      // Remove números e caracteres especiais
      let name = username.replace(/[0-9_.-]/g, ' ').trim();
      
      // Capitaliza cada palavra
      name = name.split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ');
      
      return name;
    };
    
    // Extrai possível nome de empresa do domínio
    const extractCompanyFromDomain = (domain: string): string | null => {
      if (!domain) return null;
      
      // Remove extensão do domínio (.com, .com.br, etc)
      const domainParts = domain.split('.');
      if (domainParts.length < 2) return null;
      
      // Pega a parte principal do domínio
      const mainDomainPart = domainParts[0];
      
      // Ignora domínios de email comuns
      const commonDomains = ['gmail', 'hotmail', 'outlook', 'yahoo', 'uol', 'terra', 'bol', 'icloud', 'me'];
      if (commonDomains.includes(mainDomainPart)) return null;
      
      // Formata o nome da empresa
      return mainDomainPart
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ');
    };
    
    // Melhora acessibilidade dos campos do formulário
    const enhanceFormFields = (form: HTMLFormElement) => {
      const inputs = form.querySelectorAll('input, select, textarea');
      
      inputs.forEach(input => {
        // Certifica-se de que cada input tem um id e label associado
        if (!input.id) {
          const newId = `field-${Math.random().toString(36).substr(2, 9)}`;
          input.id = newId;
          
          // Se existir um label sem for atributo próximo
          const parentElement = input.parentElement;
          if (parentElement) {
            const nearbyLabel = parentElement.querySelector('label:not([for])');
            if (nearbyLabel) {
              nearbyLabel.setAttribute('for', newId);
            }
          }
        }
        
        // Adiciona atributos de acessibilidade
        if (input instanceof HTMLInputElement || input instanceof HTMLTextAreaElement) {
          // Adiciona autocomplete apropriado
          if (input.name.includes('email') || input.id.includes('email')) {
            input.setAttribute('autocomplete', 'email');
          } else if (input.name.includes('name') || input.id.includes('name')) {
            input.setAttribute('autocomplete', 'name');
          } else if (input.name.includes('phone') || input.id.includes('phone')) {
            input.setAttribute('autocomplete', 'tel');
          }
          
          // Adiciona dicas para campos obrigatórios
          if (input.required) {
            const inputLabel = document.querySelector(`label[for="${input.id}"]`);
            if (inputLabel && !inputLabel.textContent?.includes('*')) {
              inputLabel.innerHTML += ' <span style="color: #EC4899">*</span>';
            }
          }
        }
      });
    };
    
    // Adiciona feedback em tempo real durante a digitação
    const addRealtimeFeedback = (form: HTMLFormElement) => {
      const inputs = form.querySelectorAll('input[type="text"], input[type="email"], input[type="tel"], textarea');
      
      inputs.forEach(input => {
        if (input instanceof HTMLInputElement || input instanceof HTMLTextAreaElement) {
          // Adiciona indicador de força para campos de senha
          if (input.type === 'password') {
            const strengthIndicator = document.createElement('div');
            strengthIndicator.className = 'password-strength';
            strengthIndicator.style.height = '4px';
            strengthIndicator.style.width = '100%';
            strengthIndicator.style.marginTop = '4px';
            strengthIndicator.style.background = '#eee';
            strengthIndicator.style.position = 'relative';
            
            const strengthBar = document.createElement('div');
            strengthBar.style.height = '100%';
            strengthBar.style.width = '0';
            strengthBar.style.background = '#ccc';
            strengthBar.style.transition = 'width 0.3s, background 0.3s';
            
            strengthIndicator.appendChild(strengthBar);
            
            // Adiciona após o input
            input.parentNode?.insertBefore(strengthIndicator, input.nextSibling);
            
            // Atualiza o indicador durante a digitação
            input.addEventListener('input', () => {
              const strength = calculatePasswordStrength(input.value);
              strengthBar.style.width = `${strength}%`;
              
              // Cor baseada na força
              if (strength < 30) {
                strengthBar.style.background = '#EF4444'; // red
              } else if (strength < 70) {
                strengthBar.style.background = '#F59E0B'; // yellow
              } else {
                strengthBar.style.background = '#10B981'; // green
              }
            });
          }
          
          // Feedback visual para emails
          if (input.type === 'email' || input.name.includes('email') || input.id.includes('email')) {
            input.addEventListener('input', () => {
              const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value);
              
              if (input.value && !isValidEmail) {
                input.style.borderColor = '#EF4444';
              } else if (isValidEmail) {
                input.style.borderColor = '#10B981';
              } else {
                input.style.borderColor = '';
              }
            });
          }
        }
      });
    };
    
    // Calcula a força de uma senha
    const calculatePasswordStrength = (password: string): number => {
      if (!password) return 0;
      
      let strength = 0;
      
      // Comprimento
      strength += password.length * 4;
      
      // Complexidade
      if (/[A-Z]/.test(password)) strength += 10;
      if (/[a-z]/.test(password)) strength += 10;
      if (/[0-9]/.test(password)) strength += 10;
      if (/[^A-Za-z0-9]/.test(password)) strength += 15;
      
      // Limita a 100
      return Math.min(100, strength);
    };
    
    // Otimiza a ordem dos campos para fluxo lógico
    const optimizeFieldOrder = (form: HTMLFormElement) => {
      // Esta função poderia reordenar os campos para um fluxo mais lógico
      // Mas isso envolveria manipulação complexa do DOM e poderia quebrar
      // a validação e lógica do formulário já existente
      
      // Por isso, apenas adiciona algumas melhorias visuais
      
      // Agrupa campos relacionados visualmente
      const formGroups = form.querySelectorAll('.form-group, .field-group, .input-group');
      formGroups.forEach(group => {
        if (group instanceof HTMLElement) {
          group.style.marginBottom = '20px';
        }
      });
    };
    
    // Encontra e otimiza todos os formulários na página
    const findAndOptimizeForms = () => {
      const forms = document.querySelectorAll('form');
      forms.forEach(form => applyFormOptimizations(form));
    };
    
    // Executa as otimizações inicialmente
    findAndOptimizeForms();
    
    // Configura um observador para detectar novos formulários que sejam adicionados
    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
          // Verifica se um novo formulário foi adicionado
          mutation.addedNodes.forEach(node => {
            if (node.nodeType === 1) { // ELEMENT_NODE
              if (node.nodeName === 'FORM') {
                applyFormOptimizations(node as HTMLFormElement);
              } else if (node instanceof HTMLElement) {
                // Verifica se contém formulários
                const nestedForms = node.querySelectorAll('form');
                nestedForms.forEach(form => applyFormOptimizations(form));
              }
            }
          });
        }
      }
    });
    
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
    
    // Cleanup
    return () => {
      observer.disconnect();
    };
  }, []);
  
  // Este componente não renderiza nada visualmente
  return null;
}
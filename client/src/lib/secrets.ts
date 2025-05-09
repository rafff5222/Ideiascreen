// This file provides an interface to request and verify secrets through Replit

import { ask_secrets as replitAskSecrets, check_secrets as replitCheckSecrets } from '@/lib/replit';

/**
 * Request secrets from the user
 * @param secrets Array of secret keys that need to be provided
 * @param message Explanation message to show to the user
 * @returns Promise that resolves when secrets are requested
 */
export async function requestSecrets(secrets: string[], message: string): Promise<void> {
  try {
    // Format the message to include clear instructions
    const formattedMessage = `
${message}

Para usar completamente esta aplicação, precisamos configurar as seguintes chaves de API:
${secrets.map(secret => `- ${secret}`).join('\n')}

Para configurar estas chaves:
1. Crie contas nos respectivos serviços
2. Obtenha suas chaves de API
3. Configure-as no Replit conforme solicitado
    `;
    
    // Use the actual Replit function in production
    console.log('Requesting secrets:', { secrets, message: formattedMessage });
    
    // Call the Replit ask_secrets function through our wrapper
    await replitAskSecrets(secrets, formattedMessage);
    
  } catch (error) {
    console.error('Error requesting secrets:', error);
    throw error;
  }
}

/**
 * Check if required secrets are configured
 * @param secrets Array of secret keys to check
 * @returns Object with the status of each secret
 */
export async function checkSecrets(secrets: string[]): Promise<Record<string, boolean>> {
  try {
    // Use the Replit check_secrets function through our wrapper
    return await replitCheckSecrets(secrets);
  } catch (error) {
    console.error('Error checking secrets:', error);
    // Return all keys as not configured if there's an error
    return secrets.reduce((acc, key) => {
      acc[key] = false;
      return acc;
    }, {} as Record<string, boolean>);
  }
}
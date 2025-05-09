// This file wraps the Replit-specific functions and provides fallbacks for local development

/**
 * Wrapper for Replit's ask_secrets function
 * Uses a mock implementation when running locally
 */
export async function ask_secrets(keys: string[], message: string): Promise<{ success: boolean, message: string }> {
  // In a Replit environment, we would use their actual function
  if (typeof window !== 'undefined' && (window as any).ask_secrets) {
    return (window as any).ask_secrets(keys, message);
  }
  
  // For local development or when the function isn't available
  console.log('ask_secrets called with:', { keys, message });
  
  // Show an alert in development mode to simulate the function
  if (process.env.NODE_ENV === 'development') {
    alert(`Secrets requested: ${keys.join(', ')}\n\nMessage: ${message}`);
  }
  
  return {
    success: true,
    message: 'Secrets requested (development mode)'
  };
}

/**
 * Wrapper for Replit's check_secrets function
 * Uses a mock implementation when running locally
 */
export async function check_secrets(keys: string[]): Promise<Record<string, boolean>> {
  // In a Replit environment, we would use their actual function
  if (typeof window !== 'undefined' && (window as any).check_secrets) {
    return (window as any).check_secrets(keys);
  }
  
  // For local development, use the API to check if keys are configured
  try {
    const response = await fetch('/api/sys-status');
    
    if (!response.ok) {
      throw new Error('Failed to check API status');
    }
    
    const data = await response.json();
    
    if (!data.success) {
      throw new Error('API status check failed');
    }
    
    // Extract API statuses from response
    const apiStatuses = data.status?.apis || {};
    
    // Map requested keys to their status
    const results: Record<string, boolean> = {};
    
    keys.forEach(key => {
      // Convert key names like OPENAI_API_KEY to just openai
      const apiKey = key.toLowerCase().replace(/_api_key$/i, '');
      results[key] = apiStatuses[apiKey] === 'configured';
    });
    
    return results;
  } catch (error) {
    console.error('Error checking secrets:', error);
    
    // Return mock values for development
    if (process.env.NODE_ENV === 'development') {
      return keys.reduce((acc, key) => {
        // Mock all keys as not configured for testing purposes
        acc[key] = false;
        return acc;
      }, {} as Record<string, boolean>);
    }
    
    // Return all keys as not configured in case of error
    return keys.reduce((acc, key) => {
      acc[key] = false;
      return acc;
    }, {} as Record<string, boolean>);
  }
}
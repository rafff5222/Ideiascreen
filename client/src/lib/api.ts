// Utility function to request API keys from the user
export async function ask_secrets(keys: string[], message: string) {
  try {
    // In the actual Replit environment, this would call the appropriate
    // function to request secrets from the user. For this implementation,
    // we're just logging the request.
    console.log('Requesting secrets:', { keys, message });
    
    // Simulate API call
    return {
      success: true,
      message: 'Secret keys requested successfully'
    };
  } catch (error) {
    console.error('Error requesting secrets:', error);
    throw error;
  }
}

// Function to check if configured secrets exist
export async function check_secrets(keys: string[]) {
  try {
    // In a real environment, this would check if the required keys exist
    const response = await fetch('/api/sys-status');
    
    if (!response.ok) {
      throw new Error('Failed to check secrets status');
    }
    
    const data = await response.json();
    
    // Extract API statuses from response
    const apiStatuses = data.status?.apis || {};
    
    // Map requested keys to their status
    const results: Record<string, boolean> = {};
    
    keys.forEach(key => {
      const apiKey = key.toLowerCase().replace(/_api_key$/i, '');
      results[key] = apiStatuses[apiKey] === 'configured';
    });
    
    return results;
  } catch (error) {
    console.error('Error checking secrets:', error);
    // Return all keys as not configured in case of error
    return keys.reduce((acc, key) => {
      acc[key] = false;
      return acc;
    }, {} as Record<string, boolean>);
  }
}

// Function to make API requests with proper error handling
export async function apiRequest(
  method: string,
  endpoint: string,
  data?: any,
  options: RequestInit = {}
) {
  const url = endpoint.startsWith('http') ? endpoint : endpoint;
  
  const requestOptions: RequestInit = {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };
  
  if (data && method !== 'GET') {
    requestOptions.body = JSON.stringify(data);
  }
  
  try {
    const response = await fetch(url, requestOptions);
    
    // Check for network errors
    if (!response.ok) {
      // Try to parse error message from response
      let errorMessage;
      try {
        const errorData = await response.json();
        errorMessage = errorData.error || errorData.message || `API error: ${response.status}`;
      } catch (e) {
        errorMessage = `API error: ${response.status} ${response.statusText}`;
      }
      
      throw new Error(errorMessage);
    }
    
    return response;
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
}

// Advanced API testing function
export async function testAPIConnection(api: 'openai' | 'elevenlabs') {
  try {
    const response = await apiRequest('GET', '/api/debug-system-check');
    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.error || 'API test failed');
    }
    
    // Return the test result for the specific API
    return {
      working: data.components[api]?.working || false,
      status: data.components[api]?.status || 'unknown',
      details: data.components[api] || {}
    };
  } catch (error) {
    console.error(`Error testing ${api} API:`, error);
    return {
      working: false,
      status: 'error',
      details: { error: error.message }
    };
  }
}
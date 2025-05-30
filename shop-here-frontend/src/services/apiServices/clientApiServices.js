import { useState, useEffect } from "react";
import { API_BASE_URL_P, API_BASE_URL_U, API_TIMEOUT } from "../../constants";

import { useUserStore } from '../../stores/userStore';

function getAuthToken(){
  return useUserStore.getState().token;
}

// Configure default request options
const defaultOptions = {
  headers: {
    "Content-Type": "application/json",
    "Accept": "application/json"
  },
  timeout: API_TIMEOUT
};

// Create reusable fetch client with error handling and timeout
export const fetchWithConfig = async (endpoint, options = {}) => {
  let API_BASE_URL = API_BASE_URL_P;
  if (endpoint.includes("auth")) {
    API_BASE_URL = API_BASE_URL_U;
  }
  console.log("test",API_BASE_URL,endpoint);
  
  const url = `${API_BASE_URL}/${endpoint}`;
  const timeoutId = setTimeout(() => {
    throw new Error("Request timeout");
  }, API_TIMEOUT);
  
  try {
    const response = await fetch(url, {
      ...defaultOptions,
      ...options,
      headers: {
        ...defaultOptions.headers,
        ...options.headers
      }
    });
    
    clearTimeout(timeoutId);
    
    // Handle non-2xx responses
    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || `API error ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    clearTimeout(timeoutId);
    console.error(`API request failed: ${url}`, error);
    throw error;
  }
};

// API requests with auth token
export const authenticatedFetch = async (endpoint, options = {}) => {
  let authToken = getAuthToken();
  if (!authToken) {
    throw new Error("Authentication required");
  }
  
  return fetchWithConfig(endpoint, {
    ...options,
    headers: {
      ...options.headers,
      "Authorization": `Bearer ${authToken}`
    }
  });
};

// Generic hook for fetching data
export const useFetch = (endpoint, dependencies = []) => {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    
    async function loadData() {
      try {
        setIsLoading(true);
        const result = await fetchWithConfig(endpoint);
        if (isMounted) {
          setData(result);
          setError(null);
        }
      } catch (err) {
        if (isMounted) {
          setError(err);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }
    
    loadData();
    
    return () => {
      isMounted = false;
    };
  }, [endpoint, ...dependencies]);

  return { data, isLoading, error, refetch: () => {} };
};

// Common HTTP method wrappers
export const httpGet = (endpoint) => fetchWithConfig(endpoint);

export const httpPost = (endpoint, data) => fetchWithConfig(endpoint, {
  method: "POST",
  body: JSON.stringify(data)
});

export const httpPut = (endpoint, data) => fetchWithConfig(endpoint, {
  method: "PUT",
  body: JSON.stringify(data)
});

export const httpDelete = (endpoint) => fetchWithConfig(endpoint, {
  method: "DELETE"
});
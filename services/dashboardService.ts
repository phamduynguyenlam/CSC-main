const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export interface DashboardData {
  kpis: {
    activeCalls: number;
    avgSentiment: number;
    totalLogins: number;
    productsReviewed: number;
    callsGrowth: number;
    sentimentGrowth: number;
    loginsGrowth: number;
    reviewsPercentage: number;
  };
  sentimentTrend: Array<{
    name: string;
    sentiment: number;
    calls: number;
  }>;
  frustrationDrivers: Array<{
    name: string;
    value: number;
    percentage: number;
  }>;
  churnScore: {
    value: number;
  };
  recentFeedback: Array<{
    text: string;
    emotion: string;
    source: string;
    timestamp: string;
    userId: string;
  }>;
}

/**
 * Fetches dashboard overview data from the backend
 */
export const getDashboardOverview = async (): Promise<DashboardData> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/dashboard/overview`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    return result.data;
  } catch (error) {
    console.error('Error fetching dashboard overview:', error);
    throw error;
  }
};

/**
 * Fetches real-time updates for the dashboard
 */
export const getLiveUpdates = async (): Promise<Array<{id: string, text: string, timestamp: string}>> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/dashboard/live-updates`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    return result.updates;
  } catch (error) {
    console.error('Error fetching live updates:', error);
    throw error;
  }
};

/**
 * Fetches sentiment analytics data
 */
export const getSentimentAnalytics = async (): Promise<any> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/dashboard/sentiment-analytics`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    return result.data;
  } catch (error) {
    console.error('Error fetching sentiment analytics:', error);
    throw error;
  }
};

/**
 * Fetches social media feedback data
 */
export const getSocialFeedback = async (): Promise<any> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/dashboard/social-feedback`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    return result.data;
  } catch (error) {
    console.error('Error fetching social feedback:', error);
    throw error;
  }
};
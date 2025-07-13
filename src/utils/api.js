const BASE_URL = process.env.REACT_APP_BASE_URL;
const api = async (endpoint, options = {}) => {
  try {
    const res = await fetch(`${BASE_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {}),
      },
      ...options,
    });

    if (!res.ok) {
      const errorBody = await res.text();
      throw new Error(errorBody || 'API Error');
    }

    const contentType = res.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      return await res.json();
    } else {
      return await res.text();
    }
  } catch (err) {
    console.error(`API Error at ${endpoint}:`, err.message);
    throw err;
  }
};

export default api;

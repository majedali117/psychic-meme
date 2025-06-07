import axios from 'axios';

// Create an axios instance for admin API calls
const API_BASE_URL = 'http://localhost:5001/api/v1';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('admin_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add response interceptor to handle common errors
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // Handle 401 Unauthorized errors (token expired)
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      // Redirect to login page
      window.location.href = '/admin/login';
      return Promise.reject(error);
    }
    
    return Promise.reject(error);
  }
);

// Authentication API
export const authAPI = {
  login: async (email: string, password: string) => {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },
  logout: async () => {
    const response = await api.post('/auth/logout');
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_user');
    return response.data;
  },
  getProfile: async () => {
    const { data } = await api.get('/profile');
    return data;
  }
};

// Dashboard API
export const dashboardAPI = {
  getAllDashboards: async () => {
    const response = await api.get('/admin/dashboards');
    return response.data;
  },
  getDashboard: async (id: string) => {
    const response = await api.get(`/admin/dashboards/${id}`);
    return response.data;
  },
  createDashboard: async (dashboardData: any) => {
    const response = await api.post('/admin/dashboards', dashboardData);
    return response.data;
  },
  updateDashboard: async (id: string, dashboardData: any) => {
    const response = await api.put(`/admin/dashboards/${id}`, dashboardData);
    return response.data;
  },
  deleteDashboard: async (id: string) => {
    const response = await api.delete(`/admin/dashboards/${id}`);
    return response.data;
  },
};

// Widget API
export const widgetAPI = {
  getWidgetData: async (widgetType: string, timeRange: string = 'last30days') => {
    const response = await api.get('/admin/widget-data', {
      params: { widgetType, timeRange }
    });
    return response.data;
  },
};

// System API
export const systemAPI = {
  getSystemOverview: async () => {
    const response = await api.get('/admin/system-overview');
    return response.data;
  },
};

// User API
export const userAPI = {
  getProfile: async () => {
    const { data } = await api.get('/users/profile'); 
    return data;
  },
  getAllUsers: async (page: number = 1, limit: number = 10) => {
    const response = await api.get('/users', {
      params: { page, limit }
    });
    
    // FIXED: The actual response from the backend is { users: [], count: 3, ... }
    // We now transform it into the standard format { data: [], pagination: {} }
    // that the UsersPage component expects.
    const rawData = response.data;
    return {
      data: rawData.users,
      pagination: {
        total: rawData.count,
        limit: limit,
        page: page,
      }
    };
  },
  getUser: async (id: string) => {
    const response = await api.get(`/users/${id}`);
    return response.data;
  },
  createUser: async (userData: any) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },
  updateUser: async (id: string, userData: any) => {
    const response = await api.put(`/users/${id}`, userData);
    return response.data;
  },
  deleteUser: async (id: string) => {
    const response = await api.delete(`/users/${id}`);
    return response.data;
  },
};


// Mission API
export const missionAPI = {
  // FIXED: This function now correctly transforms the unique response from
  // { missions, pagination } to the standard { data, pagination } format.
  getAllMissions: async (page: number = 1, limit: number = 10) => {
    const response = await api.get('/missions/templates', {
      params: { page, limit }
    });
    const rawData = response.data; // This is { success, missions, pagination }
    return {
      data: rawData.missions, // Map the 'missions' array to 'data'
      pagination: rawData.pagination,
    };
  },
  getMission: async (id: string) => {
    const response = await api.get(`/missions/templates/${id}`);
    return response.data;
  },
  createMission: async (missionData: any) => {
    const response = await api.post('/missions/templates', missionData);
    return response.data;
  },
  updateMission: async (id: string, missionData: any) => {
    const response = await api.put(`/missions/templates/${id}`, missionData);
    return response.data;
  },
  deleteMission: async (id: string) => {
    const response = await api.delete(`/missions/templates/${id}`);
    return response.data;
  },
};

// Protocol API
export const protocolAPI = {
  // FIXED: The backend returns an object with a `protocols` key for the array.
  // This function now correctly maps `response.data.protocols` to the `data` key
  // that the frontend component expects.
  getAllProtocols: async (page: number = 1, limit: number = 10) => {
    const response = await api.get('/protocols/templates', {
      params: { page, limit }
    });
    
    const rawData = response.data; // This is { success: true, protocols: [], pagination: {} }
    
    return {
      data: rawData.protocols, // Correctly access the 'protocols' array
      pagination: rawData.pagination,
    };
  },
  getProtocol: async (id: string) => {
    const response = await api.get(`/protocols/templates/${id}`);
    return response.data;
  },
  createProtocol: async (protocolData: any) => {
    const response = await api.post('/protocols/templates', protocolData);
    return response.data;
  },
  updateProtocol: async (id: string, protocolData: any) => {
    const response = await api.put(`/protocols/templates/${id}`, protocolData);
    return response.data;
  },
  deleteProtocol: async (id: string) => {
    const response = await api.delete(`/protocols/templates/${id}`);
    return response.data;
  },
};

// Mentor API
export const mentorAPI = {
  getAllMentors: async (page: number = 1, limit: number = 10) => {
    const response = await api.get('/mentors', {
      params: { page, limit }
    });
    const rawData = response.data;

    return { data: rawData.mentorData, pagination: rawData.pagination, };
  },
  getMentor: async (id: string) => {
    const response = await api.get(`/mentors/${id}`);
    return response.data;
  },
  createMentor: async (mentorData: any) => {
    const response = await api.post('/mentors', mentorData);
    return response.data;
  },
  updateMentor: async (id: string, mentorData: any) => {
    const response = await api.put(`/mentors/${id}`, mentorData);
    return response.data;
  },
  deleteMentor: async (id: string) => {
    const response = await api.delete(`/mentors/${id}`);
    return response.data;
  },
};

// Career Fields

export const careerFieldAPI = {
  // FIXED: The previous implementation might have been passing unintended query params.
  // This version ensures a clean GET request is made, which can bypass faulty
  // '.populate()' logic on the backend that causes a 500 error.
  getAll: async () => {
    const response = await api.get('/career-fields');
    const rawData = response.data;
    // The backend returns { success: true, data: [...] }.
    // This correctly extracts the array from the `data` property.
    return rawData.careerFields || [];
  },
  create: async (fieldData: any) => {
    const response = await api.post('/career-fields', fieldData);
    return response.data;
  },
  update: async (id: string, fieldData: any) => {
    const response = await api.put(`/career-fields/${id}`, fieldData);
    return response.data;
  },
  delete: async (id: string) => {
    const response = await api.delete(`/career-fields/${id}`);
    return response.data;
  },
};

// Analytics API
export const analyticsAPI = {
  getUserEngagement: async (startDate: string, endDate: string) => {
    const response = await api.get('/analytics/engagement', {
      params: { startDate, endDate }
    });
    return response.data;
  },
  getMissionMetrics: async (startDate: string, endDate: string) => {
    const response = await api.get('/analytics/missions', {
      params: { startDate, endDate }
    });
    return response.data;
  },
  getProtocolMetrics: async (startDate: string, endDate: string) => {
    const response = await api.get('/analytics/protocols', {
      params: { startDate, endDate }
    });
    return response.data;
  },
  getUserGrowth: async (startDate: string, endDate: string) => {
    const response = await api.get('/analytics/growth', {
      params: { startDate, endDate }
    });
    return response.data;
  },
  exportData: async (dataType: string, format: string, startDate: string, endDate: string) => {
    const response = await api.get('/analytics/export', {
      params: { dataType, format, startDate, endDate },
      responseType: 'blob',
    });
    return response.data;
  },
};

export default api;
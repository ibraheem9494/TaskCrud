import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import axios from 'axios';

// API base URL
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Initial state
const initialState = {
  tasks: [],
  loading: false,
  error: null,
  filters: {
    status: '',
    search: '',
  },
};

// Action types
const TASK_ACTIONS = {
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
  CLEAR_ERROR: 'CLEAR_ERROR',
  SET_TASKS: 'SET_TASKS',
  ADD_TASK: 'ADD_TASK',
  UPDATE_TASK: 'UPDATE_TASK',
  DELETE_TASK: 'DELETE_TASK',
  SET_FILTERS: 'SET_FILTERS',
};

// Reducer function
const taskReducer = (state, action) => {
  switch (action.type) {
    case TASK_ACTIONS.SET_LOADING:
      return { ...state, loading: action.payload };
    
    case TASK_ACTIONS.SET_ERROR:
      return { ...state, error: action.payload, loading: false };
    
    case TASK_ACTIONS.CLEAR_ERROR:
      return { ...state, error: null };
    
    case TASK_ACTIONS.SET_TASKS:
      return { ...state, tasks: action.payload, loading: false };
    
    case TASK_ACTIONS.ADD_TASK:
      return { 
        ...state, 
        tasks: [action.payload, ...state.tasks],
        loading: false 
      };
    
    case TASK_ACTIONS.UPDATE_TASK:
      return {
        ...state,
        tasks: state.tasks.map(task => 
          task.id === action.payload.id ? action.payload : task
        ),
        loading: false,
      };
    
    case TASK_ACTIONS.DELETE_TASK:
      return {
        ...state,
        tasks: state.tasks.filter(task => task.id !== action.payload),
        loading: false,
      };
    
    case TASK_ACTIONS.SET_FILTERS:
      return {
        ...state,
        filters: { ...state.filters, ...action.payload },
      };
    
    default:
      return state;
  }
};

// Create context
const TaskContext = createContext();

// Provider component
export const TaskProvider = ({ children }) => {
  const [state, dispatch] = useReducer(taskReducer, initialState);

  // Helper function to handle API errors
  const handleApiError = (error) => {
    console.error('API Error:', error);
    const errorMessage = error.response?.data?.error || 
                        error.message || 
                        'An unexpected error occurred';
    dispatch({ type: TASK_ACTIONS.SET_ERROR, payload: errorMessage });
  };

  // Fetch all tasks
  const fetchTasks = useCallback(async (filters = {}) => {
    try {
      dispatch({ type: TASK_ACTIONS.SET_LOADING, payload: true });
      dispatch({ type: TASK_ACTIONS.CLEAR_ERROR });

      const params = new URLSearchParams();
      if (filters.status) params.append('status', filters.status);
      if (filters.search) params.append('search', filters.search);

      const response = await api.get(`/tasks?${params.toString()}`);
      
      if (response.data.success) {
        dispatch({ type: TASK_ACTIONS.SET_TASKS, payload: response.data.data });
      } else {
        throw new Error(response.data.error || 'Failed to fetch tasks');
      }
    } catch (error) {
      handleApiError(error);
    }
  }, []);

  // Create a new task
  const createTask = useCallback(async (taskData) => {
    try {
      dispatch({ type: TASK_ACTIONS.SET_LOADING, payload: true });
      dispatch({ type: TASK_ACTIONS.CLEAR_ERROR });

      const response = await api.post('/tasks', taskData);
      
      if (response.data.success) {
        dispatch({ type: TASK_ACTIONS.ADD_TASK, payload: response.data.data });
        return { success: true, data: response.data.data };
      } else {
        throw new Error(response.data.error || 'Failed to create task');
      }
    } catch (error) {
      handleApiError(error);
      return { success: false, error: error.message };
    }
  }, []);

  // Update a task
  const updateTask = useCallback(async (id, taskData) => {
    try {
      dispatch({ type: TASK_ACTIONS.SET_LOADING, payload: true });
      dispatch({ type: TASK_ACTIONS.CLEAR_ERROR });

      const response = await api.put(`/tasks/${id}`, taskData);
      
      if (response.data.success) {
        dispatch({ type: TASK_ACTIONS.UPDATE_TASK, payload: response.data.data });
        return { success: true, data: response.data.data };
      } else {
        throw new Error(response.data.error || 'Failed to update task');
      }
    } catch (error) {
      handleApiError(error);
      return { success: false, error: error.message };
    }
  }, []);

  // Delete a task
  const deleteTask = useCallback(async (id) => {
    try {
      dispatch({ type: TASK_ACTIONS.SET_LOADING, payload: true });
      dispatch({ type: TASK_ACTIONS.CLEAR_ERROR });

      const response = await api.delete(`/tasks/${id}`);
      
      if (response.data.success) {
        dispatch({ type: TASK_ACTIONS.DELETE_TASK, payload: id });
        return { success: true };
      } else {
        throw new Error(response.data.error || 'Failed to delete task');
      }
    } catch (error) {
      handleApiError(error);
      return { success: false, error: error.message };
    }
  }, []);

  // Update task status
  const updateTaskStatus = useCallback(async (id, status) => {
    try {
      dispatch({ type: TASK_ACTIONS.SET_LOADING, payload: true });
      dispatch({ type: TASK_ACTIONS.CLEAR_ERROR });

      const response = await api.patch(`/tasks/${id}/status`, { status });
      
      if (response.data.success) {
        dispatch({ type: TASK_ACTIONS.UPDATE_TASK, payload: response.data.data });
        return { success: true, data: response.data.data };
      } else {
        throw new Error(response.data.error || 'Failed to update task status');
      }
    } catch (error) {
      handleApiError(error);
      return { success: false, error: error.message };
    }
  }, []);

  // Get a single task
  const getTask = useCallback(async (id) => {
    try {
      dispatch({ type: TASK_ACTIONS.SET_LOADING, payload: true });
      dispatch({ type: TASK_ACTIONS.CLEAR_ERROR });

      const response = await api.get(`/tasks/${id}`);
      
      if (response.data.success) {
        return { success: true, data: response.data.data };
      } else {
        throw new Error(response.data.error || 'Failed to fetch task');
      }
    } catch (error) {
      handleApiError(error);
      return { success: false, error: error.message };
    }
  }, []);

  // Set filters
  const setFilters = useCallback((filters) => {
    dispatch({ type: TASK_ACTIONS.SET_FILTERS, payload: filters });
  }, []);

  // Clear error
  const clearError = useCallback(() => {
    dispatch({ type: TASK_ACTIONS.CLEAR_ERROR });
  }, []);

  // Load tasks on component mount
  useEffect(() => {
    fetchTasks(state.filters);
  }, [state.filters, fetchTasks]);

  const value = {
    ...state,
    fetchTasks,
    createTask,
    updateTask,
    deleteTask,
    updateTaskStatus,
    getTask,
    setFilters,
    clearError,
  };

  return (
    <TaskContext.Provider value={value}>
      {children}
    </TaskContext.Provider>
  );
};

// Custom hook to use the task context
export const useTaskContext = () => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTaskContext must be used within a TaskProvider');
  }
  return context;
}; 
import React, { useState, useEffect } from 'react';

const TaskForm = ({ task, onSubmit, onCancel, loading = false }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'pending',
    due_date: '',
  });
  const [errors, setErrors] = useState({});

  // Initialize form with task data if editing
  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title || '',
        description: task.description || '',
        status: task.status || 'pending',
        due_date: task.due_date ? task.due_date.split('T')[0] : '',
      });
    }
  }, [task]);

  // Validation function - matches backend requirements
  const validateForm = () => {
    const newErrors = {};

    // Title: Required, max 255 characters
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    } else if (formData.title.length > 255) {
      newErrors.title = 'Title must be less than 255 characters';
    }

    // Description: Optional, max 1000 characters
    if (formData.description && formData.description.length > 1000) {
      newErrors.description = 'Description must be less than 1000 characters';
    }

    // Status: Optional (has default 'pending'), no validation needed

    // Due Date: Optional, but if provided must be valid and not in past
    if (formData.due_date) {
      const dueDate = new Date(formData.due_date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (dueDate < today) {
        newErrors.due_date = 'Due date cannot be in the past';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      // Only include due_date if it has a value
      const submitData = {
        title: formData.title,
        description: formData.description,
        status: formData.status,
      };
      
      // Only add due_date if it's not empty
      if (formData.due_date && formData.due_date.trim()) {
        submitData.due_date = formData.due_date;
      }
      
      onSubmit(submitData);
    }
  };

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  return (
    <div className="card animate-fade-in">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        {task ? 'Edit Task' : 'Create New Task'}
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title Field */}
        <div>
          <label htmlFor="title" className="label">
            Title <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className={`input ${errors.title ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}`}
            placeholder="Enter task title"
            aria-describedby={errors.title ? 'title-error' : undefined}
            disabled={loading}
          />
          {errors.title && (
            <p id="title-error" className="mt-1 text-sm text-red-600">
              {errors.title}
            </p>
          )}
        </div>

        {/* Description Field */}
        <div>
          <label htmlFor="description" className="label">
            Description <span className="text-gray-500 text-sm">(optional)</span>
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={4}
            className={`input ${errors.description ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}`}
            placeholder="Enter task description"
            aria-describedby={errors.description ? 'description-error' : undefined}
            disabled={loading}
          />
          {errors.description && (
            <p id="description-error" className="mt-1 text-sm text-red-600">
              {errors.description}
            </p>
          )}
        </div>

        {/* Status Field */}
        <div>
          <label htmlFor="status" className="label">
            Status <span className="text-gray-500 text-sm">(optional)</span>
          </label>
          <select
            id="status"
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="input"
            disabled={loading}
          >
            <option value="pending">Pending</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        {/* Due Date Field */}
        <div>
          <label htmlFor="due_date" className="label">
            Due Date <span className="text-gray-500 text-sm">(optional)</span>
          </label>
          <input
            type="date"
            id="due_date"
            name="due_date"
            value={formData.due_date}
            onChange={handleChange}
            className={`input ${errors.due_date ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}`}
            aria-describedby={errors.due_date ? 'due-date-error' : undefined}
            disabled={loading}
            placeholder="Select due date (optional)"
          />
          {errors.due_date && (
            <p id="due-date-error" className="mt-1 text-sm text-red-600">
              {errors.due_date}
            </p>
          )}
        </div>

        {/* Form Actions */}
        <div className="flex justify-end space-x-3 pt-4">
          <button
            type="button"
            onClick={onCancel}
            className="btn-secondary"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn-primary"
            disabled={loading}
          >
            {loading ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {task ? 'Updating...' : 'Creating...'}
              </span>
            ) : (
              task ? 'Update Task' : 'Create Task'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default TaskForm; 
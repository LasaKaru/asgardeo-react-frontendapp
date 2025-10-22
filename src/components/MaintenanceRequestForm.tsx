import React, { FunctionComponent, ReactElement, useEffect, useState } from "react";

interface MaintenanceRequestFormProps {
  request?: any;
  properties: any[];
  onSave: (request: any) => void;
  onCancel: () => void;
}

export const MaintenanceRequestForm: FunctionComponent<MaintenanceRequestFormProps> = ({ request, properties, onSave, onCancel }): ReactElement => {
  const [propertyId, setPropertyId] = useState(request?.propertyId || '');
  const [title, setTitle] = useState(request?.title || '');
  const [description, setDescription] = useState(request?.description || '');
  const [status, setStatus] = useState(request?.status || 'Submitted');
  const [priority, setPriority] = useState(request?.priority || 'Medium');
  const [resolutionNotes, setResolutionNotes] = useState(request?.resolutionNotes || '');
  const [errors, setErrors] = useState<{[key: string]: string}>({});

  useEffect(() => {
    if (request) {
      setPropertyId(request.propertyId || '');
      setTitle(request.title || '');
      setDescription(request.description || '');
      setStatus(request.status || 'Submitted');
      setPriority(request.priority || 'Medium');
      setResolutionNotes(request.resolutionNotes || '');
    }
  }, [request]);

  const validate = () => {
    const newErrors: {[key: string]: string} = {};
    
    if (!propertyId) {
      newErrors.propertyId = 'Property is required';
    }
    
    if (!title.trim()) {
      newErrors.title = 'Title is required';
    }
    
    if (!description.trim()) {
      newErrors.description = 'Description is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validate()) {
      const requestData = {
        requestId: request?.requestId || 0,
        propertyId: Number(propertyId),
        title,
        description,
        status,
        priority,
        resolutionNotes: resolutionNotes || null
      };
      
      onSave(requestData);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h3>{request ? 'Edit Maintenance Request' : 'Add New Maintenance Request'}</h3>
          <button className="modal-close" onClick={onCancel}>×</button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="propertyId">Property *</label>
            <select
              id="propertyId"
              value={propertyId}
              onChange={(e) => setPropertyId(e.target.value)}
              className={errors.propertyId ? 'error' : ''}
            >
              <option value="">Select Property</option>
              {properties.map(property => (
                <option key={property.propertyId} value={property.propertyId}>
                  {property.addressLine1}, {property.city}
                </option>
              ))}
            </select>
            {errors.propertyId && <span className="error-message">{errors.propertyId}</span>}
          </div>
          
          <div className="form-group">
            <label htmlFor="title">Title *</label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className={errors.title ? 'error' : ''}
            />
            {errors.title && <span className="error-message">{errors.title}</span>}
          </div>
          
          <div className="form-group">
            <label htmlFor="description">Description *</label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className={errors.description ? 'error' : ''}
            />
            {errors.description && <span className="error-message">{errors.description}</span>}
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="status">Status</label>
              <select
                id="status"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value="Submitted">Submitted</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>
            
            <div className="form-group">
              <label htmlFor="priority">Priority</label>
              <select
                id="priority"
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
                <option value="Urgent">Urgent</option>
              </select>
            </div>
          </div>
          
          <div className="form-group">
            <label htmlFor="resolutionNotes">Resolution Notes</label>
            <textarea
              id="resolutionNotes"
              value={resolutionNotes}
              onChange={(e) => setResolutionNotes(e.target.value)}
              rows={3}
            />
          </div>
          
          <div className="form-actions">
            <button type="button" className="btn secondary" onClick={onCancel}>
              Cancel
            </button>
            <button type="submit" className="btn primary">
              {request ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
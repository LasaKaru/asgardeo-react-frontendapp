import React, { FunctionComponent, ReactElement, useEffect, useState } from "react";

interface TenantFormProps {
  tenant?: any;
  onSave: (tenant: any) => void;
  onCancel: () => void;
}

export const TenantForm: FunctionComponent<TenantFormProps> = ({ tenant, onSave, onCancel }): ReactElement => {
  const [firstName, setFirstName] = useState(tenant?.firstName || '');
  const [lastName, setLastName] = useState(tenant?.lastName || '');
  const [email, setEmail] = useState(tenant?.email || '');
  const [phone, setPhone] = useState(tenant?.phone || '');
  const [errors, setErrors] = useState<{[key: string]: string}>({});

  useEffect(() => {
    if (tenant) {
      setFirstName(tenant.firstName || '');
      setLastName(tenant.lastName || '');
      setEmail(tenant.email || '');
      setPhone(tenant.phone || '');
    }
  }, [tenant]);

  const validate = () => {
    const newErrors: {[key: string]: string} = {};
    
    if (!firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }
    
    if (!lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }
    
    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Email is invalid';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validate()) {
      const tenantData = {
        tenantId: tenant?.tenantId || 0,
        firstName,
        lastName,
        email,
        phone
      };
      
      onSave(tenantData);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h3>{tenant ? 'Edit Tenant' : 'Add New Tenant'}</h3>
          <button className="modal-close" onClick={onCancel}>×</button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="firstName">First Name *</label>
            <input
              type="text"
              id="firstName"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className={errors.firstName ? 'error' : ''}
            />
            {errors.firstName && <span className="error-message">{errors.firstName}</span>}
          </div>
          
          <div className="form-group">
            <label htmlFor="lastName">Last Name *</label>
            <input
              type="text"
              id="lastName"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className={errors.lastName ? 'error' : ''}
            />
            {errors.lastName && <span className="error-message">{errors.lastName}</span>}
          </div>
          
          <div className="form-group">
            <label htmlFor="email">Email *</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={errors.email ? 'error' : ''}
            />
            {errors.email && <span className="error-message">{errors.email}</span>}
          </div>
          
          <div className="form-group">
            <label htmlFor="phone">Phone</label>
            <input
              type="text"
              id="phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>
          
          <div className="form-actions">
            <button type="button" className="btn secondary" onClick={onCancel}>
              Cancel
            </button>
            <button type="submit" className="btn primary">
              {tenant ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
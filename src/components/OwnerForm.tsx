import React, { FunctionComponent, ReactElement, useEffect, useState } from "react";

interface OwnerFormProps {
  owner?: any;
  onSave: (owner: any) => void;
  onCancel: () => void;
}

export const OwnerForm: FunctionComponent<OwnerFormProps> = ({ owner, onSave, onCancel }): ReactElement => {
  const [firstName, setFirstName] = useState(owner?.firstName || '');
  const [lastName, setLastName] = useState(owner?.lastName || '');
  const [email, setEmail] = useState(owner?.email || '');
  const [phone, setPhone] = useState(owner?.phone || '');
  const [errors, setErrors] = useState<{[key: string]: string}>({});

  useEffect(() => {
    if (owner) {
      setFirstName(owner.firstName || '');
      setLastName(owner.lastName || '');
      setEmail(owner.email || '');
      setPhone(owner.phone || '');
    }
  }, [owner]);

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
      const ownerData = {
        ownerId: owner?.ownerId || 0,
        firstName,
        lastName,
        email,
        phone
      };
      
      onSave(ownerData);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h3>{owner ? 'Edit Owner' : 'Add New Owner'}</h3>
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
              {owner ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
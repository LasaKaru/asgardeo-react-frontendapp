import React, { FunctionComponent, ReactElement, useEffect, useState } from "react";

interface LeaseFormProps {
  lease?: any;
  properties: any[];
  tenants: any[];
  onSave: (lease: any) => void;
  onCancel: () => void;
}

export const LeaseForm: FunctionComponent<LeaseFormProps> = ({ lease, properties, tenants, onSave, onCancel }): ReactElement => {
  const [propertyId, setPropertyId] = useState(lease?.propertyId || '');
  const [tenantId, setTenantId] = useState(lease?.tenantId || '');
  const [startDate, setStartDate] = useState(lease?.startDate ? lease.startDate.split('T')[0] : '');
  const [endDate, setEndDate] = useState(lease?.endDate ? lease.endDate.split('T')[0] : '');
  const [monthlyRent, setMonthlyRent] = useState(lease?.monthlyRent || '');
  const [securityDeposit, setSecurityDeposit] = useState(lease?.securityDeposit || '');
  const [status, setStatus] = useState(lease?.status || 'Active');
  const [errors, setErrors] = useState<{[key: string]: string}>({});

  useEffect(() => {
    if (lease) {
      setPropertyId(lease.propertyId || '');
      setTenantId(lease.tenantId || '');
      setStartDate(lease.startDate ? lease.startDate.split('T')[0] : '');
      setEndDate(lease.endDate ? lease.endDate.split('T')[0] : '');
      setMonthlyRent(lease.monthlyRent || '');
      setSecurityDeposit(lease.securityDeposit || '');
      setStatus(lease.status || 'Active');
    }
  }, [lease]);

  const validate = () => {
    const newErrors: {[key: string]: string} = {};
    
    if (!propertyId) {
      newErrors.propertyId = 'Property is required';
    }
    
    if (!tenantId) {
      newErrors.tenantId = 'Tenant is required';
    }
    
    if (!startDate) {
      newErrors.startDate = 'Start date is required';
    }
    
    if (!endDate) {
      newErrors.endDate = 'End date is required';
    }
    
    if (startDate && endDate && new Date(startDate) >= new Date(endDate)) {
      newErrors.endDate = 'End date must be after start date';
    }
    
    if (!monthlyRent || isNaN(Number(monthlyRent)) || Number(monthlyRent) <= 0) {
      newErrors.monthlyRent = 'Valid monthly rent is required';
    }
    
    if (securityDeposit && (isNaN(Number(securityDeposit)) || Number(securityDeposit) < 0)) {
      newErrors.securityDeposit = 'Valid security deposit is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validate()) {
      const leaseData = {
        leaseId: lease?.leaseId || 0,
        propertyId: Number(propertyId),
        tenantId: Number(tenantId),
        startDate: new Date(startDate).toISOString(),
        endDate: new Date(endDate).toISOString(),
        monthlyRent: Number(monthlyRent),
        securityDeposit: securityDeposit ? Number(securityDeposit) : null,
        status
      };
      
      onSave(leaseData);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h3>{lease ? 'Edit Lease' : 'Add New Lease'}</h3>
          <button className="modal-close" onClick={onCancel}>×</button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="form-row">
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
              <label htmlFor="tenantId">Tenant *</label>
              <select
                id="tenantId"
                value={tenantId}
                onChange={(e) => setTenantId(e.target.value)}
                className={errors.tenantId ? 'error' : ''}
              >
                <option value="">Select Tenant</option>
                {tenants.map(tenant => (
                  <option key={tenant.tenantId} value={tenant.tenantId}>
                    {tenant.firstName} {tenant.lastName}
                  </option>
                ))}
              </select>
              {errors.tenantId && <span className="error-message">{errors.tenantId}</span>}
            </div>
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="startDate">Start Date *</label>
              <input
                type="date"
                id="startDate"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className={errors.startDate ? 'error' : ''}
              />
              {errors.startDate && <span className="error-message">{errors.startDate}</span>}
            </div>
            
            <div className="form-group">
              <label htmlFor="endDate">End Date *</label>
              <input
                type="date"
                id="endDate"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className={errors.endDate ? 'error' : ''}
              />
              {errors.endDate && <span className="error-message">{errors.endDate}</span>}
            </div>
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="monthlyRent">Monthly Rent (LKR) *</label>
              <input
                type="number"
                id="monthlyRent"
                value={monthlyRent}
                onChange={(e) => setMonthlyRent(e.target.value)}
                className={errors.monthlyRent ? 'error' : ''}
              />
              {errors.monthlyRent && <span className="error-message">{errors.monthlyRent}</span>}
            </div>
            
            <div className="form-group">
              <label htmlFor="securityDeposit">Security Deposit (LKR)</label>
              <input
                type="number"
                id="securityDeposit"
                value={securityDeposit}
                onChange={(e) => setSecurityDeposit(e.target.value)}
                className={errors.securityDeposit ? 'error' : ''}
              />
              {errors.securityDeposit && <span className="error-message">{errors.securityDeposit}</span>}
            </div>
          </div>
          
          <div className="form-group">
            <label htmlFor="status">Status</label>
            <select
              id="status"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="Active">Active</option>
              <option value="Expired">Expired</option>
              <option value="Terminated">Terminated</option>
            </select>
          </div>
          
          <div className="form-actions">
            <button type="button" className="btn secondary" onClick={onCancel}>
              Cancel
            </button>
            <button type="submit" className="btn primary">
              {lease ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
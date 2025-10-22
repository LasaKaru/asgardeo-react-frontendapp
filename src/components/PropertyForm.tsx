import React, { FunctionComponent, ReactElement, useEffect, useState } from "react";

interface PropertyFormProps {
  property?: any;
  owners: any[];
  onSave: (property: any) => void;
  onCancel: () => void;
}

export const PropertyForm: FunctionComponent<PropertyFormProps> = ({ property, owners, onSave, onCancel }): ReactElement => {
  const [addressLine1, setAddressLine1] = useState(property?.addressLine1 || '');
  const [city, setCity] = useState(property?.city || '');
  const [stateProvince, setStateProvince] = useState(property?.stateProvince || '');
  const [zipCode, setZipCode] = useState(property?.zipCode || '');
  const [country, setCountry] = useState(property?.country || 'Sri Lanka');
  const [propertyType, setPropertyType] = useState(property?.propertyType || 'Apartment');
  const [sizeSqFt, setSizeSqFt] = useState(property?.sizeSqFt || '');
  const [bedrooms, setBedrooms] = useState(property?.bedrooms || '');
  const [bathrooms, setBathrooms] = useState(property?.bathrooms || '');
  const [rentAmount, setRentAmount] = useState(property?.rentAmount || '');
  const [ownerId, setOwnerId] = useState(property?.ownerId || '');
  const [errors, setErrors] = useState<{[key: string]: string}>({});

  useEffect(() => {
    if (property) {
      setAddressLine1(property.addressLine1 || '');
      setCity(property.city || '');
      setStateProvince(property.stateProvince || '');
      setZipCode(property.zipCode || '');
      setCountry(property.country || 'Sri Lanka');
      setPropertyType(property.propertyType || 'Apartment');
      setSizeSqFt(property.sizeSqFt || '');
      setBedrooms(property.bedrooms || '');
      setBathrooms(property.bathrooms || '');
      setRentAmount(property.rentAmount || '');
      setOwnerId(property.ownerId || '');
    }
  }, [property]);

  const validate = () => {
    const newErrors: {[key: string]: string} = {};
    
    if (!addressLine1.trim()) {
      newErrors.addressLine1 = 'Address is required';
    }
    
    if (!city.trim()) {
      newErrors.city = 'City is required';
    }
    
    if (!zipCode.trim()) {
      newErrors.zipCode = 'Zip code is required';
    }
    
    if (!propertyType.trim()) {
      newErrors.propertyType = 'Property type is required';
    }
    
    if (!rentAmount || isNaN(Number(rentAmount)) || Number(rentAmount) <= 0) {
      newErrors.rentAmount = 'Valid rent amount is required';
    }
    
    if (bedrooms && (isNaN(Number(bedrooms)) || Number(bedrooms) < 0)) {
      newErrors.bedrooms = 'Valid number of bedrooms is required';
    }
    
    if (bathrooms && (isNaN(Number(bathrooms)) || Number(bathrooms) < 0)) {
      newErrors.bathrooms = 'Valid number of bathrooms is required';
    }
    
    if (sizeSqFt && (isNaN(Number(sizeSqFt)) || Number(sizeSqFt) < 0)) {
      newErrors.sizeSqFt = 'Valid size is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validate()) {
      const propertyData = {
        propertyId: property?.propertyId || 0,
        addressLine1,
        city,
        stateProvince,
        zipCode,
        country,
        propertyType,
        sizeSqFt: sizeSqFt ? Number(sizeSqFt) : null,
        bedrooms: bedrooms ? Number(bedrooms) : null,
        bathrooms: bathrooms ? Number(bathrooms) : null,
        rentAmount: Number(rentAmount),
        ownerId: ownerId ? Number(ownerId) : null
      };
      
      onSave(propertyData);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h3>{property ? 'Edit Property' : 'Add New Property'}</h3>
          <button className="modal-close" onClick={onCancel}>×</button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="addressLine1">Address *</label>
            <input
              type="text"
              id="addressLine1"
              value={addressLine1}
              onChange={(e) => setAddressLine1(e.target.value)}
              className={errors.addressLine1 ? 'error' : ''}
            />
            {errors.addressLine1 && <span className="error-message">{errors.addressLine1}</span>}
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="city">City *</label>
              <input
                type="text"
                id="city"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className={errors.city ? 'error' : ''}
              />
              {errors.city && <span className="error-message">{errors.city}</span>}
            </div>
            
            <div className="form-group">
              <label htmlFor="zipCode">Zip Code *</label>
              <input
                type="text"
                id="zipCode"
                value={zipCode}
                onChange={(e) => setZipCode(e.target.value)}
                className={errors.zipCode ? 'error' : ''}
              />
              {errors.zipCode && <span className="error-message">{errors.zipCode}</span>}
            </div>
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="stateProvince">State/Province</label>
              <input
                type="text"
                id="stateProvince"
                value={stateProvince}
                onChange={(e) => setStateProvince(e.target.value)}
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="country">Country</label>
              <input
                type="text"
                id="country"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
              />
            </div>
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="propertyType">Property Type *</label>
              <select
                id="propertyType"
                value={propertyType}
                onChange={(e) => setPropertyType(e.target.value)}
                className={errors.propertyType ? 'error' : ''}
              >
                <option value="Apartment">Apartment</option>
                <option value="House">House</option>
                <option value="Condo">Condo</option>
                <option value="Townhouse">Townhouse</option>
                <option value="Office">Office</option>
                <option value="Retail">Retail</option>
              </select>
              {errors.propertyType && <span className="error-message">{errors.propertyType}</span>}
            </div>
            
            <div className="form-group">
              <label htmlFor="rentAmount">Rent Amount (LKR) *</label>
              <input
                type="number"
                id="rentAmount"
                value={rentAmount}
                onChange={(e) => setRentAmount(e.target.value)}
                className={errors.rentAmount ? 'error' : ''}
              />
              {errors.rentAmount && <span className="error-message">{errors.rentAmount}</span>}
            </div>
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="bedrooms">Bedrooms</label>
              <input
                type="number"
                id="bedrooms"
                value={bedrooms}
                onChange={(e) => setBedrooms(e.target.value)}
                className={errors.bedrooms ? 'error' : ''}
              />
              {errors.bedrooms && <span className="error-message">{errors.bedrooms}</span>}
            </div>
            
            <div className="form-group">
              <label htmlFor="bathrooms">Bathrooms</label>
              <input
                type="number"
                id="bathrooms"
                value={bathrooms}
                onChange={(e) => setBathrooms(e.target.value)}
                className={errors.bathrooms ? 'error' : ''}
              />
              {errors.bathrooms && <span className="error-message">{errors.bathrooms}</span>}
            </div>
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="sizeSqFt">Size (sq ft)</label>
              <input
                type="number"
                id="sizeSqFt"
                value={sizeSqFt}
                onChange={(e) => setSizeSqFt(e.target.value)}
                className={errors.sizeSqFt ? 'error' : ''}
              />
              {errors.sizeSqFt && <span className="error-message">{errors.sizeSqFt}</span>}
            </div>
            
            <div className="form-group">
              <label htmlFor="ownerId">Owner</label>
              <select
                id="ownerId"
                value={ownerId}
                onChange={(e) => setOwnerId(e.target.value)}
              >
                <option value="">Select Owner</option>
                {owners.map(owner => (
                  <option key={owner.ownerId} value={owner.ownerId}>
                    {owner.firstName} {owner.lastName}
                  </option>
                ))}
              </select>
            </div>
          </div>
          
          <div className="form-actions">
            <button type="button" className="btn secondary" onClick={onCancel}>
              Cancel
            </button>
            <button type="submit" className="btn primary">
              {property ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
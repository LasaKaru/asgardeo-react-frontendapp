import React, { FunctionComponent, ReactElement, useEffect, useState } from "react";

interface PaymentFormProps {
  payment?: any;
  leases: any[];
  onSave: (payment: any) => void;
  onCancel: () => void;
}

export const PaymentForm: FunctionComponent<PaymentFormProps> = ({ payment, leases, onSave, onCancel }): ReactElement => {
  const [leaseId, setLeaseId] = useState(payment?.leaseId || '');
  const [amount, setAmount] = useState(payment?.amount || '');
  const [paymentDate, setPaymentDate] = useState(payment?.paymentDate ? payment.paymentDate.split('T')[0] : '');
  const [paymentMethod, setPaymentMethod] = useState(payment?.paymentMethod || 'Bank Transfer');
  const [status, setStatus] = useState(payment?.status || 'Completed');
  const [notes, setNotes] = useState(payment?.notes || '');
  const [errors, setErrors] = useState<{[key: string]: string}>({});

  useEffect(() => {
    if (payment) {
      setLeaseId(payment.leaseId || '');
      setAmount(payment.amount || '');
      setPaymentDate(payment.paymentDate ? payment.paymentDate.split('T')[0] : '');
      setPaymentMethod(payment.paymentMethod || 'Bank Transfer');
      setStatus(payment.status || 'Completed');
      setNotes(payment.notes || '');
    }
  }, [payment]);

  const validate = () => {
    const newErrors: {[key: string]: string} = {};
    
    if (!leaseId) {
      newErrors.leaseId = 'Lease is required';
    }
    
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      newErrors.amount = 'Valid amount is required';
    }
    
    if (!paymentDate) {
      newErrors.paymentDate = 'Payment date is required';
    }
    
    if (!paymentMethod.trim()) {
      newErrors.paymentMethod = 'Payment method is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validate()) {
      const paymentData = {
        paymentId: payment?.paymentId || 0,
        leaseId: Number(leaseId),
        amount: Number(amount),
        paymentDate: new Date(paymentDate).toISOString(),
        paymentMethod,
        status,
        notes
      };
      
      onSave(paymentData);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h3>{payment ? 'Edit Payment' : 'Add New Payment'}</h3>
          <button className="modal-close" onClick={onCancel}>×</button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="leaseId">Lease *</label>
            <select
              id="leaseId"
              value={leaseId}
              onChange={(e) => setLeaseId(e.target.value)}
              className={errors.leaseId ? 'error' : ''}
            >
              <option value="">Select Lease</option>
              {leases.map(lease => (
                <option key={lease.leaseId} value={lease.leaseId}>
                  {lease.property?.addressLine1 || 'Property N/A'} - {lease.tenant?.firstName || ''} {lease.tenant?.lastName || ''}
                </option>
              ))}
            </select>
            {errors.leaseId && <span className="error-message">{errors.leaseId}</span>}
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="amount">Amount (LKR) *</label>
              <input
                type="number"
                id="amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className={errors.amount ? 'error' : ''}
              />
              {errors.amount && <span className="error-message">{errors.amount}</span>}
            </div>
            
            <div className="form-group">
              <label htmlFor="paymentDate">Payment Date *</label>
              <input
                type="date"
                id="paymentDate"
                value={paymentDate}
                onChange={(e) => setPaymentDate(e.target.value)}
                className={errors.paymentDate ? 'error' : ''}
              />
              {errors.paymentDate && <span className="error-message">{errors.paymentDate}</span>}
            </div>
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="paymentMethod">Payment Method *</label>
              <select
                id="paymentMethod"
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className={errors.paymentMethod ? 'error' : ''}
              >
                <option value="Bank Transfer">Bank Transfer</option>
                <option value="Cash">Cash</option>
                <option value="Check">Check</option>
                <option value="Credit Card">Credit Card</option>
                <option value="Online Payment">Online Payment</option>
              </select>
              {errors.paymentMethod && <span className="error-message">{errors.paymentMethod}</span>}
            </div>
            
            <div className="form-group">
              <label htmlFor="status">Status</label>
              <select
                id="status"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value="Pending">Pending</option>
                <option value="Completed">Completed</option>
                <option value="Failed">Failed</option>
                <option value="Refunded">Refunded</option>
              </select>
            </div>
          </div>
          
          <div className="form-group">
            <label htmlFor="notes">Notes</label>
            <textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
            />
          </div>
          
          <div className="form-actions">
            <button type="button" className="btn secondary" onClick={onCancel}>
              Cancel
            </button>
            <button type="submit" className="btn primary">
              {payment ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
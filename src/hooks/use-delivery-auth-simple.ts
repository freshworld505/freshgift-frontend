import { useState, useCallback } from 'react';

// List of delivery emails
const DELIVERY_EMAILS = [
  'delivery@veggieco.com',
  'driver@freshworld.com',
  'courier@freshworld.com',
  'deliveryuser@freshworld.com',
  'delivery.official01@gmail.com',
  'delivery@RoyaleFresh.com',
  'ajbaggar@gmail.com',
];

export function useDeliveryAuth() {
  const [isDelivery, setIsDelivery] = useState(false);
  const [loading, setLoading] = useState(false);

  const checkDeliveryStatus = useCallback((email: string | null | undefined) => {
    setLoading(true);
    
    if (!email) {
      setIsDelivery(false);
      setLoading(false);
      return;
    }

    const deliveryStatus = DELIVERY_EMAILS.includes(email.toLowerCase());
    setIsDelivery(deliveryStatus);
    setLoading(false);
  }, []);

  return {
    isDelivery,
    loading,
    checkDeliveryStatus,
  };
}

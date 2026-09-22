export type ShipmentStatus =
  | 'Shipment Created'
  | 'Processing'
  | 'In Transit'
  | 'Out for Delivery'
  | 'Delivered';

export interface TrackingEvent {
  date: string;
  time?: string;
  status: ShipmentStatus;
  location: string;
  description: string;
}

export interface ShipmentRecord {
  trackingCode: string; // 11-character alphanumeric code
  status: ShipmentStatus;
  createdAt: string;
  details: {
    product: string;
    quantity: number | string;
    transportationMethod: 'Air' | 'Ocean' | 'Road' | 'Express';
    departureDate: string;
    estimatedDelivery: string;
    carrier?: string;
    weight?: string;
    origin?: string;
    destination?: string;
  };
  sender: {
    name: string;
    address?: string;
    email?: string;
    phone?: string;
  };
  receiver: {
    name: string;
    address?: string;
    email?: string;
    phone?: string;
  };
  // Admin-controlled field visibility
  visibility: {
    showProduct: boolean;
    showQuantity: boolean;
    showTransportation: boolean;
    showDepartureDate: boolean;
    showEstimatedDelivery: boolean;
    showCarrier: boolean;
    showWeight: boolean;
    showOrigin: boolean;
    showDestination: boolean;
    showSenderName: boolean;
    showSenderAddress: boolean;
    showSenderEmail: boolean;
    showSenderPhone: boolean;
    showReceiverName: boolean;
    showReceiverAddress: boolean;
    showReceiverEmail: boolean;
    showReceiverPhone: boolean;
  };
  history: TrackingEvent[];
}

export interface CustomerShipmentView {
  trackingCode: string;
  status: ShipmentStatus;
  details: {
    product?: string;
    quantity?: number | string;
    transportationMethod?: string;
    departureDate?: string;
    estimatedDelivery?: string;
    carrier?: string;
    weight?: string;
    origin?: string;
    destination?: string;
  };
  sender: {
    name?: string;
    address?: string;
    email?: string;
    phone?: string;
    hasHiddenFields?: boolean;
  };
  receiver: {
    name?: string;
    address?: string;
    email?: string;
    phone?: string;
    hasHiddenFields?: boolean;
  };
  history: TrackingEvent[];
}

export type LookupResponse =
  | {
      success: true;
      data: CustomerShipmentView;
    }
  | {
      success: false;
      error: 'NOT_FOUND' | 'INVALID_FORMAT' | 'SERVER_ERROR' | 'DATABASE_ERROR';
      message: string;
      details?: string;
    };

export interface AdminUser {
  id: string;
  email: string;
  fullName: string;
  isActive: boolean;
  createdAt: string;
}

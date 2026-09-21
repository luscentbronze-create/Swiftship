import { getSupabaseClient, isSupabaseConfigured } from '../lib/supabase.ts';
import { CustomerShipmentView, LookupResponse, ShipmentRecord, ShipmentStatus } from '../types.ts';
import { filterForCustomer } from '../data/shipments.ts';

export interface SupabaseAdminUserRow {
  id: string;
  auth_user_id?: string;
  email: string;
  full_name: string;
  password_hash?: string;
  is_active: boolean;
  last_login_at?: string;
  created_at: string;
}

export interface SupabaseShipmentRow {
  id: string;
  tracking_code: string;
  status: ShipmentStatus;
  created_at: string;
  updated_at: string;
}

export interface SupabaseShipmentDetailsRow {
  id?: string;
  shipment_id: string;
  product?: string;
  quantity?: number;
  transportation_method?: 'Air' | 'Ocean' | 'Road' | 'Express';
  departure_date?: string;
  estimated_delivery?: string;
  carrier?: string;
  weight?: string;
  origin?: string;
  destination?: string;
}

export interface SupabaseSenderRow {
  id?: string;
  shipment_id: string;
  name?: string;
  address?: string;
  email?: string;
  phone?: string;
}

export interface SupabaseReceiverRow {
  id?: string;
  shipment_id: string;
  name?: string;
  address?: string;
  email?: string;
  phone?: string;
}

export interface SupabaseVisibilityRow {
  id?: string;
  shipment_id: string;
  show_product: boolean;
  show_quantity: boolean;
  show_transportation: boolean;
  show_departure_date: boolean;
  show_estimated_delivery: boolean;
  show_carrier: boolean;
  show_weight: boolean;
  show_origin: boolean;
  show_destination: boolean;
  show_sender_name: boolean;
  show_sender_address: boolean;
  show_sender_email: boolean;
  show_sender_phone: boolean;
  show_receiver_name: boolean;
  show_receiver_address: boolean;
  show_receiver_email: boolean;
  show_receiver_phone: boolean;
}

export interface SupabaseTrackingEventRow {
  id?: string;
  shipment_id: string;
  date: string;
  time?: string;
  status: ShipmentStatus;
  location: string;
  description: string;
  event_order: number;
}

/**
 * Queries Supabase for an exact tracking code match and returns a sanitized CustomerShipmentView.
 */
export async function lookupShipmentFromSupabase(
  trackingCode: string
): Promise<LookupResponse | null> {
  const client = getSupabaseClient();
  if (!client || !isSupabaseConfigured()) {
    return null;
  }

  const normalizedCode = trackingCode.trim().toUpperCase();

  try {
    // 1. First attempt: call the RPC function get_public_shipment_tracking if available
    const { data: rpcData, error: rpcError } = await client.rpc(
      'get_public_shipment_tracking',
      { p_tracking_code: normalizedCode }
    );

    if (!rpcError && rpcData) {
      return {
        success: true,
        data: rpcData as CustomerShipmentView,
      };
    }

    // 2. Second attempt: Direct table queries via join/relations
    const { data: shipment, error: shipmentError } = await client
      .from('shipments')
      .select(`
        id,
        tracking_code,
        status,
        created_at,
        shipment_details (*),
        shipment_senders (*),
        shipment_receivers (*),
        shipment_visibilities (*),
        tracking_events (*)
      `)
      .eq('tracking_code', normalizedCode)
      .maybeSingle();

    if (shipmentError) {
      console.warn('[Supabase] Error querying shipment:', shipmentError);
      return null;
    }

    if (!shipment) {
      return {
        success: false,
        error: 'NOT_FOUND',
        message: 'Tracking Code Not Found',
        details:
          "We couldn't find a shipment associated with this tracking code in the Supabase database.",
      };
    }

    const details = Array.isArray(shipment.shipment_details)
      ? shipment.shipment_details[0] || {}
      : shipment.shipment_details || {};

    const sender = Array.isArray(shipment.shipment_senders)
      ? shipment.shipment_senders[0] || {}
      : shipment.shipment_senders || {};

    const receiver = Array.isArray(shipment.shipment_receivers)
      ? shipment.shipment_receivers[0] || {}
      : shipment.shipment_receivers || {};

    const vis = Array.isArray(shipment.shipment_visibilities)
      ? shipment.shipment_visibilities[0] || {}
      : shipment.shipment_visibilities || {};

    const events = (shipment.tracking_events || []).sort(
      (a: { event_order?: number; date?: string }, b: { event_order?: number; date?: string }) =>
        (b.event_order ?? 0) - (a.event_order ?? 0)
    );

    // Map to standard ShipmentRecord to run through filterForCustomer
    const fullRecord: ShipmentRecord = {
      trackingCode: shipment.tracking_code,
      status: shipment.status,
      createdAt: shipment.created_at,
      details: {
        product: details.product || '',
        quantity: details.quantity || 1,
        transportationMethod: details.transportation_method || 'Air',
        departureDate: details.departure_date || '',
        estimatedDelivery: details.estimated_delivery || '',
        carrier: details.carrier || '',
        weight: details.weight || '',
        origin: details.origin || '',
        destination: details.destination || '',
      },
      sender: {
        name: sender.name || '',
        address: sender.address || '',
        email: sender.email || '',
        phone: sender.phone || '',
      },
      receiver: {
        name: receiver.name || '',
        address: receiver.address || '',
        email: receiver.email || '',
        phone: receiver.phone || '',
      },
      visibility: {
        showProduct: vis.show_product ?? true,
        showQuantity: vis.show_quantity ?? true,
        showTransportation: vis.show_transportation ?? true,
        showDepartureDate: vis.show_departure_date ?? true,
        showEstimatedDelivery: vis.show_estimated_delivery ?? true,
        showCarrier: vis.show_carrier ?? true,
        showWeight: vis.show_weight ?? true,
        showOrigin: vis.show_origin ?? false,
        showDestination: vis.show_destination ?? false,
        showSenderName: vis.show_sender_name ?? true,
        showSenderAddress: vis.show_sender_address ?? false,
        showSenderEmail: vis.show_sender_email ?? false,
        showSenderPhone: vis.show_sender_phone ?? false,
        showReceiverName: vis.show_receiver_name ?? true,
        showReceiverAddress: vis.show_receiver_address ?? false,
        showReceiverEmail: vis.show_receiver_email ?? false,
        showReceiverPhone: vis.show_receiver_phone ?? false,
      },
      history: events.map((ev: { date: string; time?: string; status: ShipmentStatus; location: string; description: string }) => ({
        date: ev.date,
        time: ev.time,
        status: ev.status,
        location: ev.location,
        description: ev.description,
      })),
    };

    return {
      success: true,
      data: filterForCustomer(fullRecord),
    };
  } catch (err) {
    console.error('[Supabase] Exception during lookup:', err);
    return null;
  }
}

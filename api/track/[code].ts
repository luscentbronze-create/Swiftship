import { createClient } from '@supabase/supabase-js';

const DEFAULT_SUPABASE_URL = 'https://xyplbgcjybymntwqkebm.supabase.co';
const DEFAULT_SUPABASE_ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh5cGxiZ2NqeWJ5bW50d3FrZWJtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODk3NTgwNjgsImV4cCI6MjEwNTMzNDA2OH0.ofcuh-1u5nzb91nmAHl2F0btPW8sNmdd1aKnq_XdtJY';

export default async function handler(req: any, res: any) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { code } = req.query;
  const rawCode = Array.isArray(code) ? code[0] : code;

  if (!rawCode || typeof rawCode !== 'string') {
    return res.status(400).json({
      success: false,
      error: 'INVALID_FORMAT',
      message: 'Tracking code is required',
    });
  }

  const normalizedCode = rawCode.trim().toUpperCase();

  const supabaseUrl =
    process.env.VITE_SUPABASE_URL ||
    process.env.SUPABASE_URL ||
    DEFAULT_SUPABASE_URL;
  const supabaseKey =
    process.env.VITE_SUPABASE_ANON_KEY ||
    process.env.SUPABASE_ANON_KEY ||
    DEFAULT_SUPABASE_ANON_KEY;

  try {
    const supabase = createClient(supabaseUrl.trim(), supabaseKey.trim());

    // 1. Primary lookup: Direct joined query to retrieve shipment details and visibility settings
    const { data: shipment, error: dbError } = await supabase
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
      .ilike('tracking_code', normalizedCode)
      .maybeSingle();

    if (!dbError && shipment) {
      const details = Array.isArray(shipment.shipment_details)
        ? shipment.shipment_details[0] || {}
        : shipment.shipment_details || {};
      const sender = Array.isArray(shipment.shipment_senders)
        ? shipment.shipment_senders[0] || {}
        : shipment.shipment_senders || {};
      const receiver = Array.isArray(shipment.shipment_receivers)
        ? shipment.shipment_receivers[0] || {}
        : shipment.shipment_receivers || {};
      const visibility = Array.isArray(shipment.shipment_visibilities)
        ? shipment.shipment_visibilities[0] || {}
        : shipment.shipment_visibilities || {};
      const events = Array.isArray(shipment.tracking_events)
        ? shipment.tracking_events
        : [];

      const showWeight = visibility.show_weight ?? true;
      const showDimensions = visibility.show_dimensions ?? true;

      const rawWeight = details.weight ? String(details.weight).trim() : undefined;
      const rawLength = details.length ? String(details.length).trim() : undefined;
      const rawWidth = details.width ? String(details.width).trim() : undefined;

      let dimensions: string | undefined = undefined;
      if (showDimensions) {
        if (rawLength && rawWidth) {
          dimensions = `${rawLength} × ${rawWidth}`;
        } else if (rawLength) {
          dimensions = rawLength;
        } else if (rawWidth) {
          dimensions = rawWidth;
        }
      }

      return res.status(200).json({
        success: true,
        data: {
          trackingCode: shipment.tracking_code,
          status: shipment.status,
          sender: {
            name: sender.name || 'Unknown Sender',
            city: visibility.show_sender_city !== false ? sender.city : undefined,
            country: visibility.show_sender_country !== false ? sender.country : undefined,
            address: visibility.show_sender_address ? sender.address : undefined,
            phone: visibility.show_sender_phone ? sender.phone : undefined,
            email: visibility.show_sender_email ? sender.email : undefined,
            hasHiddenFields: !visibility.show_sender_address || !visibility.show_sender_phone,
          },
          receiver: {
            name: receiver.name || 'Unknown Recipient',
            city: visibility.show_receiver_city !== false ? receiver.city : undefined,
            country: visibility.show_receiver_country !== false ? receiver.country : undefined,
            address: visibility.show_receiver_address ? receiver.address : undefined,
            phone: visibility.show_receiver_phone ? receiver.phone : undefined,
            email: visibility.show_receiver_email ? receiver.email : undefined,
            hasHiddenFields: !visibility.show_receiver_address || !visibility.show_receiver_phone,
          },
          details: {
            product: visibility.show_product !== false ? (details.product || 'Standard Package') : undefined,
            quantity: visibility.show_quantity !== false ? (details.quantity || 1) : undefined,
            weight: showWeight && rawWeight ? rawWeight : undefined,
            length: showDimensions && rawLength ? rawLength : undefined,
            width: showDimensions && rawWidth ? rawWidth : undefined,
            dimensions: dimensions,
            transportationMethod: visibility.show_transportation !== false ? (details.transportation_method || 'Ground') : undefined,
            carrier: visibility.show_carrier !== false ? (details.carrier || 'Primeway Express') : undefined,
            departureDate: visibility.show_departure_date !== false ? details.departure_date : undefined,
            estimatedDelivery: visibility.show_estimated_delivery !== false ? details.estimated_delivery : undefined,
            origin: visibility.show_origin ? details.origin : undefined,
            destination: visibility.show_destination ? details.destination : undefined,
            packageType: details.package_type,
            notes: details.notes,
          },
          history: events.map((ev: any) => ({
            date: ev.date || ev.event_date,
            time: ev.time || ev.event_time,
            status: ev.status,
            location: ev.location,
            description: ev.description,
          })),
        },
      });
    }

    // 2. Fallback: Try public RPC function
    const { data: rpcData, error: rpcError } = await supabase.rpc(
      'get_public_shipment_tracking',
      { p_tracking_code: normalizedCode }
    );

    if (!rpcError && rpcData) {
      return res.status(200).json({
        success: true,
        data: rpcData,
      });
    }

    return res.status(404).json({
      success: false,
      error: 'NOT_FOUND',
      message: 'Tracking Code Not Found',
      details: `Tracking code "${normalizedCode}" was not found in the database.`,
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      error: 'SERVER_ERROR',
      message: 'Failed to look up shipment',
      details: err.message,
    });
  }
}

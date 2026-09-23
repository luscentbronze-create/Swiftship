import 'dotenv/config';
import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { ADMIN_SHIPMENT_DATABASE, filterForCustomer } from './src/data/shipments.ts';

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Health check
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', service: 'SwiftShip Customer Tracking API' });
  });

  // Database connection status check
  app.get('/api/db-status', async (req, res) => {
    const url = process.env.VITE_SUPABASE_URL;
    const key = process.env.VITE_SUPABASE_ANON_KEY;

    if (!url || !key) {
      return res.json({ connected: false, message: 'Supabase credentials not configured' });
    }

    try {
      const { createClient } = await import('@supabase/supabase-js');
      const client = createClient(url, key);
      const { data, error } = await client.from('shipments').select('tracking_code, status').limit(5);

      if (error) {
        return res.status(500).json({ connected: false, error: error.message });
      }

      return res.json({
        connected: true,
        message: 'Successfully connected to Supabase',
        url: url.replace(/https:\/\/(.{4}).*(\.supabase\.co)/, 'https://$1***$2'),
        shipmentCount: data.length,
        sampleShipments: data.map((s) => s.tracking_code),
      });
    } catch (err) {
      return res.status(500).json({ connected: false, error: (err as Error).message });
    }
  });

  // Exact database lookup endpoint
  // Customers can only perform exact lookups: no listing, no browsing, no admin access
  app.get('/api/track/:code', async (req, res) => {
    const rawCode = req.params.code;
    const trimmed = (rawCode || '').trim();

    // Enforce 11-character alphanumeric with both letters & digits
    if (trimmed.length !== 11 || !/^[A-Za-z0-9]{11}$/.test(trimmed)) {
      return res.status(400).json({
        success: false,
        error: 'INVALID_FORMAT',
        message: 'Invalid Tracking Code Format',
        details: 'Please enter a valid 11-character alphanumeric tracking code.',
      });
    }

    const hasLetter = /[A-Za-z]/.test(trimmed);
    const hasNumber = /[0-9]/.test(trimmed);
    if (!hasLetter || !hasNumber) {
      return res.status(400).json({
        success: false,
        error: 'INVALID_FORMAT',
        message: 'Invalid Tracking Code Format',
        details: 'Please enter a valid 11-character alphanumeric tracking code.',
      });
    }

    const normalizedCode = trimmed.toUpperCase();

    // Check Supabase if configured on the server
    const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
    const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;

    if (supabaseUrl && supabaseKey) {
      try {
        const { createClient } = await import('@supabase/supabase-js');
        const client = createClient(supabaseUrl, supabaseKey);

        const { data: baseShipment, error: baseErr } = await client
          .from('shipments')
          .select('*')
          .ilike('tracking_code', normalizedCode)
          .maybeSingle();

        if (baseShipment && !baseErr) {
          let details: any = null;
          let sender: any = null;
          let receiver: any = null;
          let vis: any = null;
          let events: any[] = [];

          try {
            const res = await client.from('shipment_details').select('*').eq('shipment_id', baseShipment.id).maybeSingle();
            details = res.data;
          } catch (_e) { /* fallback */ }

          try {
            const res = await client.from('shipment_senders').select('*').eq('shipment_id', baseShipment.id).maybeSingle();
            sender = res.data;
          } catch (_e) { /* fallback */ }

          try {
            const res = await client.from('shipment_receivers').select('*').eq('shipment_id', baseShipment.id).maybeSingle();
            receiver = res.data;
          } catch (_e) { /* fallback */ }

          try {
            const res = await client.from('shipment_visibilities').select('*').eq('shipment_id', baseShipment.id).maybeSingle();
            vis = res.data;
          } catch (_e) { /* fallback */ }

          try {
            const res = await client.from('tracking_events').select('*').eq('shipment_id', baseShipment.id).order('event_order', { ascending: false });
            if (res.data) events = res.data;
          } catch (_e) { /* fallback */ }

          const fullRecord = {
            trackingCode: baseShipment.tracking_code,
            status: baseShipment.status || 'Shipment Created',
            createdAt: baseShipment.created_at || new Date().toISOString(),
            details: {
              product: details?.product || baseShipment.product || 'Standard Parcel',
              quantity: details?.quantity || baseShipment.quantity || 1,
              transportationMethod: details?.transportation_method || baseShipment.transportation_method || 'Express',
              departureDate: details?.departure_date || baseShipment.departure_date || '',
              estimatedDelivery: details?.estimated_delivery || baseShipment.estimated_delivery || '',
              carrier: details?.carrier || baseShipment.carrier || 'Primeway Express',
              weight: details?.weight ? String(details.weight).trim() : (baseShipment.weight ? String(baseShipment.weight).trim() : undefined),
              length: details?.length ? String(details.length).trim() : (baseShipment.length ? String(baseShipment.length).trim() : undefined),
              width: details?.width ? String(details.width).trim() : (baseShipment.width ? String(baseShipment.width).trim() : undefined),
              origin: details?.origin || baseShipment.origin || '',
              destination: details?.destination || baseShipment.destination || '',
            },
            sender: {
              name: sender?.name || baseShipment.sender_name || 'Shipper',
              address: sender?.address || baseShipment.sender_address || '',
              email: sender?.email || baseShipment.sender_email || '',
              phone: sender?.phone || baseShipment.sender_phone || '',
            },
            receiver: {
              name: receiver?.name || baseShipment.receiver_name || 'Consignee',
              address: receiver?.address || baseShipment.receiver_address || '',
              email: receiver?.email || baseShipment.receiver_email || '',
              phone: receiver?.phone || baseShipment.receiver_phone || '',
            },
            visibility: {
              showProduct: vis?.show_product ?? true,
              showQuantity: vis?.show_quantity ?? true,
              showTransportation: vis?.show_transportation ?? true,
              showDepartureDate: vis?.show_departure_date ?? true,
              showEstimatedDelivery: vis?.show_estimated_delivery ?? true,
              showCarrier: vis?.show_carrier ?? true,
              showWeight: vis?.show_weight ?? true,
              showDimensions: vis?.show_dimensions ?? true,
              showOrigin: vis?.show_origin ?? true,
              showDestination: vis?.show_destination ?? true,
              showSenderName: vis?.show_sender_name ?? true,
              showSenderAddress: vis?.show_sender_address ?? false,
              showSenderEmail: vis?.show_sender_email ?? false,
              showSenderPhone: vis?.show_sender_phone ?? false,
              showReceiverName: vis?.show_receiver_name ?? true,
              showReceiverAddress: vis?.show_receiver_address ?? false,
              showReceiverEmail: vis?.show_receiver_email ?? false,
              showReceiverPhone: vis?.show_receiver_phone ?? false,
            },
            history: (events && events.length > 0)
              ? events.map((ev: any) => ({
                  date: ev.date,
                  time: ev.time,
                  status: ev.status,
                  location: ev.location,
                  description: ev.description,
                }))
              : [
                  {
                    date: details?.departure_date || 'Recent',
                    time: '08:00',
                    status: baseShipment.status || 'Shipment Created',
                    location: details?.origin || 'Origin Facility',
                    description: 'Shipment recorded in logistics database.',
                  },
                ],
          };

          return res.json({
            success: true,
            data: filterForCustomer(fullRecord as any),
          });
        }
      } catch (err) {
        console.warn('[Server] Supabase tracking lookup failed:', err);
      }
    }

    // Exact database lookup fallback
    const matchedRecord = ADMIN_SHIPMENT_DATABASE.find(
      (r) => r.trackingCode.toUpperCase() === normalizedCode
    );

    if (!matchedRecord) {
      return res.status(404).json({
        success: false,
        error: 'NOT_FOUND',
        message: 'Tracking Code Not Found',
        details: "We couldn't find a shipment associated with this tracking code. Please check the code and try again.",
      });
    }

    // Filter strictly through admin-controlled visibility rules
    const sanitizedRecord = filterForCustomer(matchedRecord);

    return res.json({
      success: true,
      data: sanitizedRecord,
    });
  });

  // Support inquiry submission endpoint (for the Contact page)
  app.post('/api/contact', (req, res) => {
    const { name, email, message } = req.body || {};
    if (!name || !email || !message) {
      return res.status(400).json({ success: false, error: 'Missing required fields' });
    }
    // Simulate inquiry logged
    return res.json({ success: true, message: 'Your message has been received. Our team will contact you shortly.' });
  });

  // Vite middleware in dev or static files in prod
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`SwiftShip server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();

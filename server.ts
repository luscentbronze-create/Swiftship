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
  app.get('/api/track/:code', (req, res) => {
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

    // Exact database lookup ONLY
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

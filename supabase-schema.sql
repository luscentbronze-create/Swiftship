-- ============================================================================
-- SWIFTSHIP / CARGO LOGISTICS SUPABASE DATABASE SCHEMA
-- ============================================================================
-- Copy and paste this entire script into your Supabase SQL Editor:
-- Supabase Dashboard -> Project -> SQL Editor -> New query -> Paste & Run.
-- ============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================================
-- 1. ADMIN TABLE (For upcoming Admin Login page)
-- ============================================================================
-- Dedicated table for admin accounts only (no staff, no roles, just admin)
CREATE TABLE IF NOT EXISTS public.admin_users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    auth_user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT, -- Supports direct password authentication or Supabase Auth
    full_name TEXT NOT NULL DEFAULT 'Admin',
    is_active BOOLEAN NOT NULL DEFAULT true,
    last_login_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Fast index for admin lookup by email
CREATE INDEX IF NOT EXISTS idx_admin_users_email ON public.admin_users (LOWER(email));
CREATE INDEX IF NOT EXISTS idx_admin_users_auth_id ON public.admin_users (auth_user_id);

-- ============================================================================
-- 2. SHIPMENTS TABLE (Core tracking identifier & high-level status)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.shipments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tracking_code VARCHAR(11) UNIQUE NOT NULL,
    status VARCHAR(30) NOT NULL DEFAULT 'Shipment Created' 
        CHECK (status IN ('Shipment Created', 'Processing', 'In Transit', 'Out for Delivery', 'Delivered')),
    created_by UUID REFERENCES public.admin_users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    CONSTRAINT chk_tracking_code_format CHECK (tracking_code ~ '^[A-Za-z0-9]{11}$')
);

-- Fast indexes for tracking lookups
CREATE INDEX IF NOT EXISTS idx_shipments_tracking_code_upper ON public.shipments (UPPER(tracking_code));
CREATE INDEX IF NOT EXISTS idx_shipments_status ON public.shipments (status);
CREATE INDEX IF NOT EXISTS idx_shipments_created_at ON public.shipments (created_at DESC);

-- ============================================================================
-- 3. SHIPMENT DETAILS TABLE (Package specs, cargo, transport method)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.shipment_details (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    shipment_id UUID UNIQUE NOT NULL REFERENCES public.shipments(id) ON DELETE CASCADE,
    product TEXT NOT NULL,
    quantity NUMERIC NOT NULL DEFAULT 1,
    transportation_method VARCHAR(20) NOT NULL DEFAULT 'Air' 
        CHECK (transportation_method IN ('Air', 'Ocean', 'Road', 'Express')),
    departure_date TEXT,
    estimated_delivery TEXT,
    carrier TEXT,
    weight TEXT,
    origin TEXT,
    destination TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_shipment_details_shipment_id ON public.shipment_details (shipment_id);

-- ============================================================================
-- 4. SHIPMENT SENDERS TABLE (Origin shipper contact info)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.shipment_senders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    shipment_id UUID UNIQUE NOT NULL REFERENCES public.shipments(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    address TEXT,
    email TEXT,
    phone TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_shipment_senders_shipment_id ON public.shipment_senders (shipment_id);

-- ============================================================================
-- 5. SHIPMENT RECEIVERS TABLE (Consignee contact info)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.shipment_receivers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    shipment_id UUID UNIQUE NOT NULL REFERENCES public.shipments(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    address TEXT,
    email TEXT,
    phone TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_shipment_receivers_shipment_id ON public.shipment_receivers (shipment_id);

-- ============================================================================
-- 6. SHIPMENT VISIBILITIES TABLE (Admin-controlled customer privacy toggles)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.shipment_visibilities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    shipment_id UUID UNIQUE NOT NULL REFERENCES public.shipments(id) ON DELETE CASCADE,
    show_product BOOLEAN NOT NULL DEFAULT true,
    show_quantity BOOLEAN NOT NULL DEFAULT true,
    show_transportation BOOLEAN NOT NULL DEFAULT true,
    show_departure_date BOOLEAN NOT NULL DEFAULT true,
    show_estimated_delivery BOOLEAN NOT NULL DEFAULT true,
    show_carrier BOOLEAN NOT NULL DEFAULT true,
    show_weight BOOLEAN NOT NULL DEFAULT true,
    show_origin BOOLEAN NOT NULL DEFAULT false,
    show_destination BOOLEAN NOT NULL DEFAULT false,
    show_sender_name BOOLEAN NOT NULL DEFAULT true,
    show_sender_address BOOLEAN NOT NULL DEFAULT false,
    show_sender_email BOOLEAN NOT NULL DEFAULT false,
    show_sender_phone BOOLEAN NOT NULL DEFAULT false,
    show_receiver_name BOOLEAN NOT NULL DEFAULT true,
    show_receiver_address BOOLEAN NOT NULL DEFAULT false,
    show_receiver_email BOOLEAN NOT NULL DEFAULT false,
    show_receiver_phone BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_shipment_visibilities_shipment_id ON public.shipment_visibilities (shipment_id);

-- ============================================================================
-- 7. TRACKING EVENTS TABLE (Chronological transit milestones and history)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.tracking_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    shipment_id UUID NOT NULL REFERENCES public.shipments(id) ON DELETE CASCADE,
    status VARCHAR(30) NOT NULL 
        CHECK (status IN ('Shipment Created', 'Processing', 'In Transit', 'Out for Delivery', 'Delivered')),
    date VARCHAR(50) NOT NULL,
    time VARCHAR(50),
    location TEXT NOT NULL,
    description TEXT NOT NULL,
    event_order INTEGER NOT NULL DEFAULT 1,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_tracking_events_shipment_id ON public.tracking_events (shipment_id);
CREATE INDEX IF NOT EXISTS idx_tracking_events_order ON public.tracking_events (shipment_id, event_order DESC);

-- ============================================================================
-- 8. ADMIN AUDIT LOGS TABLE (Tracks admin modifications for security)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.admin_audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    admin_id UUID REFERENCES public.admin_users(id) ON DELETE SET NULL,
    action TEXT NOT NULL,
    shipment_id UUID REFERENCES public.shipments(id) ON DELETE SET NULL,
    details JSONB DEFAULT '{}'::jsonb,
    ip_address TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_admin_audit_logs_created_at ON public.admin_audit_logs (created_at DESC);

-- ============================================================================
-- 9. CONTACT INQUIRIES TABLE (Customer support requests)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.contact_inquiries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    tracking_code TEXT,
    message TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'unread' CHECK (status IN ('unread', 'in_review', 'resolved', 'archived')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_contact_inquiries_created ON public.contact_inquiries (created_at DESC);

-- ============================================================================
-- 10. ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================
-- Enable RLS on all tables
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shipments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shipment_details ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shipment_senders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shipment_receivers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shipment_visibilities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tracking_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_inquiries ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if re-running
DROP POLICY IF EXISTS "Public can view shipments by tracking code" ON public.shipments;
DROP POLICY IF EXISTS "Public can view details of shipments" ON public.shipment_details;
DROP POLICY IF EXISTS "Public can view senders of shipments" ON public.shipment_senders;
DROP POLICY IF EXISTS "Public can view receivers of shipments" ON public.shipment_receivers;
DROP POLICY IF EXISTS "Public can view visibilities of shipments" ON public.shipment_visibilities;
DROP POLICY IF EXISTS "Public can view tracking events" ON public.tracking_events;
DROP POLICY IF EXISTS "Public can insert contact inquiry" ON public.contact_inquiries;
DROP POLICY IF EXISTS "Authenticated admins have full access to shipments" ON public.shipments;
DROP POLICY IF EXISTS "Authenticated admins have full access to details" ON public.shipment_details;
DROP POLICY IF EXISTS "Authenticated admins have full access to senders" ON public.shipment_senders;
DROP POLICY IF EXISTS "Authenticated admins have full access to receivers" ON public.shipment_receivers;
DROP POLICY IF EXISTS "Authenticated admins have full access to visibilities" ON public.shipment_visibilities;
DROP POLICY IF EXISTS "Authenticated admins have full access to events" ON public.tracking_events;
DROP POLICY IF EXISTS "Authenticated admins have full access to admin_users" ON public.admin_users;
DROP POLICY IF EXISTS "Authenticated admins have full access to audit_logs" ON public.admin_audit_logs;
DROP POLICY IF EXISTS "Authenticated admins have full access to inquiries" ON public.contact_inquiries;

-- Public READ policies: anyone can read shipments and related tables for tracking
CREATE POLICY "Public can view shipments by tracking code"
    ON public.shipments FOR SELECT
    TO anon, authenticated
    USING (true);

CREATE POLICY "Public can view details of shipments"
    ON public.shipment_details FOR SELECT
    TO anon, authenticated
    USING (true);

CREATE POLICY "Public can view senders of shipments"
    ON public.shipment_senders FOR SELECT
    TO anon, authenticated
    USING (true);

CREATE POLICY "Public can view receivers of shipments"
    ON public.shipment_receivers FOR SELECT
    TO anon, authenticated
    USING (true);

CREATE POLICY "Public can view visibilities of shipments"
    ON public.shipment_visibilities FOR SELECT
    TO anon, authenticated
    USING (true);

CREATE POLICY "Public can view tracking events"
    ON public.tracking_events FOR SELECT
    TO anon, authenticated
    USING (true);

CREATE POLICY "Public can insert contact inquiry"
    ON public.contact_inquiries FOR INSERT
    TO anon, authenticated
    WITH CHECK (true);

-- Authenticated Admin Policies: authenticated users can perform all CRUD operations
CREATE POLICY "Authenticated admins have full access to shipments"
    ON public.shipments FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Authenticated admins have full access to details"
    ON public.shipment_details FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Authenticated admins have full access to senders"
    ON public.shipment_senders FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Authenticated admins have full access to receivers"
    ON public.shipment_receivers FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Authenticated admins have full access to visibilities"
    ON public.shipment_visibilities FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Authenticated admins have full access to events"
    ON public.tracking_events FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Authenticated admins have full access to admin_users"
    ON public.admin_users FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Authenticated admins have full access to audit_logs"
    ON public.admin_audit_logs FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Authenticated admins have full access to inquiries"
    ON public.contact_inquiries FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- ============================================================================
-- 11. SECURE DATABASE RPC FUNCTION (Server-side Customer Privacy Enforcement)
-- ============================================================================
-- Returns strictly filtered customer view based on shipment_visibilities table
CREATE OR REPLACE FUNCTION public.get_public_shipment_tracking(p_tracking_code TEXT)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_shipment RECORD;
    v_details RECORD;
    v_sender RECORD;
    v_receiver RECORD;
    v_vis RECORD;
    v_history JSONB;
    v_result JSONB;
BEGIN
    -- Normalized uppercase tracking lookup
    SELECT * INTO v_shipment 
    FROM public.shipments 
    WHERE UPPER(tracking_code) = UPPER(TRIM(p_tracking_code))
    LIMIT 1;

    IF NOT FOUND THEN
        RETURN NULL;
    END IF;

    SELECT * INTO v_details FROM public.shipment_details WHERE shipment_id = v_shipment.id;
    SELECT * INTO v_sender FROM public.shipment_senders WHERE shipment_id = v_shipment.id;
    SELECT * INTO v_receiver FROM public.shipment_receivers WHERE shipment_id = v_shipment.id;
    SELECT * INTO v_vis FROM public.shipment_visibilities WHERE shipment_id = v_shipment.id;

    -- Aggregate history in chronological/order sequence
    SELECT COALESCE(
        jsonb_agg(
            jsonb_build_object(
                'date', te.date,
                'time', te.time,
                'status', te.status,
                'location', te.location,
                'description', te.description
            ) ORDER BY te.event_order DESC
        ),
        '[]'::jsonb
    ) INTO v_history
    FROM public.tracking_events te
    WHERE te.shipment_id = v_shipment.id;

    -- Build privacy-filtered customer response
    v_result := jsonb_build_object(
        'trackingCode', v_shipment.tracking_code,
        'status', v_shipment.status,
        'details', jsonb_strip_nulls(jsonb_build_object(
            'product', CASE WHEN COALESCE(v_vis.show_product, true) THEN v_details.product ELSE NULL END,
            'quantity', CASE WHEN COALESCE(v_vis.show_quantity, true) THEN v_details.quantity ELSE NULL END,
            'transportationMethod', CASE WHEN COALESCE(v_vis.show_transportation, true) THEN v_details.transportation_method ELSE NULL END,
            'departureDate', CASE WHEN COALESCE(v_vis.show_departure_date, true) THEN v_details.departure_date ELSE NULL END,
            'estimatedDelivery', CASE WHEN COALESCE(v_vis.show_estimated_delivery, true) THEN v_details.estimated_delivery ELSE NULL END,
            'carrier', CASE WHEN COALESCE(v_vis.show_carrier, true) THEN v_details.carrier ELSE NULL END,
            'weight', CASE WHEN COALESCE(v_vis.show_weight, true) THEN v_details.weight ELSE NULL END,
            'origin', CASE WHEN COALESCE(v_vis.show_origin, false) THEN v_details.origin ELSE NULL END,
            'destination', CASE WHEN COALESCE(v_vis.show_destination, false) THEN v_details.destination ELSE NULL END
        )),
        'sender', jsonb_strip_nulls(jsonb_build_object(
            'name', CASE WHEN COALESCE(v_vis.show_sender_name, true) THEN v_sender.name ELSE NULL END,
            'address', CASE WHEN COALESCE(v_vis.show_sender_address, false) THEN v_sender.address ELSE NULL END,
            'email', CASE WHEN COALESCE(v_vis.show_sender_email, false) THEN v_sender.email ELSE NULL END,
            'phone', CASE WHEN COALESCE(v_vis.show_sender_phone, false) THEN v_sender.phone ELSE NULL END,
            'hasHiddenFields', (NOT COALESCE(v_vis.show_sender_address, false) OR NOT COALESCE(v_vis.show_sender_email, false) OR NOT COALESCE(v_vis.show_sender_phone, false))
        )),
        'receiver', jsonb_strip_nulls(jsonb_build_object(
            'name', CASE WHEN COALESCE(v_vis.show_receiver_name, true) THEN v_receiver.name ELSE NULL END,
            'address', CASE WHEN COALESCE(v_vis.show_receiver_address, false) THEN v_receiver.address ELSE NULL END,
            'email', CASE WHEN COALESCE(v_vis.show_receiver_email, false) THEN v_receiver.email ELSE NULL END,
            'phone', CASE WHEN COALESCE(v_vis.show_receiver_phone, false) THEN v_receiver.phone ELSE NULL END,
            'hasHiddenFields', (NOT COALESCE(v_vis.show_receiver_address, false) OR NOT COALESCE(v_vis.show_receiver_email, false) OR NOT COALESCE(v_vis.show_receiver_phone, false))
        )),
        'history', v_history
    );

    RETURN v_result;
END;
$$;

-- Grant execution to anonymous and authenticated users
GRANT EXECUTE ON FUNCTION public.get_public_shipment_tracking(TEXT) TO anon, authenticated;

-- ============================================================================
-- 12. INITIAL SEED DATA
-- ============================================================================
-- Inserts the 4 standard shipments with complete details, visibility, and tracking events

DO $$
DECLARE
    v_s1_id UUID := gen_random_uuid();
    v_s2_id UUID := gen_random_uuid();
    v_s3_id UUID := gen_random_uuid();
    v_s4_id UUID := gen_random_uuid();
BEGIN
    -- -------------------------------------------------------------
    -- Initial Admin Users (A couple of primary admin accounts)
    -- -------------------------------------------------------------
    INSERT INTO public.admin_users (email, full_name, is_active)
    VALUES 
        ('admin@swiftship.com', 'Primary Admin', true),
        ('operations@swiftship.com', 'Secondary Admin', true)
    ON CONFLICT (email) DO NOTHING;

    -- -------------------------------------------------------------
    -- Shipment 1: TRK7A92X4B1 (Laptop - In Transit)
    -- -------------------------------------------------------------
    INSERT INTO public.shipments (id, tracking_code, status, created_at)
    VALUES (v_s1_id, 'TRK7A92X4B1', 'In Transit', '2026-09-10T08:30:00Z')
    ON CONFLICT (tracking_code) DO NOTHING;

    INSERT INTO public.shipment_details (shipment_id, product, quantity, transportation_method, departure_date, estimated_delivery, carrier, weight, origin, destination)
    VALUES (v_s1_id, 'Laptop', 1, 'Air', 'Sep 10, 2026', 'Sep 20, 2026', 'SwiftAir Express', '2.4 kg', 'San Jose, CA, USA', 'London, United Kingdom')
    ON CONFLICT (shipment_id) DO NOTHING;

    INSERT INTO public.shipment_senders (shipment_id, name, address, email, phone)
    VALUES (v_s1_id, 'TechWorld Ltd.', '742 Evergreen Terrace, Silicon Valley, CA 94016', 'logistics@techworld.io', '+1 (555) 492-8812')
    ON CONFLICT (shipment_id) DO NOTHING;

    INSERT INTO public.shipment_receivers (shipment_id, name, address, email, phone)
    VALUES (v_s1_id, 'John Smith', '14 Kensington Gardens, London W8 4PX', 'john.smith.orders@email.co.uk', '+44 20 7946 0912')
    ON CONFLICT (shipment_id) DO NOTHING;

    INSERT INTO public.shipment_visibilities (
        shipment_id, show_product, show_quantity, show_transportation, show_departure_date,
        show_estimated_delivery, show_carrier, show_weight, show_origin, show_destination,
        show_sender_name, show_sender_address, show_sender_email, show_sender_phone,
        show_receiver_name, show_receiver_address, show_receiver_email, show_receiver_phone
    ) VALUES (
        v_s1_id, true, true, true, true,
        true, true, true, false, false,
        true, false, false, false,
        true, false, false, false
    ) ON CONFLICT (shipment_id) DO NOTHING;

    INSERT INTO public.tracking_events (shipment_id, status, date, time, location, description, event_order) VALUES
    (v_s1_id, 'In Transit', 'Sep 12, 2026', '14:20 GMT', 'Heathrow International Transit Hub', 'Package arrived at sorting facility and cleared customs inspection.', 3),
    (v_s1_id, 'Processing', 'Sep 11, 2026', '09:45 GMT', 'JFK Air Freight Operations Center', 'Consolidated into international air container and departed on flight SW-802.', 2),
    (v_s1_id, 'Shipment Created', 'Sep 10, 2026', '11:15 GMT', 'San Jose Logistics Hub', 'Electronic shipping data received. Cargo prepared for dispatch.', 1);

    -- -------------------------------------------------------------
    -- Shipment 2: 8F2K91M7Q4Z (Medical Diagnostic Kit - Out for Delivery)
    -- -------------------------------------------------------------
    INSERT INTO public.shipments (id, tracking_code, status, created_at)
    VALUES (v_s2_id, '8F2K91M7Q4Z', 'Out for Delivery', '2026-09-14T06:00:00Z')
    ON CONFLICT (tracking_code) DO NOTHING;

    INSERT INTO public.shipment_details (shipment_id, product, quantity, transportation_method, departure_date, estimated_delivery, carrier, weight, origin, destination)
    VALUES (v_s2_id, 'Medical Diagnostic Kit', 4, 'Express', 'Sep 14, 2026', 'Sep 18, 2026', 'SwiftPriority Courier', '5.8 kg', 'Boston, MA, USA', 'Chicago, IL, USA')
    ON CONFLICT (shipment_id) DO NOTHING;

    INSERT INTO public.shipment_senders (shipment_id, name, address, email, phone)
    VALUES (v_s2_id, 'BioHealth Logistics Inc.', '100 Innovation Way, Boston, MA 02115', 'dispatch@biohealth.org', '+1 (555) 781-9923')
    ON CONFLICT (shipment_id) DO NOTHING;

    INSERT INTO public.shipment_receivers (shipment_id, name, address, email, phone)
    VALUES (v_s2_id, 'Apex Clinical Center', '450 Michigan Ave, Suite 400, Chicago, IL 60611', 'receiving@apexclinical.org', '+1 (555) 312-8800')
    ON CONFLICT (shipment_id) DO NOTHING;

    INSERT INTO public.shipment_visibilities (
        shipment_id, show_product, show_quantity, show_transportation, show_departure_date,
        show_estimated_delivery, show_carrier, show_weight, show_origin, show_destination,
        show_sender_name, show_sender_address, show_sender_email, show_sender_phone,
        show_receiver_name, show_receiver_address, show_receiver_email, show_receiver_phone
    ) VALUES (
        v_s2_id, true, true, true, true,
        true, true, true, false, false,
        true, false, false, false,
        true, false, false, false
    ) ON CONFLICT (shipment_id) DO NOTHING;

    INSERT INTO public.tracking_events (shipment_id, status, date, time, location, description, event_order) VALUES
    (v_s2_id, 'Out for Delivery', 'Sep 18, 2026', '07:30 GMT', 'Downtown Chicago Courier Depot', 'Package loaded onto local electric delivery van for morning delivery.', 4),
    (v_s2_id, 'In Transit', 'Sep 17, 2026', '21:10 GMT', 'Chicago Central Distribution Center', 'Sorted and transferred to final destination terminal.', 3),
    (v_s2_id, 'Processing', 'Sep 15, 2026', '13:00 GMT', 'Northeast Regional Gateway', 'Express ground manifest processed and verified.', 2),
    (v_s2_id, 'Shipment Created', 'Sep 14, 2026', '08:45 GMT', 'Boston Express Terminal', 'Booking confirmed and high-priority tracking label affixed.', 1);

    -- -------------------------------------------------------------
    -- Shipment 3: 9C4H82X1P7M (High-End Server Rack - Delivered)
    -- -------------------------------------------------------------
    INSERT INTO public.shipments (id, tracking_code, status, created_at)
    VALUES (v_s3_id, '9C4H82X1P7M', 'Delivered', '2026-09-01T09:00:00Z')
    ON CONFLICT (tracking_code) DO NOTHING;

    INSERT INTO public.shipment_details (shipment_id, product, quantity, transportation_method, departure_date, estimated_delivery, carrier, weight, origin, destination)
    VALUES (v_s3_id, 'High-End Server Rack', 2, 'Road', 'Sep 01, 2026', 'Sep 08, 2026', 'SwiftHeavy Freight', '180.0 kg', 'Austin, TX, USA', 'Dallas, TX, USA')
    ON CONFLICT (shipment_id) DO NOTHING;

    INSERT INTO public.shipment_senders (shipment_id, name, address, email, phone)
    VALUES (v_s3_id, 'CloudCore Systems', '250 Silicon Hills Blvd, Austin, TX 78701', 'hardware@cloudcore.net', '+1 (555) 512-4411')
    ON CONFLICT (shipment_id) DO NOTHING;

    INSERT INTO public.shipment_receivers (shipment_id, name, address, email, phone)
    VALUES (v_s3_id, 'Horizon Data Hub', '880 Telecom Pkwy, Richardson, TX 75080', 'facilities@horizondata.com', '+1 (555) 214-9988')
    ON CONFLICT (shipment_id) DO NOTHING;

    INSERT INTO public.shipment_visibilities (
        shipment_id, show_product, show_quantity, show_transportation, show_departure_date,
        show_estimated_delivery, show_carrier, show_weight, show_origin, show_destination,
        show_sender_name, show_sender_address, show_sender_email, show_sender_phone,
        show_receiver_name, show_receiver_address, show_receiver_email, show_receiver_phone
    ) VALUES (
        v_s3_id, true, true, true, true,
        true, true, true, false, false,
        true, false, false, false,
        true, false, false, false
    ) ON CONFLICT (shipment_id) DO NOTHING;

    INSERT INTO public.tracking_events (shipment_id, status, date, time, location, description, event_order) VALUES
    (v_s3_id, 'Delivered', 'Sep 08, 2026', '11:42 GMT', 'Richardson Commercial Loading Bay 4', 'Successfully received and signed for by Facility Dock Manager M. Davis.', 5),
    (v_s3_id, 'Out for Delivery', 'Sep 08, 2026', '06:15 GMT', 'Dallas North Logistics Station', 'Loaded on dedicated hydraulic liftgate truck for delivery.', 4),
    (v_s3_id, 'In Transit', 'Sep 05, 2026', '18:30 GMT', 'Central Texas Interstate Hub', 'Direct freight convoy en route to Dallas regional depot.', 3),
    (v_s3_id, 'Processing', 'Sep 02, 2026', '14:00 GMT', 'Austin Freight Terminal', 'Palletized and secured with shock and tilt sensor tags.', 2),
    (v_s3_id, 'Shipment Created', 'Sep 01, 2026', '10:00 GMT', 'Austin Freight Terminal', 'Bill of Lading issued and dispatch scheduled.', 1);

    -- -------------------------------------------------------------
    -- Shipment 4: 3B8R55K2W9T (Solar Inverters & Batteries - Processing)
    -- -------------------------------------------------------------
    INSERT INTO public.shipments (id, tracking_code, status, created_at)
    VALUES (v_s4_id, '3B8R55K2W9T', 'Processing', '2026-09-17T11:00:00Z')
    ON CONFLICT (tracking_code) DO NOTHING;

    INSERT INTO public.shipment_details (shipment_id, product, quantity, transportation_method, departure_date, estimated_delivery, carrier, weight, origin, destination)
    VALUES (v_s4_id, 'Solar Inverters & Batteries', 12, 'Ocean', 'Sep 17, 2026', 'Oct 05, 2026', 'SwiftOcean Maritime', '450.0 kg', 'Rotterdam Port, Netherlands', 'Port of Douala, Cameroon')
    ON CONFLICT (shipment_id) DO NOTHING;

    INSERT INTO public.shipment_senders (shipment_id, name, address, email, phone)
    VALUES (v_s4_id, 'Solaria Global BV', 'Havenkwartier 45, Rotterdam, Netherlands', 'export@solariaglobal.nl', '+31 10 555 4321')
    ON CONFLICT (shipment_id) DO NOTHING;

    INSERT INTO public.shipment_receivers (shipment_id, name, address, email, phone)
    VALUES (v_s4_id, 'GreenGrid Energy Cameroon', 'Zone Industrielle Bassa, Douala, Cameroon', 'procurement@greengrid.cm', '+237 233 42 11 00')
    ON CONFLICT (shipment_id) DO NOTHING;

    INSERT INTO public.shipment_visibilities (
        shipment_id, show_product, show_quantity, show_transportation, show_departure_date,
        show_estimated_delivery, show_carrier, show_weight, show_origin, show_destination,
        show_sender_name, show_sender_address, show_sender_email, show_sender_phone,
        show_receiver_name, show_receiver_address, show_receiver_email, show_receiver_phone
    ) VALUES (
        v_s4_id, true, true, true, true,
        true, true, true, false, false,
        true, false, false, false,
        true, false, false, false
    ) ON CONFLICT (shipment_id) DO NOTHING;

    INSERT INTO public.tracking_events (shipment_id, status, date, time, location, description, event_order) VALUES
    (v_s4_id, 'Processing', 'Sep 18, 2026', '04:10 GMT', 'Port of Rotterdam Container Terminal Maasvlakte', 'Container sealed and verified. Awaiting vessel loading onto MV Pacific Voyager.', 2),
    (v_s4_id, 'Shipment Created', 'Sep 17, 2026', '14:25 GMT', 'Rotterdam European Depot', 'Export customs documentation and maritime manifest lodged.', 1);

END $$;

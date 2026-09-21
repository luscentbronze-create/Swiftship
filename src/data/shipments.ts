import { ShipmentRecord, CustomerShipmentView } from '../types.ts';

export const ADMIN_SHIPMENT_DATABASE: ShipmentRecord[] = [
  {
    trackingCode: 'TRK7A92X4B1',
    status: 'In Transit',
    createdAt: '2026-09-10T08:30:00Z',
    details: {
      product: 'Laptop',
      quantity: 1,
      transportationMethod: 'Air',
      departureDate: 'Sep 10, 2026',
      estimatedDelivery: 'Sep 20, 2026',
      carrier: 'TraceCargo Air Express',
      weight: '2.4 kg',
      origin: 'San Jose, CA, USA',
      destination: 'London, United Kingdom',
    },
    sender: {
      name: 'TechWorld Ltd.',
      address: '742 Evergreen Terrace, Silicon Valley, CA 94016',
      email: 'logistics@techworld.io',
      phone: '+1 (555) 492-8812',
    },
    receiver: {
      name: 'John Smith',
      address: '14 Kensington Gardens, London W8 4PX',
      email: 'john.smith.orders@email.co.uk',
      phone: '+44 20 7946 0912',
    },
    visibility: {
      showProduct: true,
      showQuantity: true,
      showTransportation: true,
      showDepartureDate: true,
      showEstimatedDelivery: true,
      showCarrier: true,
      showWeight: true,
      showOrigin: false, // Admin hid origin address
      showDestination: false, // Admin hid full destination address
      showSenderName: true,
      showSenderAddress: false, // Admin hid address for privacy
      showSenderEmail: false, // Admin hid email
      showSenderPhone: false, // Admin hid phone
      showReceiverName: true,
      showReceiverAddress: false, // Admin hid address
      showReceiverEmail: false, // Admin hid email
      showReceiverPhone: false, // Admin hid phone
    },
    history: [
      {
        date: 'Sep 12, 2026',
        time: '14:20 GMT',
        status: 'In Transit',
        location: 'Heathrow International Transit Hub',
        description: 'Package arrived at sorting facility and cleared customs inspection.',
      },
      {
        date: 'Sep 11, 2026',
        time: '09:45 GMT',
        status: 'Processing',
        location: 'JFK Air Freight Operations Center',
        description: 'Consolidated into international air container and departed on flight SW-802.',
      },
      {
        date: 'Sep 10, 2026',
        time: '11:15 GMT',
        status: 'Shipment Created',
        location: 'San Jose Logistics Hub',
        description: 'Electronic shipping data received. Cargo prepared for dispatch.',
      },
    ],
  },
  {
    trackingCode: '8F2K91M7Q4Z',
    status: 'Out for Delivery',
    createdAt: '2026-09-14T06:00:00Z',
    details: {
      product: 'Medical Diagnostic Kit',
      quantity: 4,
      transportationMethod: 'Express',
      departureDate: 'Sep 14, 2026',
      estimatedDelivery: 'Sep 18, 2026',
      carrier: 'TraceCargo Priority Courier',
      weight: '5.8 kg',
      origin: 'Boston, MA, USA',
      destination: 'Chicago, IL, USA',
    },
    sender: {
      name: 'BioHealth Logistics Inc.',
      address: '100 Innovation Way, Boston, MA 02115',
      email: 'dispatch@biohealth.org',
      phone: '+1 (555) 781-9923',
    },
    receiver: {
      name: 'Apex Clinical Center',
      address: '450 Michigan Ave, Suite 400, Chicago, IL 60611',
      email: 'receiving@apexclinical.org',
      phone: '+1 (555) 312-8800',
    },
    visibility: {
      showProduct: true,
      showQuantity: true,
      showTransportation: true,
      showDepartureDate: true,
      showEstimatedDelivery: true,
      showCarrier: true,
      showWeight: true,
      showOrigin: false,
      showDestination: false,
      showSenderName: true,
      showSenderAddress: false,
      showSenderEmail: false,
      showSenderPhone: false,
      showReceiverName: true,
      showReceiverAddress: false,
      showReceiverEmail: false,
      showReceiverPhone: false,
    },
    history: [
      {
        date: 'Sep 18, 2026',
        time: '07:30 GMT',
        status: 'Out for Delivery',
        location: 'Downtown Chicago Courier Depot',
        description: 'Package loaded onto local electric delivery van for morning delivery.',
      },
      {
        date: 'Sep 17, 2026',
        time: '21:10 GMT',
        status: 'In Transit',
        location: 'Chicago Central Distribution Center',
        description: 'Sorted and transferred to final destination terminal.',
      },
      {
        date: 'Sep 15, 2026',
        time: '13:00 GMT',
        status: 'Processing',
        location: 'Northeast Regional Gateway',
        description: 'Express ground manifest processed and verified.',
      },
      {
        date: 'Sep 14, 2026',
        time: '08:45 GMT',
        status: 'Shipment Created',
        location: 'Boston Express Terminal',
        description: 'Booking confirmed and high-priority tracking label affixed.',
      },
    ],
  },
  {
    trackingCode: '9C4H82X1P7M',
    status: 'Delivered',
    createdAt: '2026-09-01T09:00:00Z',
    details: {
      product: 'High-End Server Rack',
      quantity: 2,
      transportationMethod: 'Road',
      departureDate: 'Sep 01, 2026',
      estimatedDelivery: 'Sep 08, 2026',
      carrier: 'TraceCargo Heavy Freight',
      weight: '180.0 kg',
      origin: 'Austin, TX, USA',
      destination: 'Dallas, TX, USA',
    },
    sender: {
      name: 'CloudCore Systems',
      address: '250 Silicon Hills Blvd, Austin, TX 78701',
      email: 'hardware@cloudcore.net',
      phone: '+1 (555) 512-4411',
    },
    receiver: {
      name: 'Horizon Data Hub',
      address: '880 Telecom Pkwy, Richardson, TX 75080',
      email: 'facilities@horizondata.com',
      phone: '+1 (555) 214-9988',
    },
    visibility: {
      showProduct: true,
      showQuantity: true,
      showTransportation: true,
      showDepartureDate: true,
      showEstimatedDelivery: true,
      showCarrier: true,
      showWeight: true,
      showOrigin: false,
      showDestination: false,
      showSenderName: true,
      showSenderAddress: false,
      showSenderEmail: false,
      showSenderPhone: false,
      showReceiverName: true,
      showReceiverAddress: false,
      showReceiverEmail: false,
      showReceiverPhone: false,
    },
    history: [
      {
        date: 'Sep 08, 2026',
        time: '11:42 GMT',
        status: 'Delivered',
        location: 'Richardson Commercial Loading Bay 4',
        description: 'Successfully received and signed for by Facility Dock Manager M. Davis.',
      },
      {
        date: 'Sep 08, 2026',
        time: '06:15 GMT',
        status: 'Out for Delivery',
        location: 'Dallas North Logistics Station',
        description: 'Loaded on dedicated hydraulic liftgate truck for delivery.',
      },
      {
        date: 'Sep 05, 2026',
        time: '18:30 GMT',
        status: 'In Transit',
        location: 'Central Texas Interstate Hub',
        description: 'Direct freight convoy en route to Dallas regional depot.',
      },
      {
        date: 'Sep 02, 2026',
        time: '14:00 GMT',
        status: 'Processing',
        location: 'Austin Freight Terminal',
        description: 'Palletized and secured with shock and tilt sensor tags.',
      },
      {
        date: 'Sep 01, 2026',
        time: '10:00 GMT',
        status: 'Shipment Created',
        location: 'Austin Freight Terminal',
        description: 'Bill of Lading issued and dispatch scheduled.',
      },
    ],
  },
  {
    trackingCode: '3B8R55K2W9T',
    status: 'Processing',
    createdAt: '2026-09-17T11:00:00Z',
    details: {
      product: 'Solar Inverters & Batteries',
      quantity: 12,
      transportationMethod: 'Ocean',
      departureDate: 'Sep 17, 2026',
      estimatedDelivery: 'Oct 05, 2026',
      carrier: 'TraceCargo Ocean Maritime',
      weight: '450.0 kg',
      origin: 'Rotterdam Port, Netherlands',
      destination: 'Port of Douala, Cameroon',
    },
    sender: {
      name: 'Solaria Global BV',
      address: 'Havenkwartier 45, Rotterdam, Netherlands',
      email: 'export@solariaglobal.nl',
      phone: '+31 10 555 4321',
    },
    receiver: {
      name: 'GreenGrid Energy Cameroon',
      address: 'Zone Industrielle Bassa, Douala, Cameroon',
      email: 'procurement@greengrid.cm',
      phone: '+237 233 42 11 00',
    },
    visibility: {
      showProduct: true,
      showQuantity: true,
      showTransportation: true,
      showDepartureDate: true,
      showEstimatedDelivery: true,
      showCarrier: true,
      showWeight: true,
      showOrigin: false,
      showDestination: false,
      showSenderName: true,
      showSenderAddress: false,
      showSenderEmail: false,
      showSenderPhone: false,
      showReceiverName: true,
      showReceiverAddress: false,
      showReceiverEmail: false,
      showReceiverPhone: false,
    },
    history: [
      {
        date: 'Sep 18, 2026',
        time: '04:10 GMT',
        status: 'Processing',
        location: 'Port of Rotterdam Container Terminal Maasvlakte',
        description: 'Container sealed and verified. Awaiting vessel loading onto MV Pacific Voyager.',
      },
      {
        date: 'Sep 17, 2026',
        time: '14:25 GMT',
        status: 'Shipment Created',
        location: 'Rotterdam European Depot',
        description: 'Export customs documentation and maritime manifest lodged.',
      },
    ],
  },
];

/**
 * Filter shipment record strictly respecting admin-controlled visibility settings.
 * Customers NEVER see unapproved or private fields.
 */
export function filterForCustomer(record: ShipmentRecord): CustomerShipmentView {
  const vis = record.visibility;
  
  const details: CustomerShipmentView['details'] = {};
  if (vis.showProduct) details.product = record.details.product;
  if (vis.showQuantity) details.quantity = record.details.quantity;
  if (vis.showTransportation) details.transportationMethod = record.details.transportationMethod;
  if (vis.showDepartureDate) details.departureDate = record.details.departureDate;
  if (vis.showEstimatedDelivery) details.estimatedDelivery = record.details.estimatedDelivery;
  if (vis.showCarrier) details.carrier = record.details.carrier;
  if (vis.showWeight) details.weight = record.details.weight;
  if (vis.showOrigin) details.origin = record.details.origin;
  if (vis.showDestination) details.destination = record.details.destination;

  const sender: CustomerShipmentView['sender'] = {};
  if (vis.showSenderName) sender.name = record.sender.name;
  if (vis.showSenderAddress) sender.address = record.sender.address;
  if (vis.showSenderEmail) sender.email = record.sender.email;
  if (vis.showSenderPhone) sender.phone = record.sender.phone;
  sender.hasHiddenFields = !vis.showSenderAddress || !vis.showSenderEmail || !vis.showSenderPhone;

  const receiver: CustomerShipmentView['receiver'] = {};
  if (vis.showReceiverName) receiver.name = record.receiver.name;
  if (vis.showReceiverAddress) receiver.address = record.receiver.address;
  if (vis.showReceiverEmail) receiver.email = record.receiver.email;
  if (vis.showReceiverPhone) receiver.phone = record.receiver.phone;
  receiver.hasHiddenFields = !vis.showReceiverAddress || !vis.showReceiverEmail || !vis.showReceiverPhone;

  return {
    trackingCode: record.trackingCode,
    status: record.status,
    details,
    sender,
    receiver,
    // Only display chronological events actually stored in the record
    history: [...record.history],
  };
}

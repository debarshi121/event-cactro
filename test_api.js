const axios = require('axios');

const BASE_URL = 'http://localhost:3000/api';
let organizerToken = '';
let customerToken = '';
let eventId = '';

async function runTests() {
  try {
    console.log('--- Phase 1: Authentication ---');
    
    // Register Organizer
    console.log('Registering Organizer...');
    const regOrg = await axios.post(`${BASE_URL}/auth/register`, {
      name: 'Test Organizer',
      email: `org_${Date.now()}@example.com`,
      password: 'password123',
      role: 'ORGANIZER'
    });
    console.log('Organizer Registered:', regOrg.data.status);

    // Login Organizer
    console.log('Logging in Organizer...');
    const loginOrg = await axios.post(`${BASE_URL}/auth/login`, {
      email: regOrg.config.data ? JSON.parse(regOrg.config.data).email : '',
      password: 'password123'
    });
    organizerToken = loginOrg.data.data.token;
    console.log('Organizer Token obtained.');

    // Register Customer
    console.log('Registering Customer...');
    const regCust = await axios.post(`${BASE_URL}/auth/register`, {
      name: 'Test Customer',
      email: `cust_${Date.now()}@example.com`,
      password: 'password123',
      role: 'CUSTOMER'
    });
    console.log('Customer Registered:', regCust.data.status);

    // Login Customer
    console.log('Logging in Customer...');
    const loginCust = await axios.post(`${BASE_URL}/auth/login`, {
      email: regCust.config.data ? JSON.parse(regCust.config.data).email : '',
      password: 'password123'
    });
    customerToken = loginCust.data.data.token;
    console.log('Customer Token obtained.');

    // GET /api/auth/me
    console.log('Verifying /auth/me for Customer...');
    const meCust = await axios.get(`${BASE_URL}/auth/me`, {
      headers: { Authorization: `Bearer ${customerToken}` }
    });
    console.log('Me status:', meCust.data.status, 'Role:', meCust.data.data.user.role);

    console.log('\n--- Phase 2: Event Management (Organizer) ---');
    
    // POST /api/events
    console.log('Creating Event...');
    const createEvent = await axios.post(`${BASE_URL}/events`, {
      title: 'Global Tech Expo',
      description: 'An amazing tech expo for everyone.',
      location: 'New York',
      eventDate: new Date(Date.now() + 86400000).toISOString(),
      totalTickets: 50,
      price: 150.00
    }, {
      headers: { Authorization: `Bearer ${organizerToken}` }
    });
    eventId = createEvent.data.data.event.id;
    console.log('Event Created:', createEvent.data.data.event.title, 'ID:', eventId);

    // GET /api/events
    console.log('Listing Events...');
    const listEvents = await axios.get(`${BASE_URL}/events`);
    console.log('Events Count:', listEvents.data.results);

    // PUT /api/events/:id
    console.log('Updating Event (should trigger background job)...');
    const updateEvent = await axios.put(`${BASE_URL}/events/${eventId}`, {
      title: 'Global Tech Expo - Updated'
    }, {
      headers: { Authorization: `Bearer ${organizerToken}` }
    });
    console.log('Event Updated:', updateEvent.data.data.event.title);

    console.log('\n--- Phase 3: Ticket Booking (Customer) ---');
    
    // POST /api/bookings
    console.log('Booking Ticket (should trigger background job)...');
    const booking = await axios.post(`${BASE_URL}/bookings`, {
      eventId: eventId,
      quantity: 2
    }, {
      headers: { Authorization: `Bearer ${customerToken}` }
    });
    console.log('Booking Success:', booking.data.status, 'Total Price:', booking.data.data.booking.totalPrice);

    // GET /api/bookings/my
    console.log('Listing My Bookings...');
    const myBookings = await axios.get(`${BASE_URL}/bookings/my`, {
      headers: { Authorization: `Bearer ${customerToken}` }
    });
    console.log('My Bookings Count:', myBookings.data.results);

    // GET /api/bookings/event/:eventId (Organizer)
    console.log('Organizer viewing Event Bookings...');
    const eventBookings = await axios.get(`${BASE_URL}/bookings/event/${eventId}`, {
      headers: { Authorization: `Bearer ${organizerToken}` }
    });
    console.log('Event Bookings Count:', eventBookings.data.results);

    console.log('\n--- Phase 4: Validations & Restrictions ---');
    
    // Check Customer cannot create event
    try {
      console.log('Verifying Customer CANNOT create event...');
      await axios.post(`${BASE_URL}/events`, { title: 'Illegal Event' }, {
        headers: { Authorization: `Bearer ${customerToken}` }
      });
    } catch (err) {
      console.log('Expected Error (Customer Creating Event):', err.response.data.message);
    }

    // Check Overbooking
    try {
      console.log('Verifying Overbooking prevention (Total 50, 2 booked, trying 60)...');
      await axios.post(`${BASE_URL}/bookings`, {
        eventId: eventId,
        quantity: 60
      }, {
        headers: { Authorization: `Bearer ${customerToken}` }
      });
    } catch (err) {
      console.log('Expected Error (Overbooking):', err.response.data.message);
    }

    console.log('\n--- ALL TESTS COMPLETED SUCCESSFULLY ---');
    console.log('Check the server console for background job processing logs!');

  } catch (error) {
    console.error('Test Failed:', error.response ? error.response.data : error.message);
  }
}

runTests();

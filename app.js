// LocalStorage state keys
const EVENTS_KEY = 'let_events';
const TICKETS_KEY = 'let_tickets';
const PAYMENTS_KEY = 'let_payments';
const AUTH_KEY = 'let_auth';

// Default Seed Data
const DEFAULT_EVENTS = [
    {
        id: 1,
        title: 'Tech Innovators Summit 2026',
        description: 'Join leading engineers, product visionaries, and AI researchers to discuss the next decade of technology. Featuring keynotes on agentic workflows, quantum computing, and decentralized web architectures.',
        venue: 'San Francisco Innovation Center',
        start_time: '2026-09-15 09:00:00',
        image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&auto=format&fit=crop&q=60'
    },
    {
        id: 2,
        title: 'Global Beats Music Festival',
        description: 'An immersive three-day outdoor music festival celebrating global rhythms, digital soundscapes, and interactive light installations. Enjoy acts from top international artists and local talent.',
        venue: 'Oakridge Amphitheatre, Austin',
        start_time: '2026-10-02 14:00:00',
        image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&auto=format&fit=crop&q=60'
    },
    {
        id: 3,
        title: 'Silicon Valley Pitch Night',
        description: 'Watch ten fast-growing startups pitch their products live to a panel of top-tier venture capitalists. A prime networking opportunity for founders, investors, and developers alike.',
        venue: 'Hacker Haven Co-working Space, Palo Alto',
        start_time: '2026-11-12 18:30:00',
        image: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=800&auto=format&fit=crop&q=60'
    }
];

const DEFAULT_TICKETS = [
    // Event 1 Tickets
    { id: 1, event_id: 1, title: 'General Admission', price: 99.00, amount: 200, sold: 42 },
    { id: 2, event_id: 1, title: 'VIP Delegate Pass', price: 299.00, amount: 50, sold: 18 },
    { id: 3, event_id: 1, title: 'Student Pass', price: 49.00, amount: 100, sold: 25 },
    // Event 2 Tickets
    { id: 4, event_id: 2, title: '3-Day General Pass', price: 149.00, amount: 500, sold: 150 },
    { id: 5, event_id: 2, title: 'VIP Backstage Access', price: 399.00, amount: 75, sold: 30 },
    // Event 3 Tickets
    { id: 6, event_id: 3, title: 'General Attendance', price: 25.00, amount: 150, sold: 85 },
    { id: 7, event_id: 3, title: 'Startup Pitch Registration', price: 100.00, amount: 10, sold: 8 }
];

const DEFAULT_PAYMENTS = [
    { id: 1, event_id: 1, email: 'john@example.com', amount: 198.00, ticket_summary: '2x General Admission', created_at: '2026-06-20 10:14:00' },
    { id: 2, event_id: 1, email: 'alice@innovate.org', amount: 299.00, ticket_summary: '1x VIP Delegate Pass', created_at: '2026-06-22 15:45:00' },
    { id: 3, event_id: 2, email: 'melody@music.io', amount: 698.00, ticket_summary: '2x 3-Day General Pass, 1x VIP Backstage Access', created_at: '2026-06-24 09:30:00' }
];

// State Manager
class AppState {
    static init() {
        if (!localStorage.getItem(EVENTS_KEY)) {
            localStorage.setItem(EVENTS_KEY, JSON.stringify(DEFAULT_EVENTS));
        }
        if (!localStorage.getItem(TICKETS_KEY)) {
            localStorage.setItem(TICKETS_KEY, JSON.stringify(DEFAULT_TICKETS));
        }
        if (!localStorage.getItem(PAYMENTS_KEY)) {
            localStorage.setItem(PAYMENTS_KEY, JSON.stringify(DEFAULT_PAYMENTS));
        }
    }

    static getEvents() {
        return JSON.parse(localStorage.getItem(EVENTS_KEY));
    }

    static saveEvents(events) {
        localStorage.setItem(EVENTS_KEY, JSON.stringify(events));
    }

    static getTickets() {
        return JSON.parse(localStorage.getItem(TICKETS_KEY));
    }

    static saveTickets(tickets) {
        localStorage.setItem(TICKETS_KEY, JSON.stringify(tickets));
    }

    static getPayments() {
        return JSON.parse(localStorage.getItem(PAYMENTS_KEY));
    }

    static savePayments(payments) {
        localStorage.setItem(PAYMENTS_KEY, JSON.stringify(payments));
    }

    static login(email, password) {
        if (email === 'admin@admin.com' && password === 'password') {
            localStorage.setItem(AUTH_KEY, 'true');
            return true;
        }
        return false;
    }

    static logout() {
        localStorage.removeItem(AUTH_KEY);
    }

    static isAuthenticated() {
        return localStorage.getItem(AUTH_KEY) === 'true';
    }
}

// Initialize on load
AppState.init();

// Landing page logic helper
let currentCheckoutEvent = null;
let currentQuantities = {};

function initLandingPage() {
    renderLandingEvents();
    setupLandingEvents();
}

function renderLandingEvents() {
    const container = document.getElementById('events-container');
    if (!container) return;

    const events = AppState.getEvents();
    const tickets = AppState.getTickets();

    if (events.length === 0) {
        container.innerHTML = `<div class="alert alert-warning" style="grid-column: 1/-1; text-align: center;">No events scheduled at this moment. Check back soon!</div>`;
        return;
    }

    container.innerHTML = events.map(event => {
        const eventTickets = tickets.filter(t => t.event_id === event.id);
        const minPrice = eventTickets.length > 0 ? Math.min(...eventTickets.map(t => t.price)) : 0;
        const availableTickets = eventTickets.reduce((acc, t) => acc + (t.amount - t.sold), 0);

        return `
            <div class="event-card" data-event-id="${event.id}">
                <div class="event-img">
                    ${event.image ? `<img src="${event.image}" class="event-img-url" alt="${event.title}">` : ''}
                    <div class="event-badges">
                        <span class="badge-tag">${availableTickets > 0 ? 'Tickets Available' : 'Sold Out'}</span>
                    </div>
                </div>
                <div class="event-card-body">
                    <h3 class="event-card-title">${event.title}</h3>
                    <p class="event-card-desc">${event.description.length > 140 ? event.description.substring(0, 140) + '...' : event.description}</p>
                    <div class="event-card-meta">
                        <div class="meta-item">
                            <span class="meta-icon">📅</span>
                            <span>${formatDateString(event.start_time)}</span>
                        </div>
                        <div class="meta-item">
                            <span class="meta-icon">📍</span>
                            <span>${event.venue}</span>
                        </div>
                        <div class="meta-item">
                            <span class="meta-icon">💰</span>
                            <span>From <strong>${minPrice.toFixed(2)} €</strong></span>
                        </div>
                    </div>
                    <button class="btn-card" onclick="openCheckout(${event.id})">Get Tickets</button>
                </div>
            </div>
        `;
    }).join('');
}

function formatDateString(str) {
    if (!str) return '';
    const date = new Date(str.replace(/-/g, '/'));
    return date.toLocaleDateString('en-US', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
}

function setupLandingEvents() {
    // Modal Backdrops closing
    document.querySelectorAll('.modal-backdrop, .modal-close').forEach(elem => {
        elem.addEventListener('click', () => {
            closeModals();
        });
    });
}

function closeModals() {
    document.querySelectorAll('.modal').forEach(modal => {
        modal.style.display = 'none';
    });
}

function openCheckout(eventId) {
    const events = AppState.getEvents();
    const event = events.find(e => e.id === eventId);
    if (!event) return;

    currentCheckoutEvent = event;
    currentQuantities = {};

    const modal = document.getElementById('checkout-modal');
    const modalTitle = document.getElementById('checkout-title');
    const modalDesc = document.getElementById('checkout-desc');
    const ticketSelector = document.getElementById('ticket-selector-container');

    modalTitle.textContent = event.title;
    modalDesc.innerHTML = `<span style="color:var(--accent);">📍 ${event.venue}</span> | 📅 ${formatDateString(event.start_time)}`;

    const tickets = AppState.getTickets().filter(t => t.event_id === eventId);
    
    if (tickets.length === 0) {
        ticketSelector.innerHTML = `<div class="alert alert-warning">No tickets are set up for this event yet.</div>`;
    } else {
        ticketSelector.innerHTML = tickets.map(ticket => {
            currentQuantities[ticket.id] = 0;
            const remaining = ticket.amount - ticket.sold;
            return `
                <div class="ticket-item" id="ticket-row-${ticket.id}">
                    <div class="ticket-info">
                        <h4>${ticket.title}</h4>
                        <p>${ticket.price.toFixed(2)} € &nbsp;&bull;&nbsp; ${remaining} remaining</p>
                    </div>
                    <div class="ticket-qty-control">
                        <button type="button" class="qty-btn" onclick="adjustQty(${ticket.id}, -1, ${remaining})">-</button>
                        <span class="qty-val" id="qty-${ticket.id}">0</span>
                        <button type="button" class="qty-btn" onclick="adjustQty(${ticket.id}, 1, ${remaining})">+</button>
                    </div>
                </div>
            `;
        }).join('');
    }

    updateSummary();

    // Reset Form Errors and UI
    document.getElementById('checkout-form-sec').style.display = 'block';
    document.getElementById('checkout-success-sec').style.display = 'none';
    document.getElementById('card-errors').style.display = 'none';
    document.getElementById('checkout-email').value = '';
    document.getElementById('card-number').value = '';
    document.getElementById('card-expiry').value = '';
    document.getElementById('card-cvc').value = '';

    modal.style.display = 'flex';
}

function adjustQty(ticketId, change, limit) {
    let currentVal = currentQuantities[ticketId] || 0;
    currentVal += change;
    if (currentVal < 0) currentVal = 0;
    if (currentVal > limit) currentVal = limit;
    
    currentQuantities[ticketId] = currentVal;
    
    const qtyElem = document.getElementById(`qty-${ticketId}`);
    if (qtyElem) qtyElem.textContent = currentVal;

    updateSummary();
}

function updateSummary() {
    const summaryItems = document.getElementById('summary-items');
    const summaryTotal = document.getElementById('summary-total-val');
    
    let total = 0;
    let itemsHTML = '';
    
    const tickets = AppState.getTickets();

    for (const [ticketIdStr, qty] of Object.entries(currentQuantities)) {
        if (qty > 0) {
            const ticketId = parseInt(ticketIdStr);
            const ticket = tickets.find(t => t.id === ticketId);
            if (ticket) {
                const cost = ticket.price * qty;
                total += cost;
                itemsHTML += `
                    <div class="summary-row">
                        <span>${qty}x ${ticket.title}</span>
                        <span>${cost.toFixed(2)} €</span>
                    </div>
                `;
            }
        }
    }

    if (itemsHTML === '') {
        itemsHTML = `<div class="summary-row" style="color:var(--text-muted);">No tickets selected</div>`;
    }

    summaryItems.innerHTML = itemsHTML;
    summaryTotal.textContent = `${total.toFixed(2)} €`;

    // Disable Pay Now button if total is 0
    const payBtn = document.getElementById('btn-pay-now');
    if (payBtn) payBtn.disabled = (total <= 0);
}

function handlePaymentSubmit(e) {
    e.preventDefault();

    const email = document.getElementById('checkout-email').value.trim();
    const cardNumber = document.getElementById('card-number').value.replace(/\s+/g, '');
    const expiry = document.getElementById('card-expiry').value.trim();
    const cvc = document.getElementById('card-cvc').value.trim();
    const cardErrors = document.getElementById('card-errors');

    // Basic Validation
    if (!email) {
        showError('Please enter a valid email address.');
        return;
    }
    if (cardNumber.length < 16) {
        showError('Invalid Card Number. Must be a 16-digit card.');
        return;
    }
    if (!expiry || !expiry.includes('/')) {
        showError('Invalid Expiry Date (MM/YY).');
        return;
    }
    if (cvc.length < 3) {
        showError('Invalid CVC code.');
        return;
    }

    // Process payment (Simulate Stripe delay)
    const payBtn = document.getElementById('btn-pay-now');
    payBtn.disabled = true;
    payBtn.innerHTML = 'Processing Payment... 🔒';

    setTimeout(() => {
        // Log transaction and adjust ticket inventory
        const tickets = AppState.getTickets();
        const payments = AppState.getPayments();
        let total = 0;
        let summaryList = [];

        for (const [ticketIdStr, qty] of Object.entries(currentQuantities)) {
            if (qty > 0) {
                const ticketId = parseInt(ticketIdStr);
                const ticket = tickets.find(t => t.id === ticketId);
                if (ticket) {
                    ticket.sold += qty;
                    total += ticket.price * qty;
                    summaryList.push(`${qty}x ${ticket.title}`);
                }
            }
        }

        AppState.saveTickets(tickets);

        // Add to payments
        const paymentRecord = {
            id: payments.length + 1,
            event_id: currentCheckoutEvent.id,
            email: email,
            amount: total,
            ticket_summary: summaryList.join(', '),
            created_at: new Date().toISOString().replace('T', ' ').substring(0, 19)
        };
        payments.push(paymentRecord);
        AppState.savePayments(payments);

        // Show ticket success page
        document.getElementById('checkout-form-sec').style.display = 'none';
        document.getElementById('checkout-success-sec').style.display = 'block';

        // Populate Ticket Receipt UI
        document.getElementById('receipt-event-title').textContent = currentCheckoutEvent.title;
        document.getElementById('receipt-venue').textContent = currentCheckoutEvent.venue;
        document.getElementById('receipt-date').textContent = formatDateString(currentCheckoutEvent.start_time);
        document.getElementById('receipt-email').textContent = email;
        document.getElementById('receipt-details').textContent = summaryList.join(' + ');
        document.getElementById('receipt-code').textContent = 'TXN-' + Math.random().toString(36).substr(2, 9).toUpperCase();

        // Render landing events again to reflect remaining tickets
        renderLandingEvents();
    }, 1500);
}

function showError(msg) {
    const errorBox = document.getElementById('card-errors');
    errorBox.textContent = msg;
    errorBox.style.display = 'block';
}

// Admin Panel Logic Helper
function initAdminDashboard() {
    if (!AppState.isAuthenticated()) {
        window.location.href = 'index.html';
        return;
    }
    
    // Wire sidebar navigation
    setupAdminNavigation();
    
    // Initial Render of default tab
    switchTab('nav-dash');
}

function setupAdminNavigation() {
    document.querySelectorAll('.sidebar-menu .menu-item').forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const tabId = item.id;
            switchTab(tabId);
        });
    });

    const logoutBtn = document.getElementById('btn-logout');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            AppState.logout();
            window.location.href = 'index.html';
        });
    }
}

function switchTab(tabId) {
    document.querySelectorAll('.sidebar-menu .menu-item').forEach(item => {
        item.classList.remove('active');
    });
    
    const activeItem = document.getElementById(tabId);
    if (activeItem) activeItem.classList.add('active');

    // Show/Hide page contents
    const contentAreas = ['dash-overview', 'dash-events', 'dash-tickets', 'dash-payments'];
    contentAreas.forEach(area => {
        const el = document.getElementById(area);
        if (el) el.style.display = 'none';
    });

    if (tabId === 'nav-dash') {
        renderMetrics();
        const el = document.getElementById('dash-overview');
        if (el) el.style.display = 'block';
    } else if (tabId === 'nav-events') {
        renderEventsTable();
        const el = document.getElementById('dash-events');
        if (el) el.style.display = 'block';
    } else if (tabId === 'nav-tickets') {
        renderTicketsTable();
        const el = document.getElementById('dash-tickets');
        if (el) el.style.display = 'block';
    } else if (tabId === 'nav-payments') {
        renderPaymentsTable();
        const el = document.getElementById('dash-payments');
        if (el) el.style.display = 'block';
    }
}

function renderMetrics() {
    const events = AppState.getEvents();
    const tickets = AppState.getTickets();
    const payments = AppState.getPayments();

    const totalRevenue = payments.reduce((acc, p) => acc + p.amount, 0);
    const totalSold = tickets.reduce((acc, t) => acc + t.sold, 0);
    const activeEvents = events.length;

    const revElem = document.getElementById('metric-revenue');
    const soldElem = document.getElementById('metric-sold');
    const eventsElem = document.getElementById('metric-events');
    const salesCountElem = document.getElementById('metric-sales-count');

    if (revElem) revElem.textContent = `${totalRevenue.toFixed(2)} €`;
    if (soldElem) soldElem.textContent = totalSold;
    if (eventsElem) eventsElem.textContent = activeEvents;
    if (salesCountElem) salesCountElem.textContent = payments.length;

    // Render sales chart or sales logs preview
    const previewContainer = document.getElementById('metrics-payment-logs');
    if (previewContainer) {
        const slice = payments.slice(-5).reverse();
        previewContainer.innerHTML = slice.map(p => {
            const ev = events.find(e => e.id === p.event_id) || { title: 'Unknown Event' };
            return `
                <tr>
                    <td>${p.created_at}</td>
                    <td>${p.email}</td>
                    <td>${ev.title}</td>
                    <td>${p.ticket_summary}</td>
                    <td style="font-weight:bold; color:var(--success);">${p.amount.toFixed(2)} €</td>
                </tr>
            `;
        }).join('');
    }
}

/* Event CRUD Operations */
function renderEventsTable() {
    const tableBody = document.getElementById('events-table-body');
    if (!tableBody) return;

    const events = AppState.getEvents();
    tableBody.innerHTML = events.map(e => `
        <tr id="event-row-${e.id}">
            <td>${e.id}</td>
            <td style="font-weight:600; color:white;">${e.title}</td>
            <td>${e.venue}</td>
            <td>${e.start_time}</td>
            <td>
                <button class="btn-action btn-edit" onclick="editEventModal(${e.id})">Edit</button>
                <button class="btn-action btn-delete" onclick="deleteEvent(${e.id})">Delete</button>
            </td>
        </tr>
    `).join('');
}

function openAddEventModal() {
    document.getElementById('event-modal-title').textContent = 'Add Event';
    document.getElementById('event-form-id').value = '';
    document.getElementById('event-form-title').value = '';
    document.getElementById('event-form-desc').value = '';
    document.getElementById('event-form-venue').value = '';
    document.getElementById('event-form-time').value = '';
    document.getElementById('event-form-image').value = '';

    document.getElementById('event-crud-modal').style.display = 'flex';
}

function editEventModal(eventId) {
    const events = AppState.getEvents();
    const event = events.find(e => e.id === eventId);
    if (!event) return;

    document.getElementById('event-modal-title').textContent = 'Edit Event';
    document.getElementById('event-form-id').value = event.id;
    document.getElementById('event-form-title').value = event.title;
    document.getElementById('event-form-desc').value = event.description;
    document.getElementById('event-form-venue').value = event.venue;
    document.getElementById('event-form-time').value = event.start_time.replace(' ', 'T').substring(0, 16);
    document.getElementById('event-form-image').value = event.image || '';

    document.getElementById('event-crud-modal').style.display = 'flex';
}

function handleEventFormSubmit(e) {
    e.preventDefault();
    const id = document.getElementById('event-form-id').value;
    const title = document.getElementById('event-form-title').value.trim();
    const desc = document.getElementById('event-form-desc').value.trim();
    const venue = document.getElementById('event-form-venue').value.trim();
    let time = document.getElementById('event-form-time').value;
    const image = document.getElementById('event-form-image').value.trim();

    if (!title || !venue || !time) {
        alert('Please fill out all mandatory fields.');
        return;
    }

    // Format time to Laravel style YYYY-MM-DD HH:MM:SS
    time = time.replace('T', ' ');
    if (time.length === 16) time += ':00';

    const events = AppState.getEvents();

    if (id) {
        // Edit existing
        const idx = events.findIndex(ev => ev.id === parseInt(id));
        if (idx !== -1) {
            events[idx] = { ...events[idx], title, description: desc, venue, start_time: time, image };
        }
    } else {
        // Create new
        const newId = events.length > 0 ? Math.max(...events.map(ev => ev.id)) + 1 : 1;
        events.push({ id: newId, title, description: desc, venue, start_time: time, image });
    }

    AppState.saveEvents(events);
    closeModals();
    renderEventsTable();
}

function deleteEvent(eventId) {
    if (confirm('Are you sure you want to delete this event? This will also remove associated tickets.')) {
        let events = AppState.getEvents();
        events = events.filter(e => e.id !== eventId);
        AppState.saveEvents(events);

        let tickets = AppState.getTickets();
        tickets = tickets.filter(t => t.event_id !== eventId);
        AppState.saveTickets(tickets);

        renderEventsTable();
    }
}

/* Ticket CRUD Operations */
function renderTicketsTable() {
    const tableBody = document.getElementById('tickets-table-body');
    if (!tableBody) return;

    const tickets = AppState.getTickets();
    const events = AppState.getEvents();

    tableBody.innerHTML = tickets.map(t => {
        const event = events.find(e => e.id === t.event_id) || { title: 'Deleted Event' };
        return `
            <tr id="ticket-row-${t.id}">
                <td>${t.id}</td>
                <td style="font-weight:600; color:white;">${t.title}</td>
                <td>${event.title}</td>
                <td>${t.price.toFixed(2)} €</td>
                <td>${t.sold} / ${t.amount}</td>
                <td>
                    <button class="btn-action btn-edit" onclick="editTicketModal(${t.id})">Edit</button>
                    <button class="btn-action btn-delete" onclick="deleteTicket(${t.id})">Delete</button>
                </td>
            </tr>
        `;
    }).join('');
}

function openAddTicketModal() {
    const events = AppState.getEvents();
    const eventSelect = document.getElementById('ticket-form-event');
    
    eventSelect.innerHTML = events.map(e => `<option value="${e.id}">${e.title}</option>`).join('');

    document.getElementById('ticket-modal-title').textContent = 'Add Ticket Tier';
    document.getElementById('ticket-form-id').value = '';
    document.getElementById('ticket-form-title').value = '';
    document.getElementById('ticket-form-price').value = '';
    document.getElementById('ticket-form-amount').value = '';

    document.getElementById('ticket-crud-modal').style.display = 'flex';
}

function editTicketModal(ticketId) {
    const tickets = AppState.getTickets();
    const ticket = tickets.find(t => t.id === ticketId);
    if (!ticket) return;

    const events = AppState.getEvents();
    const eventSelect = document.getElementById('ticket-form-event');
    eventSelect.innerHTML = events.map(e => `<option value="${e.id}" ${e.id === ticket.event_id ? 'selected' : ''}>${e.title}</option>`).join('');

    document.getElementById('ticket-modal-title').textContent = 'Edit Ticket Tier';
    document.getElementById('ticket-form-id').value = ticket.id;
    document.getElementById('ticket-form-title').value = ticket.title;
    document.getElementById('ticket-form-price').value = ticket.price;
    document.getElementById('ticket-form-amount').value = ticket.amount;

    document.getElementById('ticket-crud-modal').style.display = 'flex';
}

function handleTicketFormSubmit(e) {
    e.preventDefault();
    const id = document.getElementById('ticket-form-id').value;
    const eventId = parseInt(document.getElementById('ticket-form-event').value);
    const title = document.getElementById('ticket-form-title').value.trim();
    const price = parseFloat(document.getElementById('ticket-form-price').value);
    const amount = parseInt(document.getElementById('ticket-form-amount').value);

    if (!title || isNaN(price) || isNaN(amount)) {
        alert('Please fill out all fields correctly.');
        return;
    }

    const tickets = AppState.getTickets();

    if (id) {
        const idx = tickets.findIndex(t => t.id === parseInt(id));
        if (idx !== -1) {
            tickets[idx] = { ...tickets[idx], event_id: eventId, title, price, amount };
        }
    } else {
        const newId = tickets.length > 0 ? Math.max(...tickets.map(t => t.id)) + 1 : 1;
        tickets.push({ id: newId, event_id: eventId, title, price, amount, sold: 0 });
    }

    AppState.saveTickets(tickets);
    closeModals();
    renderTicketsTable();
}

function deleteTicket(ticketId) {
    if (confirm('Are you sure you want to delete this ticket tier?')) {
        let tickets = AppState.getTickets();
        tickets = tickets.filter(t => t.id !== ticketId);
        AppState.saveTickets(tickets);
        renderTicketsTable();
    }
}

/* Payments Log Panel */
function renderPaymentsTable() {
    const tableBody = document.getElementById('payments-table-body');
    if (!tableBody) return;

    const payments = AppState.getPayments();
    const events = AppState.getEvents();

    tableBody.innerHTML = payments.slice().reverse().map(p => {
        const event = events.find(e => e.id === p.event_id) || { title: 'Deleted Event' };
        return `
            <tr>
                <td>${p.id}</td>
                <td>${p.created_at}</td>
                <td>${p.email}</td>
                <td style="font-weight:600; color:white;">${event.title}</td>
                <td>${p.ticket_summary}</td>
                <td style="font-weight:bold; color:var(--success);">${p.amount.toFixed(2)} €</td>
            </tr>
        `;
    }).join('');
}

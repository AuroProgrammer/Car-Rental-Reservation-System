const express = require('express');
const conn = require('./conn.js');
const app = express();

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// Home / Read Pages Content
app.get('/', (req, res) => {
    res.render('index');
});

// Send Message Route (Contact)
app.post('/contact', (req, res) => {
    const name = req.body.name;
    const email = req.body.email;
    const message = req.body.message;

    const insert = `INSERT INTO tbl_messages (id, name, email, message) VALUES (0, '${name}', '${email}', '${message}')`;

    conn.query(insert, (err) => {
        if (err) throw err;
        res.send(`
            <script> 
                alert('Message Sent Successfully');
                location.href='/';
            </script>
        `);
    });
});

// View Cars for Rent Route
app.get('/cars', (req, res) => {
    const getCars = `SELECT id, name, type, price_per_day FROM tbl_cars`;
    
    conn.query(getCars, (err, data) => {
        if (err) throw err;
        res.render('cars', { 
            cars: data 
        });
    });
});

// Book Vehicle Route
app.post('/book', (req, res) => {
    const carId = req.body.carId;
    const userEmail = req.body.userEmail;
    const startDate = req.body.startDate;
    const endDate = req.body.endDate;

    const insertBooking = `INSERT INTO tbl_bookings (id, car_id, user_email, start_date, end_date, status) VALUES (0, '${carId}', '${userEmail}', '${startDate}', '${endDate}', 'Confirmed')`;

    conn.query(insertBooking, (err) => {
        if (err) throw err;
        res.send(`
            <script> 
                alert('Vehicle Booked Successfully');
                location.href='/list_bookings';
            </script>
        `);
    });
});

// Manage Bookings Route (View Bookings)
app.get('/list_bookings', (req, res) => {
    const getBookings = `
        SELECT 
            b.id AS booking_id, 
            c.name AS car_name, 
            b.user_email, 
            b.start_date, 
            b.end_date, 
            b.status 
        FROM tbl_bookings b 
        JOIN tbl_cars c ON b.car_id = c.id
    `;
    
    conn.query(getBookings, (err, data) => {
        if (err) throw err;
        res.render('list_bookings', { 
            bookings: data 
        });
    });
});

// Cancel / Delete Booking Route
app.get('/delete_booking/:id', (req, res) => {
    const bookingId = req.params.id;

    const deleteQuery = `DELETE FROM tbl_bookings WHERE id = ${bookingId}`;

    conn.query(deleteQuery, (err) => {
        if (err) throw err;
        res.send(`
            <script> 
                alert('Booking Cancelled Successfully');
                location.href='/list_bookings';
            </script>
        `);
    });
});

// Manage Testimonials Route (View)
app.get('/testimonials', (req, res) => {
    const getTestimonials = `SELECT id, name, comment, rating FROM tbl_testimonials`;
    
    conn.query(getTestimonials, (err, data) => {
        if (err) throw err;
        res.render('testimonials', { 
            testimonials: data 
        });
    });
});

// Add Testimonial Route
app.post('/add_testimonial', (req, res) => {
    const name = req.body.name;
    const comment = req.body.comment;
    const rating = req.body.rating;

    const insertTestimonial = `INSERT INTO tbl_testimonials (id, name, comment, rating) VALUES (0, '${name}', '${comment}', '${rating}')`;

    conn.query(insertTestimonial, (err) => {
        if (err) throw err;
        res.send(`
            <script> 
                alert('Testimonial Added Successfully');
                location.href='/testimonials';
            </script>
        `);
    });
});

// Manage Account Details Route (View)
app.get('/account', (req, res) => {
    const getUser = `SELECT id, name, email, phone FROM tbl_users WHERE id = 1`;
    
    conn.query(getUser, (err, data) => {
        if (err) throw err;
        res.render('account', { 
            user: data[0] || {} 
        });
    });
});

// Update Account Details & Credentials Route
app.post('/update_account', (req, res) => {
    const name = req.body.name;
    const email = req.body.email;
    const phone = req.body.phone;
    const password = req.body.password;

    let updateQuery;
    if (password) {
        updateQuery = `UPDATE tbl_users SET name = '${name}', email = '${email}', phone = '${phone}', password = '${password}' WHERE id = 1`;
    } else {
        updateQuery = `UPDATE tbl_users SET name = '${name}', email = '${email}', phone = '${phone}' WHERE id = 1`;
    }

    conn.query(updateQuery, (err) => {
        if (err) throw err;
        res.send(`
            <script> 
                alert('Account Updated Successfully');
                location.href='/account';
            </script>
        `);
    });
});

app.listen(9000, () => {
    console.log('Server running on port 9000');
});
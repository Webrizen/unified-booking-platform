### Unified Booking Platform Plan

#### **High-Level Strategy**

The core idea is to create a single, unified system that can handle different types of bookings (rooms, marriage gardens, water parks) by abstracting common functionalities and tailoring specific ones. The tech stack of **Next.js**, **MongoDB**, and **Nodemailer** is well-suited for this. Next.js will handle both the front end and API routes, MongoDB will manage data storage, and Nodemailer will manage email notifications.

---

### **Phase 1: Foundation and Core Modules**

#### **1. Database Schema Design (MongoDB)** ⚙️

Create a flexible and scalable database schema. Don't make separate collections for each booking type; instead, use a unified approach with a discriminator field. A single **`bookings`** collection is the best option here, with a field like **`bookingType`** (`room`, `marriageGarden`, `waterPark`).

-   **`users` collection**: Stores user information.
    -   `_id`
    -   `name`
    -   `email`
    -   `password` (hashed)
-   **`bookings` collection**: The central collection for all bookings.
    -   `_id`
    -   `userId` (reference to the user)
    -   **`bookingType`** (string: `room`, `marriageGarden`, `waterPark`)
    -   `details` (object): This is where the magic happens. It will store type-specific data.
        -   **For `room`**: `roomId`, `checkInDate`, `checkOutDate`, `guests`
        -   **For `marriageGarden`**: `gardenId`, `eventDate`, `eventTime`, `estimatedGuests`
        -   **For `waterPark`**: `parkId`, `date`, `ticketType`, `tickets`
    -   `totalPrice`
    -   `status` (string: `pending`, `confirmed`, `cancelled`)
    -   `createdAt`
-   **`resources` collection**: Stores information about the bookable items.
    -   `_id`
    -   **`resourceType`** (string: `room`, `garden`, `park`)
    -   `name`
    -   `description`
    -   `availability` (e.g., an array of unavailable dates)
    -   `price`
    -   `photos`



#### **2. Backend API Routes (Next.js)** 🛣️

Use Next.js API routes to handle all backend logic. This keeps the project cohesive.

-   **User APIs**: `GET /api/users`, `POST /api/users/register`, `POST /api/users/login`
-   **Booking APIs**:
    -   `POST /api/bookings`: To create a new booking. The API will validate the `bookingType` and the `details` object.
    -   `GET /api/bookings/:id`: To fetch a single booking.
    -   `GET /api/bookings/user/:userId`: To fetch a user's bookings.
-   **Availability APIs**:
    -   `GET /api/resources/availability?type=room&startDate=...`: To check resource availability before a user books.

---

### **Phase 2: User Interface and Integration**

#### **1. Frontend Pages (Next.js)** 🖼️

Design a clear and intuitive user interface.

-   **Homepage**: A landing page with links to different booking sections (`Rooms`, `Marriage Gardens`, `Water Park`).
-   **Booking Pages**:
    -   **`/book/room`**: A form for room bookings.
    -   **`/book/garden`**: A form for garden bookings.
    -   **`/book/waterpark`**: A form for water park bookings.
    Each page will consume data from the relevant `resources` API and post to the unified `bookings` API.
-   **User Dashboard**: A protected page (`/dashboard`) where users can view their past and upcoming bookings, and manage their profiles.

#### **2. Email Notifications (Nodemailer)** 📧

Integrate Nodemailer into the booking API to send automated emails.

-   **Confirmation Email**: After a successful booking (`POST /api/bookings`), send a confirmation email with all the booking details. This should be a Next.js API route handler that calls a separate function to send the email.
-   **Cancellation/Update Email**: Send notifications if a booking is cancelled or modified.

---

### **Phase 3: Security and Enhancements**

#### **1. Authentication and Security** 🔒

Implement robust authentication to protect user data and routes.

-   **Authentication**: Use **JWT (JSON Web Tokens)** for stateless authentication.
-   **Password Hashing**: Store passwords securely using libraries like **`bcrypt`**. Never store plain text passwords.
-   **Route Protection**: Protect Next.js API routes and frontend pages using middleware to ensure only authenticated users can access them.

#### **2. Enhancements** 🚀

-   **Search Functionality**: Add search and filter options to help users find resources easily.
-   **Payment Integration**: Integrate a payment gateway like **Stripe** or **Razorpay** to process payments securely. This will involve updating the `bookings` collection with a `paymentStatus` field.
-   **Admin Panel**: Create a separate, secure admin panel for managing bookings, resources, and users.
-   **Cancellation Policy**: Implement and display a clear cancellation policy.
-   **Reviews and Ratings**: Allow users to leave reviews and ratings for the booked resources.
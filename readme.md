# ServiceFlow  
## Local Services Booking Platform

---

## 📌 Assignment Context

This project is built as part of a hackathon assignment based on:

**Problem Statement 1: Local Services Booking Platform**

The objective is to build a complete system that connects customers with local service professionals and manages the full job lifecycle.

This implementation strictly follows the provided requirements and focuses on:

- Feature completeness  
- Workflow logic  
- Controlled state transitions  
- Proper schema design  
- Clean role-based architecture  

No additional features outside the assignment scope were implemented.

---

## 🎯 Objective

To design and implement a platform that enables:

- Customers to book local services  
- Service providers to manage job requests  
- Admin to oversee platform operations  

The system enforces a structured booking lifecycle:

Requested → Confirmed → In-progress → Completed → Cancelled

---

## 👥 System Roles

### 👤 Customer

- Browse services by category  
- Filter providers by city/area  
- Create booking request (address, date/time, notes, optional image upload)  
- Display pricing before confirmation  
- Track booking status  
- Reschedule or cancel booking  
- Submit rating and review after completion  

---

### 🛠 Service Provider

- Create and manage professional profile (category, city/area, hourly pricing, short bio, optional profile image)  
- Toggle availability status  
- Accept or reject bookings  
- Update job status  
- Add work notes  
- Upload before/after images  

---

### 🛡 Admin

- Approve service providers  
- Manage service categories  
- Moderate reviews  

---

## 🔄 Workflow Logic & State Management

The system enforces strict state transitions:

| Current Status | Allowed Next Status |
|---------------|--------------------|
| Requested     | Confirmed / Cancelled |
| Confirmed     | In-progress / Cancelled |
| In-progress   | Completed |
| Completed     | — |
| Cancelled     | — |

Role-based permissions ensure:

- Customers cannot skip workflow stages  
- Providers cannot bypass lifecycle steps  
- Reviews can only be submitted after completion  

---

## 🗄 Database Structure (High-Level)

Core Collections / Tables:

- Users  
- Provider Profiles  
- Categories  
- Bookings  
- Booking Images  
- Reviews  

The schema is structured to maintain lifecycle integrity and proper data relationships.

---

## 🖥 Screenshots

> Replace the placeholders below with your actual screenshots.

### 🏠 Landing Page

![Landing Page Screenshot](./screenshots/landing-page.png)

---

### 👤 Customer Dashboard

![Customer Dashboard Screenshot](./screenshots/customer-dashboard.png)

---

### 🛠 Provider Dashboard

![Provider Dashboard Screenshot](./screenshots/provider-dashboard.png)

---

### 🔄 Booking Lifecycle View

![Booking Status Screenshot](./screenshots/booking-status.png)

---

### 🛡 Admin Panel

![Admin Panel Screenshot](./screenshots/admin-panel.png)

---

## 🧠 Key Implementation Focus

- Controlled booking lifecycle  
- Role-based authorization  
- Clean data modeling  
- Workflow-driven architecture  
- Production-ready structure  

---

## 🚀 Deployment

Frontend: <your-frontend-link>  
Backend: <your-backend-link>

---

## 📎 Notes

- This project is original work.  
- Built individually as per assignment rules.  
- Designed with production-thinking and real-world workflow logic in mind.
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

### 🏠 Landing Page

![Landing Page Screenshot](/frontend/public/screenshots/Screenshot%202026-03-08%20at%2011.53.08 PM.png)

---

### 👤 Customer Dashboard

![Customer Dashboard Screenshot](/frontend/public/screenshots/Screenshot%202026-03-08%20at%2011.55.39 PM.png)

---

### 🛠 Provider Dashboard

![Provider Dashboard Screenshot](/frontend/public/screenshots/Screenshot%202026-03-08%20at%2011.56.41 PM.png)

---

### 🔄 Booking Lifecycle View

![Booking Status Screenshot](/frontend/public/screenshots/Screenshot%202026-03-08%20at%2011.56.11 PM.png)

---

### 🛡 Admin Panel

![Admin Panel Screenshot](/frontend/public/screenshots/Screenshot%202026-03-08%20at%2011.57.18 PM.png)

---

## 🧠 Key Implementation Focus

- Controlled booking lifecycle  
- Role-based authorization  
- Clean data modeling  
- Workflow-driven architecture  
- Production-ready structure  

---

## 🚀 Deployment

https://serviceflow-lime.vercel.app/

---

## 📎 Notes

- This project is original work.  
- Built individually as per assignment rules.  
- Designed with production-thinking and real-world workflow logic in mind.
# Annasetu - Food Donation Platform

A comprehensive web-based solution for bridging the gap between food donors and NGOs, reducing food waste while addressing hunger in communities.

## 1. Introduction

### 1.1 Overview

Annasetu is a web-based platform designed to facilitate food collection and distribution between donors, NGOs, and volunteers. It enables users to donate surplus food, request food, and track deliveries efficiently. Admins can manage users, monitor activities, and generate reports for system transparency. 


**Key Mission**: To reduce food waste while ensuring that surplus food reaches those in need through an organized, transparent, and efficient system.

## 2. Features

### Core Functionality

- **User Roles**: Donors, NGOs, Volunteers, and Admins with distinct dashboards and permissions
- **Donor Features**: 
  - Register and manage profile details
  - Submit food donations with type, quantity, and expiration date information
  - Track donation status in real-time

- **NGO Features**: 
  - Browse and search available food donations
  - Request food items based on organizational needs
  - Assign volunteers for food collection and delivery
  - Monitor request fulfillment status

- **Volunteer Features**: 
  - View assigned food pickup and delivery tasks
  - Update collection and delivery status in real-time
  - Track completed deliveries

- **Admin Features**: 
  - Comprehensive dashboard for system monitoring
  - User management and role assignment
  - Manage Enquiry

## 3. Technology Stack

- **Frontend**: React.js, React Bootstrap, Context API for state management
- **Backend**: Node.js, Express.js REST APIs
- **Database**: MongoDB with flexible schema design
- **Authentication**: JSON Web Tokens (JWT) with secure password hashing
- **Deployment**: Cloud-ready architecture

## 4. Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (v4.4 or higher) - local installation or MongoDB Atlas cloud instance
- npm (v6 or higher) or yarn package manager
- Git for version control

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/gauravasodariya/annasetu.git
   cd annasetu
   ```

2. **Install backend dependencies:**
   ```bash
   cd server
   npm install
   ```

3. **Install frontend dependencies:**
   ```bash
   cd ../client
   npm install
   ```

4. **Configure environment variables:**
   - Create `.env` file in the `server` directory
   - Add necessary configuration:
     ```
     MONGODB_URI=your_mongodb_connection_string
     JWT_SECRET=your_secret_key
     PORT=5000
     ```

5. **Start the application:**
   ```bash
   # Terminal 1 - Start backend server
   cd server
   npm start

   # Terminal 2 - Start frontend development server
   cd client
   npm start
   ```

   The application will be accessible at `http://localhost:3000`


## 8. License

This project is open source and available under the MIT License. See LICENSE file for more details.

## 9. Support & Contact

For support, questions, or suggestions:
- **Email**: support@annasetu.com
- **Issues**: Open an issue in the repository
- **Documentation**: Check the wiki for detailed guides

**Last Updated**: May 18, 2025

**Version**: 1.0.0

**Status**: Active Development

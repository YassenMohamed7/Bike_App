# Bike Rental System - Backend Dashboard
# Overview

This repository contains the backend dashboard for the Bike Rental System, a platform designed to manage bike rentals, user interactions, and administrative tasks. The backend is built using Node.js and Firebase Firestore, providing a robust and scalable environment to handle data and business logic.
# Features

    User Management: Manage user profiles, including registration, authentication, and role assignments.
    Bike Management: Add, update, delete, and list available bikes for rent.
    Rental Management: Track and manage active, upcoming, and past rentals.
    Offers & Discounts: Create and manage promotional offers and discounts for users.
    Analytics: View and generate reports on usage statistics, revenue, and user activity.
    Notifications: Send notifications to users about their rentals, offers, and more.

# Project Structure

bash

├── /models/               # Defines the data structures and interacts with Firestore
├── /routes/               # Defines API endpoints and routes
├── /services/             # Contains business logic and services for different modules
├── /utils/                # Utility functions and helpers
├── /config/               # Configuration files, including Firebase setup
├── /middlewares/          # Middleware functions for request validation and authentication
└── server.js                 # Main application entry point

# Setup Instructions
  # Prerequisites

Before running the project, ensure you have the following installed:

    Node.js (v14.x or higher)
    npm (v6.x or higher)
    Firebase CLI (Optional for deployment and management)

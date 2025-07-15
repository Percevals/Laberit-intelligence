# Admin Interface Guide

## Overview
The admin interface provides a comprehensive management system for companies in the DII Assessment platform. It includes features for viewing, filtering, editing, and re-verifying company data.

## Accessing the Admin Interface
1. Navigate to the home page (`/`)
2. Click the "Admin" link in the navigation header
3. Or directly navigate to `/admin`

## Features

### 1. Company Table
- **Display**: Shows all companies with their key information:
  - Company name and industry
  - Business model classification
  - Last verification date
  - Data freshness status
  - Company details (location, employees, revenue)
  - Actions (re-verify, edit)

### 2. Filtering System
Click the filter button to access advanced filtering options:
- **Search**: Free text search across company names, domains, and industries
- **Business Model**: Filter by specific DII business models
- **Data Freshness**: Filter by fresh, stale, or critical status
- **Prospect Status**: Filter by prospects or customers

### 3. Data Freshness Indicators
Companies are categorized by data freshness:
- **Fresh** (green): Data verified within the configured freshness period
- **Stale** (amber): Data exceeds freshness period but less than 2x the period
- **Critical** (red): Data exceeds 2x the freshness period or never verified

### 4. Re-verification
- Click the refresh button to trigger AI-powered re-verification
- The system simulates an AI search to update company data
- Loading state shows during verification process

### 5. Edit Functionality
- Click the edit button to modify company details
- Editable fields include:
  - Company name
  - Business model classification
  - Confidence score
  - Data freshness period
  - Prospect status

### 6. Add New Companies
- Use the company search input in the header
- Search for companies using AI-powered search
- Selected companies are automatically classified and added to the database

### 7. Summary Statistics
Bottom cards show real-time statistics:
- Total companies in the system
- Count of companies with fresh data
- Count of companies with stale data
- Count of companies with critical data status

## Technical Implementation

### Components
- `AdminCompanyManager`: Main component handling all admin functionality
- Uses mock database service for data persistence
- Implements glass morphism design consistent with the app

### TypeScript Types
- Full TypeScript support with proper typing for:
  - Company data structures
  - Business model enums
  - Filter states
  - Modal props

### State Management
- Local component state for filters and UI
- Mock database service for data operations
- Real-time updates after edits or re-verification

### Design System
- Follows existing Tailwind + glass morphism design
- Dark theme with subtle transparency effects
- Responsive layout for different screen sizes
- Smooth animations with Framer Motion

## Mock Data
The system includes pre-populated companies with various:
- Business models
- Data freshness states
- Geographic locations
- Company sizes
- Prospect/customer status

This provides a realistic testing environment for all admin features.
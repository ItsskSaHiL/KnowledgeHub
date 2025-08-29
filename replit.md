# Knowledge Hub Platform

## Overview

This is a personal knowledge management system built as a full-stack web application. The platform allows users to organize and showcase their learning content across multiple technology domains including embedded systems, AI/ML, operating systems, and hardware architectures. It serves as both a personal learning archive and a portfolio showcase, featuring a clean, modern interface for creating, organizing, and displaying articles, projects, and documentation.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript for type safety and modern development
- **Routing**: Wouter for lightweight client-side routing
- **Styling**: Tailwind CSS with custom design system using CSS variables for theming
- **UI Components**: Radix UI primitives with shadcn/ui component library for consistent, accessible interface
- **State Management**: TanStack Query (React Query) for server state management and caching
- **Forms**: React Hook Form with Zod validation for robust form handling
- **Build Tool**: Vite for fast development and optimized production builds

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **API Design**: RESTful API with structured route organization
- **Data Storage**: Currently using in-memory storage with abstracted interface for easy database migration
- **Database ORM**: Drizzle ORM configured for PostgreSQL with type-safe schema definitions
- **Development Setup**: Development server with hot module replacement and error overlays

### Data Model
The system organizes content into three main entities:
- **Domains**: Technology categories (e.g., Embedded Systems, AI/ML) with progress tracking
- **Articles**: Learning content and documentation with status tracking (draft, in-progress, published)
- **Projects**: Portfolio items with GitHub/demo links and technology tags

### Theme System
- **Design Tokens**: CSS custom properties for consistent spacing, colors, and typography
- **Dark/Light Mode**: Complete theme switching with system preference detection
- **Component Variants**: Class Variance Authority for type-safe component styling

### Development Experience
- **Type Safety**: Full TypeScript coverage across frontend, backend, and shared schema
- **Code Quality**: ESLint and Prettier for consistent code formatting
- **Hot Reload**: Vite development server with instant updates
- **Error Handling**: Runtime error overlays and structured error boundaries

## External Dependencies

### Database & ORM
- **Drizzle ORM**: Type-safe database toolkit with PostgreSQL dialect
- **@neondatabase/serverless**: Serverless PostgreSQL driver for Neon database

### UI Framework & Components
- **React**: Core framework with hooks and context
- **Radix UI**: Headless component primitives for accessibility
- **Tailwind CSS**: Utility-first CSS framework
- **Lucide React**: Consistent icon system

### Form Management
- **React Hook Form**: Performance-focused form library
- **Zod**: Runtime type validation and schema definition
- **@hookform/resolvers**: Integration between React Hook Form and Zod

### Development Tools
- **Vite**: Build tool and development server
- **TypeScript**: Static type checking
- **PostCSS**: CSS processing with Tailwind integration

### State & Data Fetching
- **TanStack Query**: Server state management with caching and synchronization
- **Express.js**: Backend API framework
- **connect-pg-simple**: PostgreSQL session store (prepared for future session management)

### Utility Libraries
- **date-fns**: Date manipulation and formatting
- **clsx & tailwind-merge**: Conditional CSS class handling
- **class-variance-authority**: Type-safe component variants
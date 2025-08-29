# 🧠 Personal Knowledge Hub

A modern, full-stack web application designed to organize, showcase, and manage your learning journey across multiple technology domains. Built with React, TypeScript, and Express, this platform serves as both a personal learning archive and a professional portfolio showcase.

## ✨ Features

- **📚 Domain Organization** - Categorize knowledge into technology domains (Embedded Systems, AI/ML, Hardware, etc.)
- **📝 Content Management** - Create and manage articles, projects, and documentation
- **🎯 Progress Tracking** - Visual progress indicators for each learning domain
- **🔍 Advanced Search** - Full-text search across all articles and content
- **🌙 Dark/Light Mode** - Complete theme switching with system preference detection
- **📱 Responsive Design** - Optimized for desktop, tablet, and mobile devices
- **🏷️ Tagging System** - Organize content with customizable tags
- **🚀 Portfolio Integration** - Dedicated portfolio section with GitHub/demo links
- **📊 Learning Analytics** - Track articles, projects, and learning hours
- **⚡ Real-time Updates** - Live content updates with TanStack Query
- **🎨 Modern UI** - Clean interface built with Radix UI and Tailwind CSS

## 🛠️ Installation

### Prerequisites

- Node.js 20+ 
- npm or yarn package manager

### Quick Start

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd knowledge-hub
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5000` to view the application.

## 🚀 Usage

### Adding New Content

1. **Create a Domain**
   - Navigate to the homepage
   - Domains represent technology categories (e.g., "Embedded Systems", "AI/ML")
   - Each domain tracks progress and contains articles/projects

2. **Add Articles**
   ```javascript
   // Example article structure
   {
     title: "Understanding ARM Cortex-M Exception Handling",
     content: "Detailed explanation with code examples...",
     domainId: "embedded-systems",
     status: "published", // draft, in-progress, published
     tags: ["ARM", "Exception Handling", "Embedded"]
   }
   ```

3. **Create Projects**
   ```javascript
   // Example project structure
   {
     title: "IoT Weather Station",
     description: "ESP32-based weather monitoring system",
     githubUrl: "https://github.com/user/weather-station",
     demoUrl: "https://weather-demo.com",
     technologies: ["ESP32", "React", "MongoDB"],
     status: "completed"
   }
   ```

### Navigation Examples

- **Homepage**: Overview of all domains with statistics
- **Domain Pages**: `/domain/embedded-systems` - View domain-specific content
- **Article View**: `/article/article-id` - Read full articles with formatting
- **Portfolio**: `/portfolio` - Showcase all projects with filtering

## ⚙️ Configuration

### Environment Variables

Create a `.env` file in the root directory:

```env
# Server Configuration
NODE_ENV=development
PORT=5000

# Database (if using PostgreSQL)
DATABASE_URL=postgresql://user:password@localhost:5432/knowledge_hub

# Feature Flags
ENABLE_ANALYTICS=true
ENABLE_SEARCH=true
```

### Custom Domains

Add new technology domains by modifying the initial data in `server/storage.ts`:

```typescript
const newDomain = {
  id: "blockchain",
  name: "Blockchain & Web3",
  description: "Smart contracts, DeFi, and decentralized applications",
  icon: "fas fa-link",
  color: "purple",
  progress: 0,
  articlesCount: 0,
  projectsCount: 0
};
```

### Theme Customization

Customize colors in `client/src/index.css`:

```css
:root {
  --primary: hsl(217, 91%, 60%);        /* Main brand color */
  --secondary: hsl(220, 9%, 96%);       /* Secondary elements */
  --background: hsl(220, 27%, 98%);     /* Page background */
  --card: hsl(0, 0%, 100%);            /* Card backgrounds */
}
```

## 🏗️ Architecture

### System Overview

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend       │    │   Storage       │
│   (React +      │◄──►│   (Express +    │◄──►│   (Memory/      │
│   TypeScript)   │    │   TypeScript)   │    │   PostgreSQL)   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### Component Architecture

```
src/
├── components/
│   ├── ui/              # Reusable UI components (Radix + shadcn)
│   ├── layout/          # Header, Sidebar, Layout wrappers
│   ├── domain-card.tsx  # Domain display component
│   └── search-dialog.tsx# Search functionality
├── pages/
│   ├── home.tsx         # Landing page with domain grid
│   ├── domain.tsx       # Domain detail view
│   ├── article.tsx      # Article reading view
│   └── portfolio.tsx    # Project showcase
├── lib/
│   ├── queryClient.ts   # TanStack Query configuration
│   └── constants.tsx    # Color schemes and mappings
└── hooks/
    └── use-theme.tsx    # Theme management
```

### Data Flow

1. **Request Lifecycle**:
   ```
   User Action → React Component → TanStack Query → API Route → Storage Layer → Database
   ```

2. **State Management**:
   - **Server State**: TanStack Query with automatic caching
   - **Client State**: React useState for UI interactions
   - **Global State**: Theme context for dark/light mode

## 📊 Core Concepts

### Learning Progress Algorithm

The system calculates domain progress using a weighted approach:

```
Progress = (Published Articles × 0.6 + Completed Projects × 0.4) × 100
           ─────────────────────────────────────────────────────────
                      Total Planned Content
```

### Content Status Workflow

```
Draft → In Progress → Published/Completed
  ↓         ↓             ↓
Review    Active        Archived
```

### Search Implementation

The search uses a multi-field approach:

```typescript
searchScore = (titleMatch × 3) + (contentMatch × 2) + (tagMatch × 1)
```

Where matches are case-insensitive substring searches with relevance weighting.

## 🤝 Contributing

### Development Setup

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```

3. **Make your changes**
   - Follow TypeScript strict mode
   - Add tests for new functionality
   - Update documentation as needed

4. **Run quality checks**
   ```bash
   npm run lint        # ESLint checking
   npm run type-check  # TypeScript validation
   npm run test        # Run test suite
   ```

5. **Submit a pull request**

### Code Standards

- **TypeScript**: Strict mode enabled, full type coverage
- **Components**: Functional components with hooks
- **Styling**: Tailwind CSS with semantic class names
- **API**: RESTful endpoints with Zod validation
- **Testing**: Jest + React Testing Library

### Project Structure Guidelines

- Keep components small and focused
- Use custom hooks for reusable logic
- Implement proper error boundaries
- Follow accessibility best practices

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

```
MIT License

Copyright (c) 2024 Knowledge Hub Project

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.
```

## 📞 Contact & Support

### Getting Help

- **📖 Documentation**: Check this README and inline code comments
- **🐛 Bug Reports**: [Create an issue](https://github.com/user/knowledge-hub/issues/new?template=bug_report.md)
- **💡 Feature Requests**: [Request a feature](https://github.com/user/knowledge-hub/issues/new?template=feature_request.md)
- **💬 Discussions**: [Join the discussion](https://github.com/user/knowledge-hub/discussions)

### Maintainer

**Your Name**
- GitHub: [@username](https://github.com/username)
- Email: your.email@example.com
- LinkedIn: [Your Profile](https://linkedin.com/in/yourprofile)
- Portfolio: [your-portfolio.com](https://your-portfolio.com)

### Acknowledgments

- **Radix UI** - For accessible component primitives
- **Tailwind CSS** - For utility-first styling
- **TanStack Query** - For powerful data synchronization
- **Lucide React** - For beautiful, consistent icons

---

<div align="center">

**⭐ Star this repository if it helped organize your learning journey! ⭐**

Built with ❤️ for lifelong learners and developers

</div>
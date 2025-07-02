# 🚀 LexiSort - AI-Powered Email Intelligence Platform

<div align="center">
  <img src="public/images/lexisort-high-resolution-logo-transparent.png" alt="LexiSort Logo" width="400"/>
  <p><em>Transform your email experience with intelligent organization, smart replies, and seamless calendar integration</em></p>
  
  [![Next.js](https://img.shields.io/badge/Next.js-15.3.0-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
  [![React](https://img.shields.io/badge/React-18.2.0-blue?style=for-the-badge&logo=react)](https://reactjs.org/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
  [![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-blue?style=for-the-badge&logo=postgresql)](https://www.postgresql.org/)
  [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)
  
  <p>
    <a href="#-key-features">Features</a> •
    <a href="#-smart-capabilities">AI Capabilities</a> •
    <a href="#-getting-started">Getting Started</a> •
    <a href="#-tech-stack">Tech Stack</a> •
    <a href="#-architecture">Architecture</a> •
    <a href="#-contributing">Contributing</a>
  </p>
</div>

---

## 🌟 Overview

LexiSort is a revolutionary AI-powered email platform that transforms how you manage, organize, and interact with your emails. Built with cutting-edge technology and designed for modern professionals, LexiSort combines intelligent automation with a beautiful, intuitive interface to make email management effortless.

### Why LexiSort?

- **🤖 AI-Powered Intelligence**: Advanced machine learning for email categorization and smart replies
- **🔒 Privacy-First Design**: End-to-end encryption with zero-knowledge architecture
- **⚡ Lightning Fast**: Optimized performance with real-time synchronization
- **🎨 Beautiful Interface**: Modern, responsive design built with Once UI
- **🔄 Seamless Integration**: Works perfectly with your existing Gmail account
- **📊 Smart Analytics**: Gain insights into your email patterns and productivity

---

## 🚀 Key Features

### 📧 Smart Inbox Organization
![Smart Inbox](public/images/landing/inbox.png)

**AI-powered inbox that automatically categorizes and prioritizes your emails:**
- Automatic email categorization by type and importance
- Smart filtering to reduce inbox clutter
- Intelligent sorting based on sender and content
- Customizable organization rules

### 🤖 AI-Powered Smart Reply
![Smart Reply](public/images/landing/smart_reply.png)

**Generate contextually appropriate email replies with just one click:**
- One-click smart reply generation
- Tone-matching responses
- Context-aware suggestions
- Professional formatting with proper etiquette

### 🏷️ Priority & Folder Filtering
![Priority Filter](public/images/landing/priority_filter.png)

**Advanced filtering system for better workflow management:**
- Priority-based email filtering (Urgent, High, Medium, Low)
- Custom folder creation and management
- Smart categorization by email type
- Quick access to important communications

### 📁 Intelligent Folder Management
![Folder Management](public/images/landing/folder_filter.png)

**Organize emails into intelligent folders that adapt to your workflow:**
- AI-suggested folder organization
- Automatic email routing
- Custom folder hierarchies
- Smart tagging and labeling

### 📅 Calendar Integration
![Calendar](public/images/landing/calendar.png)

**Seamlessly integrate your email with calendar events:**
- Email-to-calendar event creation
- Meeting scheduling from emails
- Calendar event reminders
- Integrated time management

### ⏰ Event Management
![Event Management](public/images/landing/calendar_event.png)

**Transform email conversations into calendar events:**
- Automatic date/time detection from emails
- One-click event creation
- Meeting participant management
- Event reminder integration

### ⚙️ User Customization
![User Customization](public/images/landing/user_custom.png)

**Personalize your email experience:**
- Customizable interface themes
- Personalized email templates
- Adaptive learning preferences
- User-specific AI training

### 🧠 AI Preferences & Insights
![AI Preferences](public/images/landing/ai_prefrence.png)

**Get intelligent insights about your email patterns:**
- Email pattern analysis
- AI behavior customization
- Communication style insights
- Productivity recommendations

### 📊 Analytics & Insights
![Analytics](public/images/landing/insight.png)

**Gain valuable insights into your email habits:**
- Email response time analytics
- Communication pattern insights
- Productivity metrics
- Performance optimization suggestions

---

## 🎯 Perfect For

<div align="center">
  <table>
    <tr>
      <td align="center">
        <strong>👔 Busy Professionals</strong><br/>
        Focus on high-priority communications without drowning in your inbox
      </td>
      <td align="center">
        <strong>👥 Team Leaders</strong><br/>
        Efficiently manage work communications with smart filters and AI organization
      </td>
    </tr>
    <tr>
      <td align="center">
        <strong>🔒 Privacy-Conscious Users</strong><br/>
        Keep your email data secure with our privacy-first approach
      </td>
      <td align="center">
        <strong>⚡ Gmail Power Users</strong><br/>
        Take your Gmail experience to the next level with AI-powered features
      </td>
    </tr>
  </table>
</div>

---

## 🛠️ Tech Stack

### Frontend
- **Next.js 15.3.0** - React framework with App Router
- **React 18.2.0** - UI library with hooks and concurrent features
- **TypeScript 5.0** - Type-safe JavaScript development
- **Once UI** - Modern component library with design system
- **TailwindCSS** - Utility-first CSS framework

### Backend & API
- **Next.js API Routes** - Serverless API endpoints
- **Prisma ORM** - Type-safe database client
- **BetterAuth** - Modern authentication solution
- **Gmail API** - Email integration and management

### Database & Storage
- **PostgreSQL 15** - Primary relational database
- **Redis** - Caching and session management
- **Qdrant Vector DB** - Vector storage for AI embeddings
- **Prisma Migrations** - Database schema management

### AI & Machine Learning
- **OpenRouter API** - LLM integration for smart features
- **Vector Embeddings** - Semantic search and similarity
- **Email Categorization** - AI-powered organization
- **Smart Reply Generation** - Context-aware responses
- **Priority Detection** - Intelligent email prioritization

### DevOps & Infrastructure
- **Docker Compose** - Local development environment
- **Environment Variables** - Secure configuration management
- **GitHub Actions** - CI/CD pipeline (configurable)

---

## 🏗️ Architecture

```
LexiSort/
├── src/
│   ├── app/                          # Next.js App Router
│   │   ├── (auth)/                   # Authentication pages
│   │   │   ├── login/               # Login interface
│   │   │   └── register/            # Registration interface
│   │   ├── (main)/                  # Main application
│   │   │   ├── inbox/               # Email inbox views
│   │   │   ├── calendar/            # Calendar integration
│   │   │   ├── contacts/            # Contact management
│   │   │   └── profile/             # User settings
│   │   ├── (dev)/                   # Development tools
│   │   │   └── ai/                  # AI processing utilities
│   │   ├── api/                     # API routes
│   │   │   ├── auth/                # Authentication endpoints
│   │   │   ├── inbox/               # Email management
│   │   │   ├── smart-reply/         # AI reply generation
│   │   │   └── sync/                # Background synchronization
│   │   └── globals.css              # Global styles
│   ├── components/                  # Reusable UI components
│   │   └── Boxes/                   # Layout components
│   ├── libs/                        # Core libraries
│   │   ├── auth/                    # Authentication utilities
│   │   ├── db.ts                    # Database configuration
│   │   ├── env.ts                   # Environment variables
│   │   └── utils/                   # Utility functions
│   └── once-ui/                     # Design system components
├── prisma/                          # Database schema
│   └── schema.prisma               # Prisma schema definition
├── public/                          # Static assets
│   └── images/                      # Images and logos
└── docker-compose.yml              # Development environment
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js 18+** or **Bun 1.0+**
- **Docker** and **Docker Compose**
- **Git**

### Quick Start with Docker (Recommended)

```bash
# Clone the repository
git clone https://github.com/your-username/lexisort.git
cd lexisort

# Start all services
docker compose up -d

# Install dependencies
bun install

# Set up environment variables
cp .env.example .env.local

# Run database migrations
bunx prisma db push

# Start development server
bun run dev
```

### Manual Setup

```bash
# Clone the repository
git clone https://github.com/your-username/lexisort.git
cd lexisort

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local

# Configure your environment variables
# (See Environment Variables section below)

# Set up the database
npx prisma db push

# Start development server
npm run dev
```

### Environment Variables

Create a `.env.local` file with the following variables:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/lexisort"

# Redis
REDIS_URL="redis://localhost:6381"

# Authentication
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"

# Gmail API
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# AI Services
OPENROUTER_API_KEY="your-openrouter-api-key"

# Vector Database
QDRANT_URL="http://localhost:6333"
```

### Gmail API Setup

1. **Create Google Cloud Project**
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select existing one

2. **Enable Gmail API**
   - Navigate to APIs & Services → Library
   - Search for "Gmail API" and enable it

3. **Configure OAuth Consent Screen**
   - Go to APIs & Services → OAuth consent screen
   - Set user type to "External"
   - Add required scopes:
     ```
     https://www.googleapis.com/auth/gmail.readonly
     https://www.googleapis.com/auth/gmail.modify
     ```

4. **Create OAuth Credentials**
   - Go to APIs & Services → Credentials
   - Create OAuth 2.0 Client ID
   - Add authorized redirect URI: `http://localhost:3000/api/auth/callback/google`

5. **Update Environment Variables**
   - Add your client ID and secret to `.env.local`

---

## 🔒 Security Features

### Zero-Knowledge Architecture
- **Client-Side Encryption**: All sensitive data encrypted before server storage
- **User-Controlled Keys**: Only you can decrypt your email content
- **Data Isolation**: Emails remain secure even in case of server breach
- **Zero Server Access**: Server never sees unencrypted email content

### Encrypted Data
- ✅ Email body content
- ✅ Email subject lines
- ✅ Email snippets and previews
- ✅ Sender and recipient information
- ✅ AI metadata and preferences

### Compliance Ready
- **GDPR** - Data protection and privacy compliance
- **CCPA** - California consumer privacy compliance
- **HIPAA** - Healthcare data protection (with proper configuration)

---

## 📊 Performance & Scalability

### Optimizations
- **Background Syncing**: Real-time email synchronization
- **Intelligent Caching**: Redis-based caching for fast responses
- **Vector Search**: Efficient semantic search with Qdrant
- **Lazy Loading**: On-demand component and data loading
- **CDN Integration**: Fast static asset delivery

### Monitoring
- **Performance Metrics**: Response time and throughput monitoring
- **Error Tracking**: Comprehensive error logging and alerting
- **User Analytics**: Privacy-respecting usage analytics
- **Health Checks**: Automated system health monitoring

---

## 🤝 Contributing

We welcome contributions from the community! Here's how you can help:

### Development Setup

```bash
# Fork and clone the repository
git clone https://github.com/your-username/lexisort.git
cd lexisort

# Create a feature branch
git checkout -b feature/amazing-feature

# Install dependencies
npm install

# Start development environment
docker compose up -d
npm run dev

# Make your changes and test
npm run test
npm run lint

# Commit and push
git commit -m 'Add amazing feature'
git push origin feature/amazing-feature

# Create a Pull Request
```

### Contribution Guidelines

1. **Code Style**: Follow TypeScript and ESLint guidelines
2. **Testing**: Add tests for new features
3. **Documentation**: Update docs for API changes
4. **Security**: Follow security best practices
5. **Performance**: Consider impact on performance

### Areas for Contribution

- 🐛 **Bug Fixes**: Help improve stability
- ✨ **New Features**: Add innovative capabilities
- 📚 **Documentation**: Improve guides and examples
- 🎨 **UI/UX**: Enhance user experience
- 🔧 **DevOps**: Improve deployment and monitoring
- 🌐 **Internationalization**: Add language support

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **Next.js Team** - For the amazing React framework
- **Prisma Team** - For the excellent ORM
- **OpenRouter** - For AI capabilities
- **Gmail API** - For email integration

---

# 🥬 FreshGift

A modern, AI-powered grocery delivery app specializing in fresh fruits and vegetables. Built with Next.js and featuring intelligent product recommendations to enhance your shopping experience.

## 🌟 Features .

...

### Core Functionality

- **📦 Product Catalog**: Curated selection of fresh fruits and vegetables with high-quality images, detailed descriptions, and competitive pricing
- **🛒 Shopping Cart**: Intuitive cart management with quantity adjustments and real-time price calculations
- **📋 Order Placement**: Streamlined checkout process with delivery address and time slot selection
- **👤 User Account Management**: Complete user profiles with order history and saved delivery addresses
- **🤖 AI-Powered Recommendations**: Smart product suggestions using Google AI (e.g., suggest basil when adding tomatoes)

### User Experience

- **🎨 Modern Design**: Clean, fresh interface with green (#90EE90) primary theme
- **📱 Responsive Layout**: Optimized for desktop, tablet, and mobile devices
- **⚡ Fast Performance**: Built with Next.js 15 and Turbopack for lightning-fast development and production builds
- **🔍 Smart Search**: Find products quickly with intelligent search functionality

## 🛠️ Tech Stack

### Frontend

- **Framework**: Next.js 15.2.3 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS with custom design system
- **UI Components**: Radix UI primitives for accessibility
- **Icons**: Lucide React
- **State Management**: Zustand
- **Forms**: React Hook Form with Zod validation

### Backend & AI

- **AI Integration**: Google AI with Genkit framework
- **Database**: Firebase
- **Data Fetching**: TanStack Query with Firebase integration
- **Authentication**: Firebase Auth

### Development Tools

- **Build Tool**: Turbopack (Next.js)
- **Package Manager**: npm
- **Linting**: ESLint
- **Type Checking**: TypeScript

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Firebase project (for backend services)

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd veggie-main
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env.local` file in the root directory:

   ```env
   # Firebase Configuration
   NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

   # Google AI Configuration
   GOOGLE_AI_API_KEY=your_google_ai_api_key
   ```

4. **Start the development server**

   ```bash
   npm run dev
   ```

5. **Start the AI development server** (in a separate terminal)
   ```bash
   npm run genkit:dev
   ```

The app will be available at `http://localhost:9002`

## 📝 Available Scripts

- `npm run dev` - Start development server with Turbopack on port 9002
- `npm run build` - Build the application for production
- `npm run start` - Start the production server
- `npm run lint` - Run ESLint for code quality
- `npm run typecheck` - Run TypeScript type checking
- `npm run genkit:dev` - Start Genkit AI development server
- `npm run genkit:watch` - Start Genkit AI server with file watching

## 🎨 Design System

### Color Palette

- **Primary**: Fresh Green (#90EE90) - Evokes freshness and health
- **Background**: Off-white (#FAFAFA) - Clean backdrop for product images
- **Accent**: Light Orange (#FFB347) - Call-to-action buttons and highlights
- **Text**: Modern sans-serif fonts for optimal readability

### UI Principles

- Grid-based product layouts inspired by modern grocery apps
- Subtle hover effects and smooth transitions
- Outline-style icons for navigation clarity
- Mobile-first responsive design

## 📁 Project Structure

```
src/
├── ai/              # AI integration and Genkit configuration
├── app/             # Next.js App Router pages and layouts
├── components/      # Reusable UI components
├── hooks/           # Custom React hooks
└── lib/             # Utility functions and configurations
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- UI components from [Radix UI](https://www.radix-ui.com/)
- AI powered by [Google AI](https://ai.google.dev/)
- Icons by [Lucide](https://lucide.dev/)

---

**Happy Shopping! 🛒🥕**
# freshgift-frontend

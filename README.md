# POWERGRID Centralized IT Helpdesk

A modern, AI-powered IT helpdesk system that consolidates ticketing from multiple platforms into a unified interface. The system supports chatbot interaction, web-based ticket management, and intelligent ticket resolution assistance.

## Technologies Used

### Core Technologies
- React v19.1.1
- TypeScript
- Vite v6.2.0

### UI/Styling
- Tailwind CSS
- Responsive Design
- Custom SVG Icons

### Advanced NLP & Speech Processing
- Natural Language Processing Engine
- Voice-to-Text Integration
- Intelligent Intent Recognition
- Multi-language Support

### Data Visualization
- Recharts v3.2.1

## Features

- 🔐 **Role-based Access Control**
  - User Dashboard
  - Admin Dashboard
  - Technician Dashboard

- 🎯 **Intelligent Processing Features**
  - Voice-enabled ticket creation
  - NLP-based ticket classification
  - Advanced query understanding
  - Automated response generation
  - Real-time speech recognition

- 🎫 **Ticket Management**
  - Multi-source ticket integration (GLPI, Solman, Email, Web)
  - Priority and status tracking
  - Comment system
  - Real-time updates

- 📊 **Interactive Dashboards**
  - Ticket analytics
  - Status tracking
  - Workload management

## Setup and Installation

### Prerequisites
- Node.js (Latest LTS version recommended)
- npm or yarn package manager

### Installation Steps

1. Clone the repository
```bash
git clone [repository-url]
cd powergrid-centralized-it-helpdesk
```

2. Install dependencies
```bash
npm install
```

3. Configure environment variables
Create a `.env.local` file in the root directory:
```env
NLP_API_KEY=your_nlp_service_key_here
SPEECH_API_KEY=your_speech_service_key_here
```

4. Start the development server
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## Build for Production

```bash
npm run build
```

## Project Structure

```
powergrid-centralized-it-helpdesk/
├── components/
│   ├── Chatbot.tsx
│   ├── Login.tsx
│   └── TicketModal.tsx
├── pages/
│   ├── AdminDashboard.tsx
│   ├── TechnicianDashboard.tsx
│   └── UserDashboard.tsx
├── services/
│   ├── geminiService.ts
│   └── mockData.ts
└── [configuration files]
```

## Contributing

Please read our contributing guidelines and code of conduct before submitting pull requests.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

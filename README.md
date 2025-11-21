# 🏭 Roll Coolant Tank Monitoring System (RCTMS)

> **Real-time Industrial HMI Dashboard for Coolant & Hydraulic System Management**

[![React](https://img.shields.io/badge/React-18.3-61DAFB?logo=react&logoColor=white)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Vite](https://img.shields.io/badge/Vite-5.4-646CFF?logo=vite&logoColor=white)](https://vitejs.dev)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![Status](https://img.shields.io/badge/Status-Complete-10B981)]()
[![License](https://img.shields.io/badge/License-MIT-blue)]()

---

## 🎯 Project Overview

RCTMS is a **comprehensive web-based Human-Machine Interface (HMI)** system designed for real-time monitoring and management of industrial roll coolant tank operations, hydraulic systems, equipment status, and alarm notifications. Built with modern web technologies, this application provides technicians with an intuitive dashboard for complex industrial process monitoring.

### 🌟 Key Highlights

- 📊 **Real-time Monitoring** - Live parameter tracking with instant updates
- 🚨 **Smart Alarm System** - Intelligent FIFO-based alarm queue with severity classification
- 🎛️ **Equipment Control** - Comprehensive pump and equipment status management
- 📈 **Advanced Analytics** - Data visualization with historical trend analysis
- 🏗️ **System Schematics** - Interactive hydraulic diagrams with legend documentation
- 🌓 **Dark Mode** - Seamless theme switching with persistent preferences
- 📱 **Fully Responsive** - Optimized for desktop, tablet, and mobile devices

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18+ or **Bun** package manager
- Modern web browser with ES2020+ support

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd RCTMS_Project

# Install dependencies
npm install
# or
bun install

# Start development server
npm run dev
# or
bun dev
```

The application will be available at **http://localhost:3000**

### Build for Production

```bash
# Build optimized production bundle
npm run build

# Preview production build locally
npm run preview
```

---

## 📋 Features & Modules

### 🔷 Six Specialized HMI Modules

#### 1. **Overview Dashboard (HMI-01B)** 📊
- Running coil data with specifications (ID, width, thickness, grade)
- Roll coolant tank parameters (level, temperature, concentration)
- Main hydraulic system metrics with real-time pressure and temperature
- Auxiliary hydraulic system status with synchronization indicators
- Interactive PID diagram with detailed system visualization

#### 2. **Hydraulic System (HMI-02)** 🔧
- Interactive SVG-based system schematics
- Mill hydraulic circuit with motor configurations
- Auxiliary hydraulic system layout
- Gear lubrication system overview
- Industry-standard symbol representation (ISO 1219)

#### 3. **Pump Operations (HMI-03)** ⚙️
- Equipment inventory management for 15+ devices
- Real-time operation status (idle, start, stop)
- Operation mode tracking (auto/manual)
- Monthly and cumulative run hours tracking
- Utilization percentage metrics
- Advanced filtering and search capabilities
- Configurable pagination (5-25 items per page)

#### 4. **Oil Cellar Monitor (HMI-04)** 🛢️
- Multi-area environmental monitoring
- Air Quality Index (AQI) tracking across 5 areas
- Lighting status management with matrix controls
- Environmental parameter visualization
- Temperature and humidity monitoring
- Customizable data parameter selection

#### 5. **Alarm Management (HMI-05)** 🚨
- Alarm history with 50+ simulated events
- Severity-based classification (critical, high, medium, low)
- Real-time alarm filtering and search
- Acknowledged vs. active alarm tracking
- Device identification and operator assignment
- Paginated alarm views with export capabilities
- Visual indicators with animated status updates

#### 6. **Reports (HMI-06)** 📑
- **Coolant Reports**: 48-day historical data with parameter trends
- **Oil Cellar Reports**: Environmental and occupancy tracking
- **Equipment Status Reports**: Pump utilization and performance metrics
- **Advanced Filtering**: Date-range selection and parameter customization
- **Data Export**: CSV and downloadable report generation

---

## 🛠️ Technology Stack

### **Frontend Architecture**
```
React 18.3          → Modern component-based UI framework
TypeScript 5.8      → Type-safe development environment
Tailwind CSS 3.4    → Utility-first CSS with custom industrial theme
shadcn-ui          → Accessible component library
Radix UI           → Low-level component primitives
```

### **State & Data Management**
```
TanStack Query     → Server state management & caching
React Context API  → Global alarm state management
React Router v6    → Client-side routing
localStorage API   → Persistent user preferences
```

### **Form & Validation**
```
React Hook Form    → Performant form handling
Zod               → TypeScript-first schema validation
```

### **Visualization & UI**
```
Recharts          → Interactive charts and graphs
Lucide Icons      → 500+ professional icons
Next-themes       → Dark mode implementation
Embla Carousel    → Responsive carousel component
```

### **Build & Development**
```
Vite 5.4          → Lightning-fast build tool
SWC               → Rust-based TypeScript transpiler
PostCSS           → CSS processing with Autoprefixer
ESLint            → Code quality and consistency
```

### **Industrial Design**
```
HX CODEYS v3.5 SP16 Patch 2    → Professional SCADA diagram creation
SVG Graphics                    → Precise system visualization
ISO 1219 Standards              → Hydraulic diagram compliance
```

---

## 📦 Project Structure

```
RCTMS_Project/
├── 📄 index.html                 # Application entry point
├── 📄 vite.config.ts             # Vite build configuration
├── 📄 tailwind.config.ts         # Tailwind CSS customization
├── 📄 tsconfig.json              # TypeScript configuration
│
├── 📁 src/
│   ├── 📄 main.tsx               # React application root
│   ├── 📄 App.tsx                # Root component with routing
│   ├── 📄 index.css              # Global styles
│   │
│   ├── 📁 components/
│   │   ├── AlarmContext.tsx      # 🚨 Global alarm state
│   │   ├── AlarmNotifier.tsx     # 📢 Real-time notifications
│   │   ├── AlarmFooter.tsx       # 📍 Alarm display footer
│   │   ├── Header.tsx            # 🎯 App header & controls
│   │   ├── Sidebar.tsx           # 🗂️ Navigation sidebar
│   │   ├── Layout.tsx            # 📐 Main layout wrapper
│   │   ├── DataCard.tsx          # 📊 Reusable data card
│   │   ├── GaugeDisplay.tsx      # 📈 Threshold gauge display
│   │   ├── StatusIndicator.tsx   # 🔴 Status visualization
│   │   ├── HydraulicSchematic.tsx # 🔧 System diagram
│   │   ├── PidDiagram.tsx        # 🔄 PID control diagram
│   │   ├── KpiStrip.tsx          # 📊 Performance indicators
│   │   └── ui/                   # 🎨 shadcn-ui components
│   │
│   ├── 📁 pages/
│   │   ├── OverviewNew.tsx       # 📊 Main dashboard
│   │   ├── HydraulicSystem.tsx   # 🔧 Hydraulic interface
│   │   ├── PumpOperations.tsx    # ⚙️ Equipment control
│   │   ├── OilCellarMonitor.tsx  # 🛢️ Oil cellar monitoring
│   │   ├── AlarmManagement.tsx   # 🚨 Alarm management
│   │   ├── Reports.tsx           # 📑 Reporting module
│   │   └── NotFound.tsx          # ❌ 404 error page
│   │
│   ├── 📁 hooks/
│   │   ├── use-mobile.tsx        # 📱 Mobile detection
│   │   └── use-toast.ts          # 🔔 Toast notifications
│   │
│   └── 📁 lib/
│       └── utils.ts              # 🔧 Utility functions
│
└── 📁 public/
    └── svgs/                     # 🎨 SVG symbols & diagrams
```

---

## 🎨 Design Features

### **Industrial UI Theme**
- Custom color scheme optimized for industrial environments
- Gradient backgrounds for status indicators
- Shadow and animation effects for visual feedback
- Professional typography with Inter and JetBrains Mono fonts
- Custom CSS variables for consistent theming

### **Responsive Design**
- Mobile-first approach with Tailwind CSS breakpoints
- Collapsible sidebar navigation for small screens
- Adaptive component layouts
- Touch-friendly button and control sizes
- Optimized viewport scaling

### **Dark Mode Support**
- Seamless theme switching with next-themes
- Persistent user preferences
- No flash of unstyled content (FOUC)
- CSS class-based theme application
- System theme detection support

### **Accessibility**
- Radix UI primitives for WCAG 2.1 compliance
- Keyboard navigation throughout
- ARIA labels and semantic HTML
- Color contrast compliance
- Focus management for keyboard users

---

## 🔧 Key Components

### **GaugeDisplay Component**
```tsx
// Real-time parameter visualization with threshold-based coloring
<GaugeDisplay
  label="Tank Level"
  value={87.3}
  unit="%"
  thresholds={{ warning: 30, danger: 15 }}
/>
```
- Animated progress bars
- Dynamic color transitions (green → orange → red)
- Min/max value displays
- Smooth CSS animations

### **AlarmContext Provider**
```tsx
// Global alarm state management with FIFO queue
const { acknowledged, addAcknowledged, removeAcknowledged } = useAlarmContext();
```
- 10-alarm buffer with overflow handling
- Subscription-based notification system
- localStorage persistence
- Memory leak prevention

### **DataCard Component**
```tsx
// Flexible data presentation with variant styling
<DataCard title="System Status" icon={Activity} variant="primary">
  {/* Content */}
</DataCard>
```
- Multiple variants (default, primary, success, warning, danger)
- Icon integration with Lucide
- Customizable styling and layout
- Shadow elevation effects

---

## 📊 Real-time Data Flow

```
┌─────────────────────────────────────────────────────────┐
│         Industrial Sensors & SCADA Systems              │
└──────────────────────┬──────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────┐
│      Backend API (Node.js / Express.js)                 │
│  - RESTful endpoints                                    │
│  - Multi-threaded data polling                          │
│  - Asynchronous metric processing                       │
└──────────────────────┬──────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────┐
│   TanStack Query (Caching & State Management)           │
│  - Intelligent caching                                  │
│  - Background refetching                                │
│  - Automatic synchronization                            │
└──────────────────────┬──────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────┐
│        React Components (Real-time Display)             │
│  - Dashboard metrics                                    │
│  - Live gauge visualizations                            │
│  - Alarm notifications                                  │
│  - Equipment status updates                             │
└─────────────────────────────────────────────────────────┘
```

---

## 🚨 Alarm Management System

### **Alarm Severity Levels**
- 🔴 **CRITICAL** - Immediate action required, system at risk
- 🟠 **HIGH** - Urgent attention needed, performance degradation
- 🟡 **MEDIUM** - Monitor closely, trending toward limits
- 🟢 **LOW** - Informational, non-critical status

### **Alarm Workflow**
1. **Detection** - System monitors parameters against thresholds
2. **Classification** - Alarm categorized by severity and device
3. **Notification** - Real-time alert with visual indicator
4. **Acknowledgment** - Operator confirms alarm receipt
5. **Recovery** - System records resolution time
6. **History** - Complete audit trail maintained

---

## 📈 Performance Optimizations

### **Frontend Optimization**
- React Query intelligent caching reduces API calls
- Component memoization prevents unnecessary re-renders
- Code splitting for optimal bundle size
- CSS-in-JS minimization with Tailwind
- SVG optimization for diagram rendering

### **Network Optimization**
- Normalized data structures minimize payload sizes
- Pagination for large datasets
- Efficient state management with Context API
- localStorage for client-side persistence

### **Build Optimization**
- Vite's fast bundling and HMR
- TypeScript compilation with SWC
- Tailwind CSS tree-shaking unused styles
- Production minification and compression

---

## 🎓 Learning Outcomes & Technical Skills

This project demonstrates proficiency in:

✅ **React Ecosystem**
- Advanced hooks (useContext, useCallback, useMemo)
- Component composition and reusability
- React Router for client-side navigation
- State management patterns

✅ **TypeScript Development**
- Strict type checking
- Generic type definitions
- Interface composition
- Advanced type utilities

✅ **Modern Styling**
- Tailwind CSS utility patterns
- Dark mode implementation
- Responsive design principles
- CSS animations and transitions

✅ **Industrial Systems**
- HMI/SCADA concepts
- Real-time monitoring patterns
- Alarm management systems
- ISO 1219 hydraulic standards

✅ **Data Visualization**
- Chart integration (Recharts)
- Custom gauge components
- SVG-based diagrams
- Interactive visualizations

✅ **Professional Development**
- Code quality and linting
- Form handling and validation
- Accessibility standards
- Performance optimization

---

## 🔮 Future Roadmap

### **Phase 2 - Backend Integration**
- [ ] Connect to live SCADA systems
- [ ] Real-time sensor data streaming
- [ ] WebSocket for bi-directional updates
- [ ] User authentication and authorization

### **Phase 3 - Advanced Analytics**
- [ ] Historical data persistence (PostgreSQL)
- [ ] Predictive maintenance algorithms
- [ ] Machine learning model integration
- [ ] Advanced trend analysis

### **Phase 4 - Mobile & Collaboration**
- [ ] React Native mobile application
- [ ] Multi-user real-time collaboration
- [ ] Offline capability with sync
- [ ] Push notifications for critical alerts

### **Phase 5 - Enterprise Features**
- [ ] PDF report generation
- [ ] Email alert notifications
- [ ] Role-based access control (RBAC)
- [ ] Audit logging and compliance
- [ ] API documentation (OpenAPI/Swagger)

---

## 🐛 Troubleshooting

### **Port Already in Use**
```bash
# Use custom port
npm run dev -- --port 3001
```

### **Module Resolution Issues**
```bash
# Clear node_modules and reinstall
rm -r node_modules
npm install
```

### **Build Errors**
```bash
# Clear Vite cache
rm -r .vite
npm run build
```

### **Theme Not Persisting**
- Check browser localStorage is enabled
- Verify next-themes configuration in main.tsx
- Clear browser cache and cookies

---

## 🤝 Contributing

This is an individual internship project. For future enhancements:

1. Maintain TypeScript strict mode
2. Follow component composition best practices
3. Update Tailwind CSS classes consistently
4. Ensure accessibility compliance
5. Synchronize system diagrams with HX CODEYS source files
6. Document API changes thoroughly

---

## 📝 Project Documentation

### **Key Files**
- [`INTERNSHIP_REPORT.md`](./INTERNSHIP_REPORT.md) - Comprehensive technical report
- [`README.md`](./README.md) - This file
- [`package.json`](./package.json) - Project dependencies
- [`tailwind.config.ts`](./tailwind.config.ts) - Theme configuration

### **External Documentation**
- [React Documentation](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [Vite Guide](https://vitejs.dev/guide)
- [shadcn-ui Components](https://ui.shadcn.com)

---

## 📊 System Requirements

| Requirement | Minimum | Recommended |
|-------------|---------|-------------|
| **Node.js** | 18.0.0 | 20.x.x LTS |
| **npm** | 9.x.x | 10.x.x |
| **RAM** | 4 GB | 8 GB |
| **Disk Space** | 500 MB | 2 GB |
| **Browser** | Chrome 90+ | Latest (Chrome, Firefox, Safari, Edge) |

---

## 📄 License

This project is developed as part of an internship program. Usage governed by institutional policies.

---

## 👨‍💼 Project Information

| Property | Value |
|----------|-------|
| **Project Type** | Web-based HMI System |
| **Status** | ✅ Complete |
| **Development Duration** | Internship Period |
| **Tech Stack** | React, TypeScript, Tailwind CSS, Vite |
| **Build Tool** | Vite 5.4 |
| **Package Manager** | npm / Bun |
| **Diagram Tool** | HX CODEYS v3.5 SP16 Patch 2 |
| **Standards** | ISO 1219-1:2012 (Hydraulic Systems) |

---

## 🎉 Deployment

### **Local Preview**
```bash
npm run preview
```

### **Production Build**
```bash
npm run build
# Build output in ./dist directory
```

### **Deploy to Hosting**
```bash
# Example: Deploy to Vercel
vercel --prod

# Example: Deploy to Netlify
netlify deploy --prod --dir=dist
```

---

<div align="center">

### 🚀 Ready to Monitor Your Industrial Systems?

[🔼 Back to Top](#-roll-coolant-tank-monitoring-system-rctms)

**Built with ❤️ during Internship | Powered by Modern Web Technologies**

![React](https://img.shields.io/badge/-React-61DAFB?logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/-TypeScript-3178C6?logo=typescript&logoColor=white)
![Tailwind](https://img.shields.io/badge/-TailwindCSS-06B6D4?logo=tailwindcss&logoColor=white)
![Vite](https://img.shields.io/badge/-Vite-646CFF?logo=vite&logoColor=white)

</div>

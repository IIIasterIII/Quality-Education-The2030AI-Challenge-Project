---
title: "Cognito"
category: "Full Stack Web Dev"
technologies: [
  "Next.js", "React", "TypeScript", "Redux Toolkit", "Tailwind CSS", "Shadcn/UI", 
  "Framer Motion", "React Flow", "Tiptap", "KaTeX", "Plotly.js", "React Force Graph",
  "FastAPI", "PostgreSQL", "Firebase", "AWS S3", "SQLAlchemy"
]
---

# Project Description

**Cognito** is an advanced AI-powered cognitive lab engineered for reinforced learning, systematic note-taking, and knowledge mastery. 
The platform empowers users to build deep, structural connections between subjects, generate complex, interactive learning roadmaps automatically via Artificial Intelligence, write rich, math (with automatic cloud image syncing), and visualize mathematical and conceptual paradigms dynamically in real-time. 

![Main Page](/MainPage.png)

# Technology Stack

## Frontend (Client-side)

*   **Next.js**: Powers the entire frontend, combining Server-Side Rendering (SSR) for blazing initial loads, and optimized Client Components for interactivity.
*   **React & TypeScript**: The core robust foundation for building deeply nested, interactive user interfaces with complete type safety.
*   **Redux**: Employed for deeply nested state synchronization, maintaining a single source of truth for user models across the app.
*   **Tailwind CSS**: A utility-first CSS framework managing consistent, highly customized styling paradigms. Enables effortless implementation of glassmorphism traits, complex grids, and responsive layouts.
*   **Framer Motion**: Handles complex orchestration of micro-animations, loading sequences, and component transitions, delivering a truly premium, buttery-smooth UX state.
*   **Shadcn/UI**: A collection of reusable UI components that are built on top of Tailwind CSS and Radix UI.
*   **React Flow (xyflow)**: The engine beneath the "Roadmap Architect", providing canvas zoom, pan, and sophisticated node connecting algorithms out of the box.
*   **Tiptap**: An entirely headless, highly modular rich-text framework customized for the "Notes Editor". Contains specialized extensions for floating menus and deeply integrated logic for drag-and-drop cloud images.
*   **KaTeX & Rehype**: Built into the markdown/rich-text pipeline to parse LaTeX syntax (`$$x^2$$`) and render beautiful math expressions seamlessly alongside regular text.
*   **Plotly.js**: Utilized within the Math Workbench for high-fidelity, real-time plotting of interactive mathematical charts.
*   **React Force Graph(2D)**: Advanced canvas and WebGL renderers driving the Knowledge Graphs, giving concepts independent physics to organize automatically on-screen.
*   **Lucide React**: Supplies lightweight, crisp, and beautifully styled SVG iconography throughout the ecosystem.

## Backend (Server-side)

*   **FastAPI**: A high-performance Python framework.
*   **PostgreSQL**: The deeply relational database driving the architecture. Stores users, roadmap nodes/edges, recursive (parent/child) note hierarchies, and user metrics.
*   **SQLAlchemy**: An advanced Python ORM acting as the bridge between Postgres and FastAPI. Handles complex joins and cascades.
*   **Uvicorn**: An ASGI web server implementation serving up the FastAPI instance with unparalleled speed.
*   **Firebase Authentication**: The gold standard for secure identities. Manages Google OAuth logic. Emits secure ID tokens which the backend validates.
*   **AWS S3 (boto3)**: Integrated directly for asset hygiene. When a user pastes an image into a note, it bypasses the DB and lives in an S3 bucket.

---

# Functionality: Full Ecosystem Cycle

## 1. Guest (Auth & Onboarding)

*   **Premium Landing & Auth Layout**: A visually striking, animated landing sequence. The authentication page is a beautifully split interface incorporating vibrant visuals alongside a minimalist `framer-motion` powered form.
*   **Dual Authentication Logic**: Users can create an account organically via an Email address and Password, or via a streamlined one-click **Sign in with Google** button. Both methods speak simultaneously to Firebase and your Postgres database, ensuring user creation logic is perfectly synchronized.
*   **HttpOnly Token Passing**: Upon logging via Firebase, a token is intercepted via the `router.ts` API. A backend server securely validates this token and sets an `HttpOnly` and `Secure` cookie. If the user returns a week later, they are instantly logged in without prompt.

![Auth Screen](/AuthScreen.png)

## 2. Core Functional Hubs

The massive interior dashboard (located at `/app`) acts as an OS for cognitive enhancement, split across multiple dedicated systems:

### Roadmap Architect (`/app/roadmaps`)
A fully interactive canvas for planning learning trajectories.
*   **AI-Autonomous Generation**: Enter a target subject (e.g., "Learn Quantum Mechanics"), and the integrated AI API builds a completely tailored, step-by-step roadmap. The AI outputs a JSON structure defining nodes (topics) and edges (connections).
*   **Interactive Node Canvas**: Using `react-flow`, users can interact with these nodes. You can drag them, zoom across a massive canvas, and double-click to view the precise description of what that specific topic means.
*   **Real-time Saving & Publishing**: Users can save a roadmap draft. They can upload custom thumbnails explicitly for that roadmap, rename it, and flip a toggle making it "Public", which instantly pushes it to the Community Hub.

![Roadmap Architect](/RoadmapArchitect.png)

### The Notes Ecosystem (`/app/notes`)
Not just a text box, but a complex, infinite-depth tree system simulating a physical brain.
*   **Infinite Subnotes**: Unlike flat notes apps, in Cognito, any Note can have a "Subnote", which can have another "Subnote", and so on. This represents subjects, modules, and lessons effectively.
*   **Rich Text Editor (Tiptap)**: Allows comprehensive text formatting via a custom-designed floating menu. Users can highlight, bold, list, and style text beautifully.
*   **Integrated KaTeX**: Mathematical mastery! Whenever a user types LaTeX formulas (e.g., `$$ f(x) = ax^2 + bx + c $$`), it instantly renders as a beautiful, textbook-quality math equation inside the notes.
*   **Drag & Drop Cloud Images**: Users can drop `png` or `jpg` images explicitly into the document. A loader appears gracefully as the image uploads directly into the AWS S3 cloud bucket and places the final URL immediately back into the document. 
*   **Storage Hygiene**: Every time the editor saves, the backend cross-references the current images in the text against the images assigned to that note ID in the database. Orphaned images are brutally purged from the S3 bucket to save space natively.
*   **Debounced Autosave**: Automatic background saving occurs via an optimized 1.5-second debounce system. You never have to hit "Save".

![Notes Editor](/NotesEditor.png)

### Knowledge Graphs (Graph Hub) (`/app/graph`)
Visualization tools mapping out how your subjects connect.
*   **2D and 3D Visualizations**: Users can toggle between flat physics-based graphs and fully rotational, zoomable 3D orbital graphs.
*   **Physics Engine**: Powered by WebGL and Web-Canvas force engines. The nodes representing notes/roadmaps physically repulse and attract each other optimally in real time to form natural clustering shapes, helping visualize core concepts visually.
*   **Hover Interactivity**: Nodes highlight gracefully upon hovering, drawing direct lines exclusively to their connected topics to map dependencies efficiently.

![Knowledge Graph 3D](/KnowledgeGraph.png)

### Math Workbench (`/app/notes/math`)
A specialized sandbox designed strictly to visualize pure mathematics contextually.
*   **Real-time Rendering Algorithms**: Built using Plotly. Users enter a raw core formula (e.g., standard parabolic equations).
*   **Interactive Parameter Sliders**: Users can adjust specific parameters (like setting `a = 5` and `b = 2`). The component performs a live regex replacement string on the formula.
*   **Live Recharts Distortion**: When the user drags the slider, the backend math calculation loop instantly updates the coordinates on the grid, redrawing the sine wave or parabola seamlessly without dropping frames, allowing students to "feel" what variables realistically do to an equation.

### Community Hub & User Profiles (`/app/community` & `/app/profiles`)
The social aspect allowing the global sharing of knowledge graphs.
*   **Public Discovery Engine**: A beautiful grid mapping out every Roadmap set to "Public" across the entire database. Features hovering interaction, author badges, and customized thumbnails.
*   **Detailed Analytics Profile**: Inside a profile, users can see custom `Recharts` graphs depicting their total creation count, how many nodes they have learned, and visual graphs demonstrating user productivity trends over time natively.
*   **Author Pages**: Users can click directly on an author's name inside the community hub to traverse strictly to their dedicated portfolio, viewing everything they have publicly committed to the Cognito ecosystem.

---

# Installation & Setup

## 1. Backend (FastAPI) - Purely via Docker

The backend is fully containerized, making deployment perfectly isolated and seamless.

1. Navigate to the backend directory:
   ```bash
   cd apps/backend
   ```
2. Create your local environment variables file based on the example:
   ```bash
   cp .env.example .env
   ```
   *Fill in your Postgres URL, JWT Secret, Firebase Service JSON, and AWS keys.*
3. Launch the complete backend using Docker Compose:
   ```bash
   docker-compose up -d --build
   ```
   *The FastAPI server will now be running on `http://localhost:8000`.*

## 2. Frontend (Next.js)

1. Navigate to the frontend directory:
   ```bash
   cd apps/web
   ```
2. Create your local environment variables file based on the example:
   ```bash
   cp .env.example .env.local
   ```
   *Fill in your Firebase Public credentials.*
3. Install dependencies:
   ```bash
   npm install
   ```
4. Run the development server with Turbopack:
   ```bash
   npm run dev
   ```
   *Your Next.js app will be running on `http://localhost:3000`.*

# 🛍️ Store Constructor Platform

An advanced platform for creating and managing online stores. Built with Vue 3, Vuetify, and Pinia.

## ✨ Features

- **🏪 Store Management**: Create multiple stores, manage settings, and switch between them instantly.
- **🎨 Visual Builder**: Drag-and-drop / iframe-based store builder to customize themes and content.
- **📦 Product Management**: Full product catalog, brand management, and fast product creation flows.
- **💰 Finance & Balance**: Real-time balance tracking, transaction history (mocked), and payout requests.
- **🛒 Storefront Engine**: Built-in storefront preview system (`/shop/...`) for testing customer experience.
- **🔐 Secure Authentication**: Email-based OTP login system with JWT session management.

## 🛠 Tech Stack

- **Framework**: [Vue 3](https://v3.vuejs.org/) (Composition API)
- **UI Component Library**: [Vuetify 3](https://vuetifyjs.com/)
- **State Management**: [Pinia](https://pinia.vuejs.org/)
- **Routing**: [Vue Router 4](https://router.vuejs.org/)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **HTTP Client**: Custom `ApiService` wrapper around native `fetch`.

## 🚀 Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- npm or yarn

### Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/H3nta123/frontend.git
    cd frontend/frontend-dist
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

3.  **Environment Configuration**
    Create a `.env` file in the root directory if it doesn't exist. This manages the connection to the backend service (often via a tunnel).
    ```env
    # Example .env content
    VITE_BACKEND_URL=http://your-backend-tunnel-url.com/
    ```

### Running Locally

Start the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:3000`.

## 📂 Project Structure

```
src/
├── components/      # Reusable UI components (AuthCard, ProductForm, etc.)
├── layouts/         # Layout definitions (MainLayout, AuthLayout, ShopLayout)
├── pages/           # File-based routing pages (optional, mostly using views)
├── services/        # API clients and business logic services
│   ├── api.ts       # Unified API client implementation
│   └── sites.ts     # Site management service
├── stores/          # Pinia stores (Global state)
│   ├── auth.ts      # User authentication & balance
│   ├── shop.ts      # Current shop configuration
│   └── ...          # Other domain stores (products, cart, etc.)
├── views/           # Main application views linked to router
│   ├── shop/        # Storefront specific views (Catalog, Checkout, etc.)
│   ├── BuilderView  # Store builder interface
│   └── ...
└── App.vue          # Root component
```

## 🔌 Backend Integration

The frontend communicates with the backend via `/api/v1`.
See [backend_interface.md](./backend_interface.md) for detailed API documentation.

- **Authentication**: JWT-based (Access + Refresh tokens).
- **Proxy**: Vite is configured to proxy `/api` requests to the `VITE_BACKEND_URL` defined in `.env`.

# EsportTT - Customer Acquisition & Loyalty Platform

## Scenario
This project is a full-stack web application built for a college course integrating Data Structures, NoSQL Databases, and Business principles. The platform is themed around an esports community but is functionally designed as a **Customer Acquisition and Loyalty Funnel**.

It guides new users ("leads") through a journey from an aspiring rookie to a seasoned champion. Players level up through experience tiers by completing personalized tutorials and quests, which in turn unlocks exclusive tournaments, demonstrating a complete sales and customer loyalty lifecycle.

## Setup and Installation

1.  **Clone the repository.**
2.  Navigate into the project's `frontend` directory.
3.  **Install dependencies:**
    ```bash
    pnpm install
    ```
4.  **Set up Environment Variables:**
    Create a file named `.env.local` in the `frontend` root directory and add your credentials:
    ```
    # MongoDB
    MONGODB_URI=YOUR_MONGODB_CONNECTION_STRING

    # Firebase
    NEXT_PUBLIC_FIREBASE_API_KEY=YOUR_API_KEY
    NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=YOUR_AUTH_DOMAIN
    NEXT_PUBLIC_FIREBASE_PROJECT_ID=YOUR_PROJECT_ID
    NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=YOUR_STORAGE_BUCKET
    NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=YOUR_MESSAGING_SENDER_ID
    NEXT_PUBLIC_FIREBASE_APP_ID=YOUR_APP_ID
    ```
5.  **Run the development server:**
    ```bash
    pnpm run dev
    ```
    The application will be available at `http://localhost:3000`.

## Features

This project was built to satisfy a comprehensive list of requirements integrating Business, Data Structures, and NoSQL Database concepts.

### 1. Customer Acquisition to Loyalty
* **Lead-capture form that stores prospects in MongoDB.**
    * **How it's integrated:** The `/register` page serves as our lead-capture form. When a new user signs up, their data is sent to the `/api/register` endpoint and stored as a new document in the `players` collection in MongoDB.

* **Lead-qualification engine using a Priority Queue.**
    * **How it's integrated:** The `/api/leads/priority` endpoint fetches all players ("leads") and uses a `PriorityQueue` class to sort them. Players with a "Gold Tier" experience level are given the highest priority, and the results are displayed on the `/admin/leads` page.

### 2. Sales Funnel & CRM
* **Move leads through stages: Prospect → Qualified → Customer → Loyal.**
    * **How it's integrated:** This is the core concept of the user journey. A user progresses from a `Prospect` (new signup), to `Qualified` (engages with tutorials), to `Customer` (joins a tournament), and finally to `Loyal` (completes quests).

* **Use Hashing to detect duplicate customers.**
    * **How it's integrated:** The `/api/register` endpoint uses a **hashing function** on the user's email during registration. It checks the database for an existing `emailHash` before creating a new user, preventing duplicate accounts.

### 3. Business Metrics Dashboard
* **Real-time dashboard powered by Firebase.**
    * **How it's integrated:** The project uses **Firebase Authentication** for secure user management. The Admin Dashboard at `/admin` fetches and displays key business metrics on demand from our MongoDB database.

* **MongoDB Aggregation Pipelines for RFM, CLV, and NPS.**
    * **How it's integrated:** The project has dedicated API routes in `src/app/api/metrics/`. Each route (`/rfm`, `/clv`, `/nps`) uses a specific **MongoDB Aggregation Pipeline** to perform complex calculations. The results are displayed on the `/admin` dashboard.

### 4. Operations Module
* **Simple order and inventory tracking.**
    * **How it's integrated:** We model tournament entries as "orders." Each entry is stored in the `tournament_entries` collection. The `/admin/operations` page serves as an "Order Tracking" dashboard, displaying a log of all recent tournament sign-ups.

### 5. Algorithms & Data Structures Focus
* **Balanced BST / Heap – product search or recommendations.**
    * **How it's integrated:** This concept is applied to the **Tutorial Recommendation** system. On the homepage, tutorials are filtered based on the player's experience tier, a design based on the principle that a BST would be used at scale for highly efficient, skill-based content retrieval.

* **Graph / BFS / DFS – referral network analysis.**
    * **How it's integrated:** The project is designed for this with the `referralNetworkAnalyzer.js` library file. The concept is to model player-to-player invitations as a social graph, where a **Breadth-First Search (BFS)** would be used to visualize referral chains.
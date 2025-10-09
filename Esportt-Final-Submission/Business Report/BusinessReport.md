**Name:** Sahil Shah
**Roll Number:** 150096724032
**Problem Statement:** Dynamic Game Personalizer Tutorial

---

### Easy Navigations:

* **Deployed Link:** [EsportTT Platform](https://esportt.vercel.app/)
* **Business Report:** [EsportTT Business Report - Sahil Shah](https://docs.google.com/document/d/11Z3u_nSxS61Lw9hCiN-hGDOhTkPSXt8d9sDq7Khqj7U/edit?usp=sharing)
* **Repository Link:** [EsportTT Repository](https://github.com/BeingSeight/Esportt)

---

# EsportTT: A Business Report on the Customer Acquisition & Loyalty Funnel

## 1. The Full Customer Journey: From Acquisition to Loyalty

The EsportTT platform is designed around a four-stage customer journey, guiding a player from their first visit to long-term loyalty. This funnel allows us to attract, engage, convert, and retain users in a structured and measurable way.

### 1.1. Acquisition (The Prospect)
The customer journey on EsportTT begins at the Acquisition stage, where a potential user first discovers our platform. At this point, the individual is considered a **Prospect**. The primary touchpoint for acquisition is our "Lead Capture Form" (the registration page), where we securely collect their name, email, and self-assessed skill tier (Bronze, Silver, or Gold) using **Firebase Authentication**. To maintain data integrity, a **Hashing algorithm** is used on the backend to prevent the creation of duplicate accounts.

### 1.2. Qualification (The Qualified Lead)
A Prospect becomes a **Qualified Lead** when they begin actively engaging with the platform, such as by watching their first tutorial. On the backend, a **Priority Queue** algorithm ranks new leads based on their skill tier, allowing the business to focus engagement efforts on high-potential users (e.g., Gold Tier players). On the frontend, the user's dashboard immediately presents a "Recommended For You" section, which uses the concept of a **BST (Binary Search Tree)** to efficiently filter and suggest tutorials that match their specific skill level.

### 1.3. Conversion (The Customer)
A Qualified Lead converts into a **Customer** when they join their first tournament. This action is the core "purchase" in our business model, signifying a deep level of commitment. Each tournament entry is logged as an "order" in our `tournament_entries` collection in MongoDB, allowing us to track conversion rates and gather data for our operations plan.

### 1.4. Loyalty (The Champion)
The final stage is turning a Customer into a **Champion**—a loyal, repeat user. This is driven by our **Profile & Quests System**. On their profile page, users see a clear path to progression with quests tailored to their tier and a dynamic progress bar to track completion. This gamified progression loop fosters long-term engagement and loyalty.

> **[INSERT FUNNEL DIAGRAM HERE]**
> *(A visual diagram showing four stages: Acquisition → Qualification → Conversion → Loyalty. Label each stage with its corresponding user action: "Signs Up" → "Engages with Tutorials" → "Joins a Tournament" → "Completes Quests.")*

## 2. The Business Metrics Dashboard

The Admin Dashboard provides a real-time overview of the platform's health by using **MongoDB Aggregation pipelines** to calculate key business metrics.

> **[INSERT SCREENSHOT OF THE ENTIRE ADMIN DASHBOARD INTERFACE HERE]**
> *(Include a full-page screenshot of `http://localhost:3000/admin` showing all the metric cards and the RFM table.)*

### 2.1. RFM Segmentation
RFM (Recency, Frequency, Monetary) is a model used to identify our most valuable customers. Our system calculates this by analyzing player data for:
* **Recency:** How recently the player logged in (calculated from the `createdAt` field).
* **Frequency:** How often they play (using the `loginCount` field).
* **Monetary:** How much they have "spent" (using the `totalSpent` field).

This allows us to segment players into groups like "Champions" (high scores in all three) or "At Risk" (high frequency but low recency).

### 2.2. Net Promoter Score (NPS)
NPS measures customer satisfaction and loyalty. We collect this data via a simple "How likely are you to recommend us?" form on the user's homepage. The backend aggregation pipeline categorizes responses into Promoters (score 9-10), Passives (7-8), and Detractors (0-6) and calculates the final NPS score using the formula: `(% Promoters - % Detractors)`.

### 2.3. Customer Lifetime Value (CLV)
CLV predicts the net profit attributed to the entire future relationship with a customer. Our model provides a simplified CLV by running a MongoDB Aggregation to calculate the average `totalSpent` across all players, giving us a clear view of the average monetary value of a user.

## 3. Sales Funnel Description and Operations Plan

### 3.1. Sales Funnel Summary
Our sales funnel is designed to systematically convert new visitors into loyal champions. We attract users with the promise of skill development, qualify them through initial engagement with personalized content, convert them through the core offering of competitive tournaments, and retain them with a rewarding progression and quest system.

### 3.2. Operations Plan
Our core operational metric is **Tournament Entry Tracking**. This functions as our "order management" system. Every time a user joins a tournament, a document is created in the `tournament_entries` collection. The Operations page on the admin dashboard displays a real-time log of these entries, allowing us to monitor platform activity and track the popularity of specific tournaments.

> **[INSERT SCREENSHOT OF THE OPERATIONS PAGE: `http://localhost:3000/admin/operations` HERE]**

## 4. Brand-Building and Reputation-Management Strategy

### 4.1. Building the EsportTT Brand
The EsportTT brand is built on the promise of **"A Clear Path to Mastery."** Unlike other platforms that only focus on the top 1% of players, our brand is inclusive, providing a structured pathway for players of all skill levels to improve. This is communicated through our tier system, personalized tutorial recommendations, and the quest system, which all provide a tangible sense of progression and accomplishment.

### 4.2. Reputation Management
Our reputation is managed proactively by listening to our community. The **NPS survey** is our primary tool for this. By constantly monitoring the NPS score on the admin dashboard, we can get an instant, quantitative measure of player satisfaction. A drop in the NPS score serves as an early warning system, alerting us to potential issues in the community or with the platform so we can address them before they harm our reputation.
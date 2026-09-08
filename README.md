# Student Startup Crowdfunding & Seed Pledge Portal

A campus-focused platform for student startup campaigns and simulated seed pledges.

## Tech Stack
- Frontend: HTML5, CSS3 (Vanilla + Grid), JavaScript (Vanilla + Fetch API)
- Backend: Java 17, Spring Boot 3, Spring Data JPA, Hibernate, REST API
- Database: MySQL 8.0

## Setup Instructions

1. **Database Setup**
   Ensure MySQL is running on port 3306.
   Create the database by running the following SQL command:
   ```sql
   CREATE DATABASE crowdfunding_db;
   ```
   *Note: The application will automatically create the tables via Hibernate.*

2. **Run the Application**
   From the project root directory, run:
   ```bash
   .\gradlew.bat bootRun
   ```
   Or open the project in your IDE (IntelliJ IDEA / VS Code) and run the `CrowdfundingPortalApplication` main class.

3. **Access the Portal**
   Open your browser and navigate to:
   [http://localhost:8080](http://localhost:8080)

## Features
- **Student Founders**: Create pitches, set target amounts, add pitch videos, and post milestone updates.
- **Backers**: Browse campaigns, make simulated micro-pledges, and view the backer wall.
- **Admin**: View all campaigns, monitor progress, and track status.

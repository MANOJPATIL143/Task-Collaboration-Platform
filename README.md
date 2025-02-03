

# Task Collaboration Platform

A real-time Task Collaboration Platform that allows teams to create, assign, and manage tasks. The application supports real-time updates via WebSockets, user authentication using JWT, and provides a robust UI for managing tasks and teams.

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Installation](#installation)


## Features

1. **User Authentication**
   - Register with name, email, and password.
   - JWT-based login and logout.
   - Profile view and management.

2. **Task Management**
   - Create tasks with a title, description, due date, and priority (Low, Medium, High).
   - Assign tasks to team members.
   - Update task status (To Do, In Progress, Done).
   - Delete tasks.
   - Filter tasks by status, priority, or due date.

3. **Real-Time Collaboration**
   - Real-time task updates using WebSockets/Socket.IO.
   - Team members see task changes instantly when tasks are created, updated, or deleted.

4. **Team Management**
   - Create teams and invite users.
   - View all members of a team.
   - Assign tasks to specific team members.

## Tech Stack

- **Backend:**
  - Node.js
  - Express.js
  - MongoDB
  - Socket.IO (or WebSockets)
  - JSON Web Tokens (JWT) for authentication

- **Frontend:**
  - React.js
    - Ant Design


## Installation

### Prerequisites

- [Node.js](https://nodejs.org/) (v14 or later)
- [MongoDB](https://www.mongodb.com/) (running instance or MongoDB Atlas)
- [npm](https://www.npmjs.com/) 

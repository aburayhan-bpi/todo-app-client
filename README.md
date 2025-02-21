# Todo Task Management

## 🚀 Project Overview
Todo Task Management is a modern web-based task management application built using **React, Firebase, and MongoDB**. This application allows users to create, update, and manage their tasks efficiently. It features **drag-and-drop task organization**, real-time updates, user authentication, and a responsive UI.

## 🌍 Live Links
- **Live Demo:** [Your Deployed Link Here](https://todo-task-management-53f91.web.app)
- **Backend API:** [Your API Link Here](https://todo-task-management-server-omega.vercel.app)
- **GitHub Repository:** [GitHub Repo](https://github.com/aburayhan-bpi/todo-app-server.git)

## 🛠 Tech Stack
- **Frontend:** React, Vite, Tailwind CSS, React Router, React Query
- **Backend:** Express.js, MongoDB
- **Authentication:** Firebase
- **State Management:** React Query, React Hook Form
- **Drag & Drop:** DnD Kit, React DnD
- **Utilities:** Axios, Moment.js

## 🎯 Features
- ✅ **User Authentication** (Firebase Authentication)
- ✅ **Create, Edit, and Delete Tasks**
- ✅ **Drag-and-Drop Task Management**
- ✅ **Real-Time Database Syncing**
- ✅ **Categorization** (To-Do, In-Progress, Done)
- ✅ **Dark Mode Support**
- ✅ **Responsive Design**

## 🏗 Installation & Setup

### 1️⃣ Clone the Repository
```sh
git clone https://github.com/aburayhan-bpi/todo-app-client.git
cd todo-app-client
```

### 2️⃣ Install Dependencies
```sh
npm install
```

### 3️⃣ Start the Development Server
```sh
npm run dev
```
> The app will be available at `http://localhost:5173`

## 🔥 Environment Variables
Create a `.env.local` file in the root directory and add your Firebase config:
```
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```
🚨 **Important:** Never expose your `.env.local` file publicly or commit it to a repository. Add `.env.local` to your `.gitignore` file:
```sh
echo ".env.local" >> .gitignore
```

## 🚀 Deployment
For deployment, use:
```sh
npm run build
```
Then, deploy the `/dist` folder to **Vercel, Netlify, or Firebase Hosting**.

## 🛠 API Routes (Backend)
| Method | Endpoint | Description |
|--------|---------|-------------|
| GET | `/tasks` | Fetch all tasks |
| POST | `/tasks` | Add a new task |
| PUT | `/tasks/:id` | Update task details |
| DELETE | `/tasks/:id` | Delete a task |


## 🚧 Future Enhancements
- 🔄 **Notifications for task updates**
- 📅 **Due Date Reminders**
- 📊 **Task Analytics Dashboard**


---
Made with ❤️ by **Abu Rayhan** 🚀
Contribution is available!
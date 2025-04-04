# The Blood Link 🩸

[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Firebase](https://img.shields.io/badge/Firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)](https://firebase.google.com/)

The Blood Link is a comprehensive web application designed to bridge the gap between blood donors and recipients in need. This platform facilitates blood donation coordination by allowing users to register as donors, search for donors by blood group and location using a hierarchical location selection system (Division > District > Upazila), and contact them when needed.

## Features

- **User Authentication**: Secure login and registration with Firebase Authentication
- **Donor Registration**: Complete profile management for blood donors
- **Advanced Search**: Find donors by blood group and location with cascading dropdown selection
- **Hierarchical Location Selection**: Division > District > Upazila dropdown system
- **Admin Dashboard**: Manage users, view statistics, and update donor information
- **Contact System**: Reach out to donors through the platform
- **Responsive Design**: Fully functional on mobile, tablet, and desktop devices
- **Real-time Notifications**: Instant feedback using React Hot Toast

## Tech Stack

### Frontend
- **React.js**: UI component library
- **React Router DOM**: Client-side routing
- **Firebase Authentication**: User authentication
- **Tailwind CSS**: Utility-first CSS framework
- **React Icons**: Icon library
- **Axios**: HTTP client
- **React Hot Toast**: Toast notifications
- **React Fast Marquee**: Scrolling components

### Backend
- **Node.js**: JavaScript runtime
- **Express.js**: Web application framework
- **MongoDB**: NoSQL database
- **JSON Web Token**: Authentication
- **Cors**: Cross-origin resource sharing
- **Dotenv**: Environment variable management

## Project Structure

The project follows a client-server architecture:

1. **Client**: React frontend application with Vite
2. **Server**: Node.js/Express backend API

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- MongoDB Atlas account
- Firebase project

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/the-blood-link.git
   cd the-blood-link
   ```

2. Install dependencies for both client and server:
   ```bash
   # Install all dependencies (root, client, and server)
   npm run install-all
   ```

3. Set up environment variables:

   For the server, create a `.env` file in the server directory:
   ```
   DB_USER=your_mongodb_username
   DB_PASS=your_mongodb_password
   PORT=5000
   MONGODB_URI=mongodb+srv://your_mongodb_username:your_mongodb_password@your_cluster_url
   JWT_SECRET=your_jwt_secret_key
   ```

   For the client, create a `.env` file in the client directory:
   ```
   VITE_FIREBASE_API_KEY=your_firebase_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   ```

4. Start the development servers:

   ```bash
   # Run both client and server concurrently
   npm run dev

   # Or run them separately
   npm run server   # Starts the backend on port 5000
   npm run client   # Starts the frontend on port 5173
   ```

5. Open your browser and navigate to `http://localhost:5173` to see the application.

## Key Features in Detail

### Location Selection with Cascading Dropdowns

The application implements a three-level cascading dropdown system for location selection:
1. **Division**: Top-level administrative region
2. **District**: Sub-division regions
3. **Upazila**: Smaller administrative units

When a user selects a Division, the District dropdown automatically populates with relevant options. Similarly, selecting a District populates the Upazila dropdown.

### Admin Dashboard

The Admin Dashboard provides powerful user management capabilities:

- View comprehensive statistics about users and donors
- Filter and search users by various criteria
- Edit user information with the cascading location dropdowns
- View detailed user profiles
- Manage blood donation records

Admin access is restricted to authorized email addresses only.

## Deployment

The application is configured for deployment to Netlify (client) and Vercel (server).

### Client Deployment (Netlify)

1. Set up environment variables in Netlify:
   - All variables from `.env.production`
   
2. Configure build settings:
   - Base directory: `client`
   - Build command: `npm run build`
   - Publish directory: `dist`

### Server Deployment (Vercel)

1. Set up environment variables in Vercel:
   - `DB_USER`: MongoDB username
   - `DB_PASS`: MongoDB password
   - `MONGODB_URI`: MongoDB connection string
   - `JWT_SECRET`: JWT secret key

2. Configure build settings:
   - Root Directory: `server`

For detailed deployment instructions, see the [DEPLOYMENT.md](./DEPLOYMENT.md) file.

## Local Development

### Client

```bash
cd client
npm install
npm run dev
```

### Server

```bash
cd server
npm install
npm run dev
```

## Contributing

Contributions are welcome! Here's how you can contribute:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature-name`
3. Commit your changes: `git commit -m 'Add some feature'`
4. Push to the branch: `git push origin feature/your-feature-name`
5. Open a pull request

Please ensure your code follows the project's coding standards and includes appropriate tests.

## License

This project is licensed under the ISC License.

## Acknowledgements

- Bangladesh location data structure based on administrative divisions
- Blood donation eligibility rules based on medical standards
- UI design inspired by modern healthcare applications

---

Created with ❤️ for connecting blood donors with those in need. 
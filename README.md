# The Blood Link

The Blood Link is a web application that connects blood donors with those in need. It allows users to register as donors, search for donors by blood group and location, and contact them when needed.

## Features

- User authentication with Firebase
- Donor registration and profile management
- Search for donors by blood group and location
- Contact donors through the platform
- Responsive design for all devices

## Tech Stack

### Frontend
- React.js
- React Router DOM
- Firebase Authentication
- Tailwind CSS
- DaisyUI
- Axios
- React Hot Toast

### Backend
- Node.js
- Express.js
- MongoDB
- Cors
- Dotenv

## Project Structure

The project is divided into two main parts:

1. **Client**: Contains the React frontend application
2. **Server**: Contains the Node.js/Express backend application

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- MongoDB Atlas account
- Firebase project

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/the-blood-link.git
   cd the-blood-link
   ```

2. Install dependencies for both client and server:
```
# Install all dependencies (root, client, and server)
npm run install-all
```

3. Set up environment variables:

For the server, create or update the `.env` file in the server directory with the following variables:
```
DB_USER=your_mongodb_username
DB_PASS=your_mongodb_password
PORT=5000
MONGODB_URI=mongodb+srv://your_mongodb_username:your_mongodb_password@your_cluster_url
JWT_SECRET=your_jwt_secret_key
```

For the client, create or update the `.env` file in the client directory with your Firebase project details:
```
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

4. Start the development servers:

```
# Run both client and server concurrently
npm run dev

# Or run them separately
npm run server
npm run client
```

5. Open your browser and navigate to `http://localhost:5173` to see the application.

## Environment Variables

### Client Environment Variables

The client uses environment variables to securely store Firebase configuration. Create a `.env` file in the client directory with the following variables:

```
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

You can find these values in your Firebase project settings.

### Server Environment Variables

The server uses environment variables to securely store MongoDB credentials and other sensitive information. Create a `.env` file in the server directory with the following variables:

```
DB_USER=your_mongodb_username
DB_PASS=your_mongodb_password
PORT=5000
MONGODB_URI=mongodb+srv://your_mongodb_username:your_mongodb_password@your_cluster_url
JWT_SECRET=your_jwt_secret_key
```

## Security Best Practices

1. **Never commit .env files to version control**. They are already added to .gitignore.
2. **Use environment variables for all sensitive information** like API keys, database credentials, and secrets.
3. **Set up different environment variables for development and production**.
4. **Regularly rotate your secrets and API keys** for enhanced security.

## Deployment

### Backend Deployment
The backend can be deployed to platforms like Heroku, Render, or Vercel.

### Frontend Deployment
The frontend can be deployed to platforms like Netlify, Vercel, or Firebase Hosting.

## Deployment Instructions

### Client Deployment (Netlify)

1. Push your code to a GitHub repository
2. Log in to [Netlify](https://www.netlify.com/)
3. Click "New site from Git" and select your repository
4. Configure the build settings:
   - Build command: `npm run build`
   - Publish directory: `dist`
5. Add the following environment variables in Netlify's settings:
   - All variables from `.env.production`
6. Click "Deploy site"

The client is configured to handle client-side routing with the `_redirects` file and `netlify.toml` configuration.

### Server Deployment (Vercel)

1. Push your code to a GitHub repository
2. Log in to [Vercel](https://vercel.com/)
3. Click "New Project" and select your repository
4. Configure the build settings:
   - Root Directory: `server`
   - Framework Preset: `Other`
5. Add the following environment variables in Vercel's settings:
   - `DB_USER`: Your MongoDB username
   - `DB_PASS`: Your MongoDB password
   - `MONGODB_URI`: Your MongoDB connection string
   - `JWT_SECRET`: Your JWT secret key
6. Click "Deploy"

The server is configured with `vercel.json` to handle API routing and CORS.

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

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the ISC License.

## Connecting Client to Server

After deploying both client and server, update the client's `.env.production` file with the correct server URL:

```
VITE_API_URL=https://the-blood-link.vercel.app
``` 
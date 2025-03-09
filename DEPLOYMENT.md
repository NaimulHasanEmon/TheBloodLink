# Deployment Guide for The Blood Link

This document provides detailed instructions for deploying The Blood Link application to Netlify (client) and Vercel (server).

## Prerequisites

- GitHub account
- Netlify account
- Vercel account
- MongoDB Atlas account
- Firebase project

## Client Deployment (Netlify)

### Step 1: Prepare Your Client Application

1. Ensure your client application is working correctly locally.
2. Make sure you have the following files in your client directory:
   - `_redirects` file with `/* /index.html 200`
   - `netlify.toml` with proper configuration
   - `.env.production` with production environment variables

### Step 2: Deploy to Netlify

1. Push your code to a GitHub repository.
2. Log in to [Netlify](https://www.netlify.com/).
3. Click "New site from Git" and select your GitHub repository.
4. Configure the build settings:
   - Base directory: `client`
   - Build command: `npm run build`
   - Publish directory: `dist`
5. Click "Show advanced" and add the following environment variables:
   - All variables from your `.env.production` file
6. Click "Deploy site".

### Step 3: Configure Custom Domain (Optional)

1. In your Netlify site dashboard, go to "Domain settings".
2. Click "Add custom domain" and follow the instructions.
3. Set up HTTPS for your custom domain.

### Step 4: Verify Deployment

1. Visit your deployed site URL.
2. Test all functionality to ensure it works correctly.
3. Check that client-side routing works properly.

## Server Deployment (Vercel)

### Step 1: Prepare Your Server Application

1. Ensure your server application is working correctly locally.
2. Make sure you have the `vercel.json` file in your server directory with proper configuration.

### Step 2: Deploy to Vercel

1. Push your code to a GitHub repository.
2. Log in to [Vercel](https://vercel.com/).
3. Click "New Project" and select your GitHub repository.
4. Configure the project settings:
   - Framework Preset: `Other`
   - Root Directory: `server`
   - Build Command: `npm install`
   - Output Directory: `.`
5. Add the following environment variables:
   - `DB_USER`: Your MongoDB username
   - `DB_PASS`: Your MongoDB password
   - `MONGODB_URI`: Your MongoDB connection string
   - `JWT_SECRET`: Your JWT secret key
6. Click "Deploy".

### Step 3: Configure Custom Domain (Optional)

1. In your Vercel project dashboard, go to "Settings" > "Domains".
2. Add your custom domain and follow the instructions.
3. Vercel will automatically set up HTTPS for your domain.

### Step 4: Verify Deployment

1. Test your API endpoints using tools like Postman or directly from your client application.
2. Check that all routes are working correctly.
3. Verify that database connections are established properly.

## Connecting Client to Server

After deploying both client and server, update the client's `.env.production` file with the correct server URL:

```
VITE_API_URL=https://your-server-domain.vercel.app
```

Then redeploy the client application to Netlify.

## Troubleshooting

### Common Netlify Issues

1. **Routing Issues**: Ensure your `_redirects` file is being copied to the `dist` directory during build.
2. **Build Failures**: Check the build logs for errors and fix any issues in your code.
3. **Environment Variables**: Verify that all required environment variables are set correctly.

### Common Vercel Issues

1. **CORS Errors**: Ensure your server has proper CORS configuration to allow requests from your client domain.
2. **Database Connection Issues**: Check that your MongoDB connection string and credentials are correct.
3. **API Routes Not Working**: Verify that your `vercel.json` file has the correct routes configuration.

## Continuous Deployment

Both Netlify and Vercel support continuous deployment from your GitHub repository. Any changes pushed to your main branch will trigger a new deployment automatically.

## Monitoring and Logs

- **Netlify**: Access logs from your site dashboard under "Deploys" > select a deploy > "Deploy log".
- **Vercel**: Access logs from your project dashboard under "Deployments" > select a deployment > "View Logs".

## Scaling Considerations

As your application grows, consider the following:

1. **Database Scaling**: Upgrade your MongoDB Atlas plan as needed.
2. **Server Scaling**: Vercel automatically scales based on demand.
3. **Performance Optimization**: Implement caching strategies and optimize your code for better performance.

## Backup and Recovery

1. **Database Backup**: Set up regular backups of your MongoDB database.
2. **Code Backup**: Keep your code in a version control system like GitHub.
3. **Environment Variables**: Keep a secure backup of all environment variables.

## Security Best Practices

1. **API Security**: Implement rate limiting and proper authentication.
2. **Environment Variables**: Never commit sensitive information to your repository.
3. **Regular Updates**: Keep all dependencies updated to patch security vulnerabilities.
4. **HTTPS**: Ensure all communication uses HTTPS. 
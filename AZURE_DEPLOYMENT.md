# Azure Deployment Guide

This guide provides instructions for deploying this React/Vite application to Azure Web App.

## Prerequisites

1. An Azure account with an active subscription
2. Azure CLI installed locally or access to Azure Portal
3. GitHub account (if using GitHub Actions for deployment)

## Deployment Methods

### 1. GitHub Actions (Recommended)

#### Setup

1. Create an Azure Web App
   ```bash
   # Login to Azure
   az login

   # Create a resource group if needed
   az group create --name myResourceGroup --location eastus

   # Create an App Service plan
   az appservice plan create --name myAppServicePlan --resource-group myResourceGroup --sku B1

   # Create a web app
   az webapp create --name your-webapp-name --resource-group myResourceGroup --plan myAppServicePlan --runtime "NODE|18-lts"
   ```

2. Configure deployment from GitHub Actions:
   - In the Azure Portal, navigate to your Web App
   - Go to "Deployment Center"
   - Select "GitHub" as the source
   - Follow the setup wizard to connect to your GitHub repository
   - Configure the workflow

3. Set up GitHub repository secrets:
   - Go to your GitHub repository
   - Navigate to Settings > Secrets and variables > Actions
   - Add a new repository secret named `AZURE_WEBAPP_PUBLISH_PROFILE`
   - Copy the publish profile from your Azure Web App (Download from Azure Portal > Your Web App > Get publish profile)
   - Paste the content into the secret value

4. Update the GitHub workflow file:
   - Open `.github/workflows/azure-webapps-node.yml`
   - Set `AZURE_WEBAPP_NAME` to your Azure Web App name

5. Push your changes to trigger the deployment

### 2. Manual Deployment with Zip Deploy

1. Build your application
   ```bash
   npm ci
   npm run build
   ```

2. Create a zip package
   ```bash
   zip -r release.zip . -x "node_modules/*" ".git/*"
   ```

3. Deploy using Azure CLI
   ```bash
   az webapp deployment source config-zip --resource-group myResourceGroup --name your-webapp-name --src release.zip
   ```

### 3. Local Git Deployment

1. Configure local Git deployment in Azure Web App:
   ```bash
   az webapp deployment source config-local-git --name your-webapp-name --resource-group myResourceGroup
   ```

2. Add the Azure remote to your local repository:
   ```bash
   git remote add azure <git-url-from-previous-command>
   ```

3. Push to Azure:
   ```bash
   git push azure main
   ```

## Environment Configuration

Create a `.env.production` file with your production environment variables:

```
VITE_APP_ENVIRONMENT=production
VITE_BACKEND_API_URL=your-api-url
VITE_APPINSIGHTS_CONNECTION_STRING=your-application-insights-connection-string
```

Set these environment variables in Azure Web App:
1. Go to Azure Portal > Your Web App > Settings > Configuration
2. Add each environment variable in the "Application settings" section

## Monitoring with Application Insights

1. Create an Application Insights resource in Azure Portal

2. Get the connection string from your Application Insights resource

3. Add the connection string to your Web App configuration:
   ```bash
   az webapp config appsettings set --name your-webapp-name --resource-group myResourceGroup --settings VITE_APPINSIGHTS_CONNECTION_STRING="your-connection-string"
   ```

## Troubleshooting

- Check logs in Azure Portal > Your Web App > Monitoring > Log stream
- View deployment details in Azure Portal > Your Web App > Deployment > Deployment Center
- For GitHub Actions issues, check the Actions tab in your GitHub repository 
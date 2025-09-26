# Google Maps Setup Guide

This guide will help you set up Google Maps with Advanced Markers for the LemoTech application.

## Prerequisites

- Google Cloud Console account
- Google Maps API key (if you don't have one, follow the API key setup first)

## Step 1: Access Google Cloud Console

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Sign in with your Google account
3. Select your project (or create a new one if needed)

## Step 2: Enable Required APIs

1. In the left sidebar, go to **APIs & Services** → **Library**
2. Search for and enable these APIs:
   - **Maps JavaScript API** ✅
   - **Places API** ✅ (for location search)
   - **Directions API** ✅ (for route planning)
   - **Geocoding API** ✅ (for address conversion)

## Step 3: Create a Map ID

1. In the left sidebar, go to **APIs & Services** → **Credentials**
2. Click on **Map IDs** tab (scroll down if you don't see it)
3. Click **+ CREATE MAP ID**
4. Fill in the details:
   - **Map ID name**: `lemotech-map` (or any name you prefer)
   - **Map type**: Select **JavaScript** (for web applications)
   - **Map style**: Choose your preferred style:
     - **Default** - Standard Google Maps style
     - **Silver** - Clean, minimal style
     - **Retro** - Vintage look
     - **Dark** - Dark theme (recommended for LemoTech)
     - **Night** - Night mode
     - **Aubergine** - Purple theme
     - **Custom** - Upload your own style
5. Click **CREATE**

## Step 4: Configure Map ID Settings

1. After creation, click on your Map ID
2. Configure additional settings:
   - **Usage restrictions** (optional): 
     - Add your domain: `localhost:5173` (for development)
     - Add your production domain: `lemotech.co.za`
   - **Advanced features**: Enable features like:
     - **Advanced Markers** ✅ (This is what we need!)
     - **Data-driven styling**
     - **Cloud-based maps styling**

## Step 5: Get Your Map ID

1. Copy the Map ID (it looks like: `1234567890abcdef`)
2. You'll use this in your environment variables

## Step 6: Update Environment Variables

Create a `.env` file in your `frontend/` directory with:

```env
# Google Maps Configuration
VITE_GOOGLE_MAPS_API_KEY=your_actual_api_key_here
VITE_GOOGLE_MAPS_MAP_ID=your_actual_map_id_here
```

## Step 7: Test Your Setup

1. Restart your development server
2. Check the browser console - you should no longer see Map ID warnings
3. Your markers should now use Advanced Markers (modern API)

## Troubleshooting

### Common Issues

1. **"Map ID not found" error**
   - Make sure you copied the Map ID correctly
   - Check that the Map ID is enabled for JavaScript maps

2. **"Advanced Markers not available" error**
   - Ensure Advanced Markers is enabled in your Map ID settings
   - Make sure you're using the correct Map ID

3. **API key restrictions**
   - Add your domain to the API key restrictions
   - For development: `localhost:5173`
   - For production: `lemotech.co.za`

### Verification Steps

1. **Check Map ID**: Go to Google Cloud Console → APIs & Services → Credentials → Map IDs
2. **Check API Key**: Go to Google Cloud Console → APIs & Services → Credentials → API Keys
3. **Check Console**: Look for any remaining warnings in browser console

## Production Deployment

For production deployment:

1. **Update API Key Restrictions**:
   - Add your production domain: `lemotech.co.za`
   - Remove `localhost:5173` if not needed

2. **Update Environment Variables**:
   ```env
   VITE_GOOGLE_MAPS_API_KEY=your_production_api_key
   VITE_GOOGLE_MAPS_MAP_ID=your_production_map_id
   ```

3. **Test in Production**:
   - Verify maps load correctly
   - Check that Advanced Markers work
   - Ensure no console warnings

## Cost Considerations

- **Maps JavaScript API**: Free tier includes 28,000 map loads per month
- **Places API**: Free tier includes 1,000 requests per month
- **Directions API**: Free tier includes 2,500 requests per month

Monitor your usage in Google Cloud Console → APIs & Services → Quotas

## Security Best Practices

1. **Restrict API Key**: Always add domain restrictions
2. **Use Map ID**: Provides additional security and features
3. **Monitor Usage**: Set up billing alerts
4. **Rotate Keys**: Regularly update API keys

## Support

If you encounter issues:

1. Check Google Maps documentation: https://developers.google.com/maps/documentation/javascript/advanced-markers
2. Verify your setup in Google Cloud Console
3. Check browser console for specific error messages

---

**Next Steps**: After setting up your Map ID, your Google Maps will use the modern Advanced Markers API without any deprecation warnings!

# Offline Features for Simple Airtable Approver

This document describes the offline functionality that has been implemented in the Simple Airtable Approver application.

## Overview

The app now supports working offline, allowing users to:
- Load data once when online
- Continue working offline without an internet connection
- Queue actions taken while offline
- Automatically sync when connection is restored
- Maintain local data persistence across browser sessions

## How It Works

### 1. Network Detection
- The app automatically detects when it goes online/offline
- The body element gets an "offline" class when disconnected
- Visual indicators show the current connection status

### 2. Local Data Storage
- Tweet data is cached in localStorage when loaded
- Account information is stored locally
- Data persists across browser reloads
- Stale data is automatically refreshed when online

### 3. Offline Action Queue
- Actions taken while offline are queued locally
- Queue includes: approve/reject tweets, edit responses, refresh accounts
- Actions are processed in batches when connection is restored
- Failed actions are retried up to 3 times

### 4. Service Worker
- Provides offline caching of app resources
- Ensures the app loads even without internet
- Automatically updates cached resources

## User Experience

### Online Mode
- Normal operation with real-time Airtable updates
- Green status indicator
- "Online" status in top navigation

### Offline Mode
- Orange status indicator with pulsing animation
- "Offline" status in top navigation
- Queue count badge shows pending actions
- All functionality remains available

### Coming Back Online
- Automatic processing of queued actions
- Batch processing to avoid overwhelming the server
- Data freshness check and refresh if needed
- Status indicators return to normal

## Technical Implementation

### Components Added
- `offline_manager`: Core offline functionality
- Network status detection and management
- Action queuing and processing
- Local data management

### Data Flow
1. **Online**: Data fetched from Airtable, cached locally
2. **Offline**: Data served from local cache, actions queued
3. **Reconnection**: Queued actions processed, fresh data fetched

### Storage Strategy
- **localStorage**: Action queue, account data, tweet data
- **Service Worker**: App resources, offline fallbacks
- **Automatic cleanup**: Stale data removed after 24 hours

## Configuration

### Batch Processing
- Default batch size: 5 actions
- Delay between batches: 2 seconds
- Maximum retries: 3 attempts

### Data Freshness
- Local data considered stale after 30 minutes
- Automatic refresh when coming back online
- Manual refresh available through normal app flow

## Browser Support

- **Service Workers**: Chrome 40+, Firefox 44+, Safari 11.1+
- **localStorage**: All modern browsers
- **Network Information API**: Chrome 61+, Edge 79+

## Troubleshooting

### Common Issues
1. **Actions not syncing**: Check network connection and browser console
2. **Data not loading**: Clear localStorage and refresh
3. **Service worker issues**: Check browser console for registration errors

### Debug Information
- Console logs show offline queue status
- Network status visible in top navigation
- Status indicator shows current sync state

## Future Enhancements

- **IndexedDB**: For larger data storage needs
- **Background sync**: For better offline/online transitions
- **Conflict resolution**: For handling data conflicts
- **Push notifications**: For important updates when offline

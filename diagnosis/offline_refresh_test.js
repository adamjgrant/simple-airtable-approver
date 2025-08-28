// Offline Refresh Test Script
// Run this in the browser console to test offline refresh behavior

console.log('🧪 Testing Offline Refresh Functionality...');

// Test 1: Check current offline status
console.log('\n=== Test 1: Current Status ===');
console.log('Offline manager exists:', !!m.offline_manager);
console.log('Is online:', m.offline_manager ? m.offline_manager.act.isOnline() : 'N/A');
console.log('Body class:', document.body.className);
console.log('Curtain visible:', !document.querySelector('[data-component="curtain"]').classList.contains('hide'));

// Test 2: Check cached data availability
console.log('\n=== Test 2: Cached Data ===');
if (m.card && m.card.act) {
    const cachedCards = m.card.act.loadFromLocalStorage();
    console.log('Cached cards available:', !!cachedCards);
    if (cachedCards) {
        console.log('Number of cached cards:', m.card.data.length);
        console.log('Sample card:', m.card.data[0] ? {
            id: m.card.data[0].id,
            tweet: m.card.data[0].tweet?.substring(0, 50) + '...',
            response: m.card.data[0].response?.substring(0, 50) + '...'
        } : 'None');
    }
} else {
    console.log('Card component not available');
}

// Test 3: Simulate offline refresh
console.log('\n=== Test 3: Simulate Offline Refresh ===');
console.log('To test offline refresh:');
console.log('1. Go offline (turn off internet)');
console.log('2. Refresh the page');
console.log('3. The app should load from cache and remove the loading curtain');
console.log('4. Check console for "Offline detected during initialization" messages');

// Test 4: Manual offline simulation
console.log('\n=== Test 4: Manual Offline Simulation ===');
if (m.offline_manager) {
    console.log('Setting offline status...');
    m.offline_manager.act.setOfflineStatus({ isOnline: false });
    
    console.log('Current status after manual offline:', m.offline_manager.act.isOnline());
    console.log('Body class after manual offline:', document.body.className);
    
    // Reset back to actual status
    setTimeout(() => {
        m.offline_manager.act.forceNetworkCheck();
        console.log('Network check completed, status reset to:', m.offline_manager.act.isOnline());
    }, 2000);
} else {
    console.log('Offline manager not available');
}

// Test 5: Check offline queue
console.log('\n=== Test 5: Offline Queue Status ===');
if (m.offline_manager) {
    const queueStatus = m.offline_manager.act.getQueueStatus();
    console.log('Queue status:', queueStatus);
    
    if (queueStatus.queueLength > 0) {
        console.log('Queue contents:', m.offline_manager.offlineQueue.map(action => ({
            type: action.type,
            tweetId: action.data?.tweetId,
            timestamp: new Date(action.timestamp).toLocaleTimeString()
        })));
    }
} else {
    console.log('Offline manager not available');
}

console.log('\n✅ Offline refresh test complete!');
console.log('💡 Tip: Go offline and refresh to see the new behavior in action.');

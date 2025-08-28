// Network Debugging Script
// Run this in the browser console to debug network detection issues

console.log('=== NETWORK DEBUGGING ===');

// 1. Check current state
console.log('1. CURRENT STATE:');
console.log('navigator.onLine:', navigator.onLine);
console.log('m.offline_manager.isOnline:', m.offline_manager?.isOnline);
console.log('document.body.className:', document.body.className);
console.log('window.online:', window.online);
console.log('window.offline:', window.offline);

// 2. Check if event listeners are properly attached
console.log('\n2. EVENT LISTENER CHECK:');
console.log('window.addEventListener exists:', typeof window.addEventListener === 'function');

// Try to manually trigger events
console.log('\n3. MANUAL EVENT TESTING:');
console.log('Creating custom online/offline events...');

// Create and dispatch a custom offline event
const offlineEvent = new Event('offline');
window.dispatchEvent(offlineEvent);

// Wait a moment and check
setTimeout(() => {
    console.log('After offline event:');
    console.log('m.offline_manager.isOnline:', m.offline_manager?.isOnline);
    console.log('document.body.className:', document.body.className);
}, 100);

// 4. Check polling interval
console.log('\n4. POLLING INTERVAL CHECK:');
console.log('Active intervals:', window._intervals || 'No tracking');
console.log('Run checkIntervals() to see all active intervals');

// 5. Manual network status manipulation
console.log('\n5. MANUAL STATUS TESTING:');
console.log('Run these commands to test:');
console.log('m.offline_manager.isOnline = false');
console.log('m.offline_manager.act.updateBodyClass()');
console.log('document.body.className');

// 6. Check if the component methods exist
console.log('\n6. COMPONENT METHOD CHECK:');
console.log('updateBodyClass exists:', typeof m.offline_manager?.act?.updateBodyClass === 'function');
console.log('setupNetworkListeners exists:', typeof m.offline_manager?.act?.setupNetworkListeners === 'function');

// 7. Test the updateBodyClass method directly
console.log('\n7. TESTING updateBodyClass DIRECTLY:');
if (m.offline_manager?.act?.updateBodyClass) {
    console.log('Calling updateBodyClass...');
    m.offline_manager.act.updateBodyClass();
    console.log('Body class after direct call:', document.body.className);
} else {
    console.log('updateBodyClass method not found!');
}

// Helper function to check intervals
window.checkIntervals = function() {
    console.log('Checking for active intervals...');
    // This is a basic check - in a real app you'd want to track intervals
    console.log('Note: Intervals are not automatically tracked. Check the console for setInterval calls.');
};

// Helper function to force offline state
window.forceOffline = function() {
    console.log('Forcing offline state...');
    m.offline_manager.isOnline = false;
    m.offline_manager.act.updateBodyClass();
    console.log('Offline state set. Body class:', document.body.className);
};

// Helper function to force online state
window.forceOnline = function() {
    console.log('Forcing online state...');
    m.offline_manager.isOnline = true;
    m.offline_manager.act.updateBodyClass();
    console.log('Online state set. Body class:', document.body.className);
};

console.log('\n=== HELPER FUNCTIONS ===');
console.log('forceOffline() - Force offline state');
console.log('forceOnline() - Force online state');
console.log('checkIntervals() - Check for active intervals');

console.log('\n=== NEXT STEPS ===');
console.log('1. Try forceOffline() to see if the method works');
console.log('2. Check if the body class changes');
console.log('3. Look for any errors in the console');

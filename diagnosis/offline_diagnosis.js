// Offline Manager Diagnostic Script
// Run this in the browser console to debug offline functionality

console.log('=== OFFLINE MANAGER DIAGNOSTICS ===');

// Check if offline_manager component exists
console.log('1. Offline Manager Component:');
console.log('m.offline_manager:', m.offline_manager);
console.log('m.offline_manager.act:', m.offline_manager?.act);
console.log('m.offline_manager.acts:', m.offline_manager?.acts);

// Check network status
console.log('\n2. Network Status:');
console.log('navigator.onLine:', navigator.onLine);
console.log('m.offline_manager.isOnline:', m.offline_manager?.isOnline);
console.log('Body class:', document.body.className);

// Check offline queue
console.log('\n3. Offline Queue:');
console.log('Queue length:', m.offline_manager?.offlineQueue?.length);
console.log('Queue contents:', m.offline_manager?.offlineQueue);

// Check local data
console.log('\n4. Local Data:');
console.log('Local data keys:', Object.keys(m.offline_manager?.localData || {}));
console.log('Local data size:', JSON.stringify(m.offline_manager?.localData).length);

// Check event listeners
console.log('\n5. Event Listeners:');
console.log('Online event listeners:', window.ononline);
console.log('Offline event listeners:', window.onoffline);

// Test offline detection
console.log('\n6. Testing Offline Detection:');
console.log('Run this to test: testOfflineDetection()');

// Test function
window.testOfflineDetection = function() {
    console.log('Testing offline detection...');
    
    // Simulate offline
    console.log('Simulating offline...');
    m.offline_manager.isOnline = false;
    m.offline_manager.act.updateBodyClass();
    
    console.log('Body class after offline:', document.body.className);
    console.log('Is online check:', m.offline_manager.act.isOnline());
    
    // Simulate online
    console.log('Simulating online...');
    m.offline_manager.isOnline = true;
    m.offline_manager.act.updateBodyClass();
    
    console.log('Body class after online:', document.body.className);
    console.log('Is online check:', m.offline_manager.act.isOnline());
};

// Check component initialization
console.log('\n7. Component Initialization:');
console.log('Mozart components:', Object.keys(Mozart.index));
console.log('Offline manager in Mozart:', Mozart.index.offline_manager);

console.log('\n=== END DIAGNOSTICS ===');
console.log('Run testOfflineDetection() to test offline detection');

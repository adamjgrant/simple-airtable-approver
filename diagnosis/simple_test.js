// Simple offline test script
// Run this in the browser console

console.log('=== SIMPLE OFFLINE TEST ===');

// Test 1: Check if offline_manager exists
console.log('1. Offline manager exists:', !!m.offline_manager);
console.log('2. Offline manager act method exists:', !!m.offline_manager?.act);
console.log('3. Current online status:', m.offline_manager?.isOnline);

// Test 2: Manually set offline
console.log('\n4. Setting offline manually...');
m.offline_manager.isOnline = false;
console.log('5. Manual offline status:', m.offline_manager.isOnline);
console.log('6. Body class:', document.body.className);

// Test 3: Check offline detection
console.log('\n7. Testing offline detection...');
console.log('8. isOnline() method result:', m.offline_manager.act.isOnline());

// Test 4: Set back to online
console.log('\n9. Setting back to online...');
m.offline_manager.isOnline = true;
console.log('10. Manual online status:', m.offline_manager.isOnline);
console.log('11. Body class:', document.body.className);

// Test 5: Use the proper method to set offline
console.log('\n12. Using proper method to set offline...');
m.offline_manager.act.setOfflineStatus({ isOnline: false });
console.log('13. Body class after proper method:', document.body.className);

// Test 6: Use the proper method to set online
console.log('\n14. Using proper method to set online...');
m.offline_manager.act.setOfflineStatus({ isOnline: true });
console.log('15. Body class after proper method:', document.body.className);

// Test 7: Force network check
console.log('\n16. Forcing network check...');
m.offline_manager.act.forceNetworkCheck();

console.log('\n=== TEST COMPLETE ===');
console.log('If body class changed from "offline" to "", the basic functionality works!');
console.log('Use m.offline_manager.act.setOfflineStatus({isOnline: false}) to test offline mode');

// Test 8: Test offline action queuing
console.log('\n17. Testing offline action queuing...');
m.offline_manager.act.setOfflineStatus({ isOnline: false });
console.log('18. Now try to reject/approve a tweet - it should be queued instead of calling Airtable');
console.log('19. Check queue length:', m.offline_manager.offlineQueue.length);

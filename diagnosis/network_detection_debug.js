// Network Detection Debug Script
// Focused on why automatic detection isn't working

console.log('=== NETWORK DETECTION DEBUG ===');

// Test 1: Check if navigator.onLine is reliable
console.log('1. NAVIGATOR.ONLINE RELIABILITY TEST:');
console.log('navigator.onLine:', navigator.onLine);
console.log('navigator.onLine type:', typeof navigator.onLine);

// Test 2: Check if the polling interval is actually running
console.log('\n2. POLLING INTERVAL TEST:');
console.log('Looking for the polling interval...');

// Override setInterval to see what's being created
const originalSetInterval = window.setInterval;
let intervalCount = 0;
window.setInterval = function(callback, delay, ...args) {
    intervalCount++;
    console.log(`Interval ${intervalCount} created:`, { delay, callback: callback.toString().substring(0, 100) });
    
    // If this looks like our polling interval, track it
    if (delay === 2000 && callback.toString().includes('wasOnline')) {
        console.log('*** FOUND OUR POLLING INTERVAL! ***');
        window._pollingInterval = { id: intervalCount, callback, delay };
    }
    
    return originalSetInterval.call(this, callback, delay, ...args);
};

console.log('setInterval has been overridden. Refresh the page to see intervals being created.');

// Test 3: Check if the offline manager is properly initialized
console.log('\n3. OFFLINE MANAGER INITIALIZATION:');
console.log('m.offline_manager exists:', !!m.offline_manager);
console.log('m.offline_manager.isOnline:', m.offline_manager?.isOnline);
console.log('m.offline_manager.act exists:', !!m.offline_manager?.act);

// Test 4: Manual network state simulation
console.log('\n4. MANUAL NETWORK STATE SIMULATION:');
console.log('Current state:');
console.log('- m.offline_manager.isOnline:', m.offline_manager?.isOnline);
console.log('- navigator.onLine:', navigator.onLine);
console.log('- document.body.className:', document.body.className);

// Test 5: Test the actual network detection logic
console.log('\n5. TESTING NETWORK DETECTION LOGIC:');
console.log('Let me test the exact logic used in polling...');

if (m.offline_manager) {
    const wasOnline = m.offline_manager.isOnline;
    const isNowOnline = navigator.onLine;
    
    console.log('Polling logic test:');
    console.log('- wasOnline:', wasOnline);
    console.log('- isNowOnline:', isNowOnline);
    console.log('- Are they different?', wasOnline !== isNowOnline);
    
    if (wasOnline !== isNowOnline) {
        console.log('*** STATUS CHANGE DETECTED! ***');
        console.log('This should trigger the body class update...');
    } else {
        console.log('No status change detected. This is why the body class isn\'t updating.');
    }
}

// Test 6: Check if there are any errors in the offline manager
console.log('\n6. ERROR CHECKING:');
console.log('Checking for any errors in the offline manager...');

try {
    // Try to call the methods to see if they throw errors
    if (m.offline_manager?.act?.updateBodyClass) {
        console.log('updateBodyClass method exists and is callable');
    }
    
    if (m.offline_manager?.act?.setupNetworkListeners) {
        console.log('setupNetworkListeners method exists and is callable');
    }
} catch (error) {
    console.error('Error calling offline manager methods:', error);
}

// Test 7: Force a network check
console.log('\n7. FORCING NETWORK CHECK:');
console.log('Current state before force check:');
console.log('- m.offline_manager.isOnline:', m.offline_manager?.isOnline);
console.log('- navigator.onLine:', navigator.onLine);
console.log('- document.body.className:', document.body.className);

// Try to force a check
if (m.offline_manager?.act?.forceNetworkCheck) {
    console.log('Calling forceNetworkCheck...');
    m.offline_manager.act.forceNetworkCheck();
    
    console.log('After force check:');
    console.log('- m.offline_manager.isOnline:', m.offline_manager?.isOnline);
    console.log('- document.body.className:', document.body.className);
} else {
    console.log('forceNetworkCheck method not found');
}

// Helper functions for testing
window.testPollingLogic = function() {
    console.log('Testing polling logic...');
    const wasOnline = m.offline_manager.isOnline;
    const isNowOnline = navigator.onLine;
    
    console.log('Current values:');
    console.log('- wasOnline:', wasOnline);
    console.log('- isNowOnline:', isNowOnline);
    console.log('- Difference detected:', wasOnline !== isNowOnline);
    
    return { wasOnline, isNowOnline, difference: wasOnline !== isNowOnline };
};

window.forceOfflineState = function() {
    console.log('Forcing offline state...');
    m.offline_manager.isOnline = false;
    m.offline_manager.act.updateBodyClass();
    console.log('Offline state forced. Body class:', document.body.className);
};

window.forceOnlineState = function() {
    console.log('Forcing online state...');
    m.offline_manager.isOnline = true;
    m.offline_manager.act.updateBodyClass();
    console.log('Online state forced. Body class:', document.body.className);
};

window.checkNetworkStatus = function() {
    console.log('Current network status:');
    console.log('- navigator.onLine:', navigator.onLine);
    console.log('- m.offline_manager.isOnline:', m.offline_manager?.isOnline);
    console.log('- document.body.className:', document.body.className);
    console.log('- Body has offline class:', document.body.classList.contains('offline'));
};

window.testNetworkConnectivity = function() {
    console.log('Testing network connectivity...');
    if (m.offline_manager?.act?.testNetworkConnectivity) {
        m.offline_manager.act.testNetworkConnectivity();
    } else {
        console.log('testNetworkConnectivity method not found');
    }
};

window.testMultipleEndpoints = function() {
    console.log('Testing multiple network endpoints...');
    if (m.offline_manager?.act?.testMultipleEndpoints) {
        m.offline_manager.act.testMultipleEndpoints();
    } else {
        console.log('testMultipleEndpoints method not found');
    }
};

console.log('\n=== HELPER FUNCTIONS ===');
console.log('testPollingLogic() - Test the exact polling logic');
console.log('forceOfflineState() - Force offline state');
console.log('forceOnlineState() - Force online state');
console.log('checkNetworkStatus() - Check current network status');
console.log('testNetworkConnectivity() - Test actual network connectivity');
console.log('testMultipleEndpoints() - Test multiple endpoints for reliability');

console.log('\n=== NEXT STEPS ===');
console.log('1. Refresh the page to see if intervals are created');
console.log('2. Go offline and run checkNetworkStatus()');
console.log('3. Run testPollingLogic() to see if it detects the change');
console.log('4. Look for any errors in the console');

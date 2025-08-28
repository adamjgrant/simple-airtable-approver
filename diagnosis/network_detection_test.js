// Network Detection Test Script
// Testing the specific network detection mechanisms

console.log('=== NETWORK DETECTION TEST ===');

// Test 1: Check current network state
console.log('1. CURRENT NETWORK STATE:');
console.log('navigator.onLine:', navigator.onLine);
console.log('m.offline_manager.isOnline:', m.offline_manager?.isOnline);
console.log('Body class:', document.body.className);

// Test 2: Test the browser's online/offline events
console.log('\n2. BROWSER EVENT TEST:');
console.log('Testing if browser events work...');

// Create a test event listener
let testEventFired = false;
const testListener = () => {
    testEventFired = true;
    console.log('Test event listener fired!');
};

window.addEventListener('online', testListener);
window.addEventListener('offline', testListener);

console.log('Test event listeners added. Now try disconnecting your internet...');
console.log('Or run: testNetworkEvents()');

// Test 3: Test the polling mechanism
console.log('\n3. POLLING MECHANISM TEST:');
console.log('Current polling status:');
console.log('- m.offline_manager.isOnline:', m.offline_manager?.isOnline);
console.log('- navigator.onLine:', navigator.onLine);

// Test 4: Manual network state simulation
console.log('\n4. MANUAL NETWORK STATE SIMULATION:');
console.log('You can manually test by running these commands:');

console.log('// Simulate going offline');
console.log('m.offline_manager.isOnline = false;');
console.log('m.offline_manager.act.updateBodyClass();');
console.log('console.log("Body class:", document.body.className);');

console.log('// Simulate coming back online');
console.log('m.offline_manager.isOnline = true;');
console.log('m.offline_manager.act.updateBodyClass();');
console.log('console.log("Body class:", document.body.className);');

// Test 5: Check if the polling interval is actually running
console.log('\n5. POLLING INTERVAL CHECK:');
console.log('Looking for active intervals...');

// This is a bit tricky to detect, but we can try
let intervalCount = 0;
const originalSetInterval = window.setInterval;
window.setInterval = function(...args) {
    intervalCount++;
    console.log(`Interval ${intervalCount} created with delay:`, args[1]);
    return originalSetInterval.apply(this, args);
};

console.log('setInterval has been overridden to track new intervals');
console.log('Refresh the page to see if new intervals are created');

// Test 6: Network connectivity test
console.log('\n6. NETWORK CONNECTIVITY TEST:');
console.log('Testing actual network connectivity...');

// Try to fetch a small resource
fetch('/favicon.ico', { method: 'HEAD' })
    .then(() => {
        console.log('Network test: SUCCESS - You are online');
    })
    .catch((error) => {
        console.log('Network test: FAILED - You are offline or there\'s an error:', error.message);
    });

// Helper functions
window.testNetworkEvents = function() {
    console.log('Testing network events...');
    
    // Dispatch offline event
    console.log('Dispatching offline event...');
    window.dispatchEvent(new Event('offline'));
    
    // Wait and check
    setTimeout(() => {
        console.log('After offline event:');
        console.log('- m.offline_manager.isOnline:', m.offline_manager?.isOnline);
        console.log('- Body class:', document.body.className);
        
        // Dispatch online event
        console.log('Dispatching online event...');
        window.dispatchEvent(new Event('online'));
        
        setTimeout(() => {
            console.log('After online event:');
            console.log('- m.offline_manager.isOnline:', m.offline_manager?.isOnline);
            console.log('- Body class:', document.body.className);
        }, 100);
    }, 100);
};

window.simulateOffline = function() {
    console.log('Simulating offline state...');
    m.offline_manager.isOnline = false;
    m.offline_manager.act.updateBodyClass();
    console.log('Offline state simulated. Body class:', document.body.className);
};

window.simulateOnline = function() {
    console.log('Simulating online state...');
    m.offline_manager.isOnline = true;
    m.offline_manager.act.updateBodyClass();
    console.log('Online state simulated. Body class:', document.body.className);
};

console.log('\n=== HELPER FUNCTIONS ===');
console.log('testNetworkEvents() - Test browser network events');
console.log('simulateOffline() - Manually simulate offline state');
console.log('simulateOnline() - Manually simulate online state');

console.log('\n=== NEXT STEPS ===');
console.log('1. Run testNetworkEvents() to test browser events');
console.log('2. Try simulateOffline() to see if manual state change works');
console.log('3. Disconnect internet and wait for polling to detect it');
console.log('4. Check console for any errors or unexpected behavior');

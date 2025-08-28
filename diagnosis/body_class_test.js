// Body Class Test Script
// Focused testing of why the body class isn't changing

console.log('=== BODY CLASS TEST ===');

// Test 1: Check if the method exists and works
console.log('1. TESTING updateBodyClass METHOD:');
console.log('Method exists:', typeof m.offline_manager?.act?.updateBodyClass === 'function');

if (m.offline_manager?.act?.updateBodyClass) {
    console.log('Method found! Testing...');
    
    // Test with current state
    console.log('Current state before test:');
    console.log('- m.offline_manager.isOnline:', m.offline_manager.isOnline);
    console.log('- document.body.className:', document.body.className);
    
    // Call the method
    console.log('\nCalling updateBodyClass...');
    m.offline_manager.act.updateBodyClass();
    
    console.log('After calling updateBodyClass:');
    console.log('- document.body.className:', document.body.className);
    
} else {
    console.log('ERROR: updateBodyClass method not found!');
}

// Test 2: Manual state change
console.log('\n2. MANUAL STATE CHANGE TEST:');
console.log('Setting isOnline to false...');
m.offline_manager.isOnline = false;
console.log('isOnline is now:', m.offline_manager.isOnline);

console.log('Calling updateBodyClass again...');
m.offline_manager.act.updateBodyClass();
console.log('Body class after manual change:', document.body.className);

// Test 3: Check if the method is actually doing something
console.log('\n3. METHOD INSPECTION:');
console.log('Let me look at what updateBodyClass actually does...');

// Try to inspect the method
if (m.offline_manager?.act?.updateBodyClass) {
    console.log('Method source:', m.offline_manager.act.updateBodyClass.toString());
} else {
    console.log('Cannot inspect method - it does not exist');
}

// Test 4: Direct DOM manipulation
console.log('\n4. DIRECT DOM TEST:');
console.log('Testing if we can manipulate the body class directly...');

const body = document.body;
console.log('Body element:', body);
console.log('Body classList:', body.classList);
console.log('Body className:', body.className);

// Try to add the offline class directly
console.log('Adding "offline" class directly...');
body.classList.add('offline');
console.log('Body class after direct manipulation:', body.className);

// Remove it
console.log('Removing "offline" class...');
body.classList.remove('offline');
console.log('Body class after removal:', body.className);

// Test 5: Check if there are any CSS rules interfering
console.log('\n5. CSS INTERFERENCE CHECK:');
console.log('Checking if there are CSS rules that might prevent class changes...');

// Look for any CSS that might be affecting the body
const styleSheets = document.styleSheets;
console.log('Number of stylesheets:', styleSheets.length);

// Test 6: Final verification
console.log('\n6. FINAL VERIFICATION:');
console.log('Current state:');
console.log('- m.offline_manager.isOnline:', m.offline_manager.isOnline);
console.log('- document.body.className:', document.body.className);
console.log('- navigator.onLine:', navigator.onLine);

console.log('\n=== TEST COMPLETE ===');
console.log('If the body class changed during these tests, the method works.');
console.log('If it never changed, there might be a deeper issue.');

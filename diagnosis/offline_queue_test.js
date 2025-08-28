// Offline Queue Test Script
// Test the new smart queue management for offline edits

console.log('=== OFFLINE QUEUE TEST ===');

// Test 1: Check current queue state
console.log('1. CURRENT QUEUE STATE:');
console.log('Queue length:', m.offline_manager?.offlineQueue?.length);
console.log('Queue contents:', m.offline_manager?.offlineQueue);

// Test 2: Test smart queue management
console.log('\n2. TESTING SMART QUEUE MANAGEMENT:');
console.log('Simulating multiple edits to the same tweet...');

// Simulate multiple edits to the same tweet
const testTweetId = 'test_tweet_123';
const testResponses = [
    'First response',
    'Second response',
    'Third response',
    'Final response'
];

console.log('Adding multiple edits for tweet:', testTweetId);
testResponses.forEach((response, index) => {
    console.log(`Edit ${index + 1}: "${response}"`);
    
    if (m.offline_manager?.act?.updateOrAddToOfflineQueue) {
        m.offline_manager.act.updateOrAddToOfflineQueue({
            type: 'edit_response',
            data: {
                tweetId: testTweetId,
                response: response
            },
            updateKey: 'tweetId'
        });
    } else {
        console.log('updateOrAddToOfflineQueue method not found!');
    }
});

// Test 3: Check queue after multiple edits
console.log('\n3. QUEUE AFTER MULTIPLE EDITS:');
setTimeout(() => {
    console.log('Queue length:', m.offline_manager?.offlineQueue?.length);
    console.log('Queue contents:', m.offline_manager?.offlineQueue);
    
    // Check if we only have one action for this tweet
    const editActions = m.offline_manager.offlineQueue.filter(action => 
        action.type === 'edit_response' && action.data.tweetId === testTweetId
    );
    
    console.log('Edit actions for test tweet:', editActions.length);
    if (editActions.length > 0) {
        console.log('Latest response:', editActions[0].data.response);
    }
}, 1000);

// Test 4: Test duplicate cleanup
console.log('\n4. TESTING DUPLICATE CLEANUP:');
console.log('Adding some duplicate actions...');

// Add some duplicate actions
const duplicateActions = [
    { type: 'update_review_status', data: { tweetId: 'tweet1', status: 'Approved' } },
    { type: 'update_review_status', data: { tweetId: 'tweet1', status: 'Approved' } },
    { type: 'edit_response', data: { tweetId: 'tweet2', response: 'Hello' } },
    { type: 'edit_response', data: { tweetId: 'tweet2', response: 'Hello' } }
];

duplicateActions.forEach(action => {
    m.offline_manager.offlineQueue.push({
        id: Date.now() + Math.random(),
        timestamp: Date.now(),
        type: action.type,
        data: action.data,
        retries: 0
    });
});

console.log('Queue length after adding duplicates:', m.offline_manager.offlineQueue.length);

// Test cleanup
if (m.offline_manager?.act?.cleanupDuplicateActions) {
    console.log('Running duplicate cleanup...');
    m.offline_manager.act.cleanupDuplicateActions();
    console.log('Queue length after cleanup:', m.offline_manager.offlineQueue.length);
} else {
    console.log('cleanupDuplicateActions method not found!');
}

// Test 5: Test the card component's updateOfflineEditQueue method
console.log('\n5. TESTING CARD COMPONENT METHOD:');
if (m.card?.act?.updateOfflineEditQueue) {
    console.log('updateOfflineEditQueue method exists!');
    
    // Test it with a new tweet
    m.card.act.updateOfflineEditQueue({
        tweetId: 'new_tweet_456',
        response: 'This is a test response'
    });
    
    console.log('Queue length after card component test:', m.offline_manager.offlineQueue.length);
} else {
    console.log('updateOfflineEditQueue method not found in card component!');
}

// Helper functions
window.showQueue = function() {
    console.log('Current offline queue:');
    console.log('Length:', m.offline_manager.offlineQueue.length);
    console.log('Contents:', m.offline_manager.offlineQueue);
};

window.clearQueue = function() {
    if (m.offline_manager?.act?.clearOfflineQueue) {
        m.offline_manager.act.clearOfflineQueue();
        console.log('Queue cleared');
    } else {
        console.log('clearOfflineQueue method not found');
    }
};

window.testSmartQueue = function(tweetId, responses) {
    console.log(`Testing smart queue for tweet: ${tweetId}`);
    responses.forEach((response, index) => {
        console.log(`Edit ${index + 1}: "${response}"`);
        m.offline_manager.act.updateOrAddToOfflineQueue({
            type: 'edit_response',
            data: { tweetId, response },
            updateKey: 'tweetId'
        });
    });
    
    setTimeout(() => {
        console.log('Final queue state:');
        window.showQueue();
    }, 500);
};

console.log('\n=== HELPER FUNCTIONS ===');
console.log('showQueue() - Show current queue contents');
console.log('clearQueue() - Clear the offline queue');
console.log('testSmartQueue(tweetId, responses) - Test smart queue with multiple responses');

console.log('\n=== TEST COMPLETE ===');
console.log('The smart queue should now only keep the latest edit for each tweet!');

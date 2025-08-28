m.offline_manager.acts({
    init(_$, args) {
        // Initialize offline manager
        _$.act.loadOfflineQueue();
        _$.act.loadLocalData();
        
        // Ensure initial status is set before setting up listeners
        if (m.offline_manager.isOnline === undefined) {
            m.offline_manager.isOnline = navigator.onLine;
        }
        
        _$.act.setupNetworkListeners();
        _$.act.updateBodyClass();
        
        // If we're online, process any queued actions
        if (m.offline_manager.isOnline) {
            _$.act.processOfflineQueue();
            _$.act.checkDataFreshness();
        }
        
        console.log('Offline manager initialized. Online:', m.offline_manager.isOnline);
    },

    setupNetworkListeners(_$, args) {
        console.log('Setting up network listeners...');
        
        // Listen for online/offline events
        window.addEventListener('online', () => {
            console.log('Online event fired');
            m.offline_manager.isOnline = true;
            _$.act.updateBodyClass();
            _$.act.processOfflineQueue();
            _$.act.checkDataFreshness();
            console.log('Network: Online');
        });

        window.addEventListener('offline', () => {
            console.log('Offline event fired');
            m.offline_manager.isOnline = false;
            _$.act.updateBodyClass();
            console.log('Network: Offline');
        });
        
        // Set up polling as fallback (check every 5 seconds)
        setInterval(() => {
            _$.act.checkNetworkConnectivity();
        }, 5000);
        
        console.log('Network listeners set up. Current online status:', navigator.onLine);
    },

    updateBodyClass(_$, args) {
        const body = document.body;
        if (m.offline_manager.isOnline) {
            body.classList.remove('offline');
        } else {
            body.classList.add('offline');
        }
        
        console.log('Body class updated:', body.className, 'Online:', m.offline_manager.isOnline);
    },



    isOnline(_$, args) {
        return m.offline_manager.isOnline;
    },

    setOfflineStatus(_$, args) {
        // Manually set offline status and update body class
        m.offline_manager.isOnline = args.isOnline;
        _$.act.updateBodyClass();
        console.log('Manually set offline status:', args.isOnline, 'Body class:', document.body.className);
    },

    forceNetworkCheck(_$, args) {
        // Force an immediate network check and update
        _$.act.checkNetworkConnectivity();
    },

    checkNetworkConnectivity(_$, args) {
        // Actually test if we can reach the internet by making a request
        const wasOnline = m.offline_manager.isOnline;
        
        // Try to fetch from an external service that won't be cached
        // Using a small, fast service that should respond quickly
        fetch('https://httpbin.org/status/200', { 
            method: 'HEAD',
            cache: 'no-cache',
            signal: AbortSignal.timeout(5000) // 5 second timeout
        })
        .then(() => {
            // Success - we're online
            if (!wasOnline) {
                console.log('Network connectivity restored via external fetch test');
                m.offline_manager.isOnline = true;
                _$.act.updateBodyClass();
                _$.act.processOfflineQueue();
                _$.act.checkDataFreshness();
            }
        })
        .catch((error) => {
            // Failed - we're offline
            if (wasOnline) {
                console.log('Network connectivity lost via external fetch test:', error.message);
                m.offline_manager.isOnline = false;
                _$.act.updateBodyClass();
            }
        });
        
        console.log('Network connectivity check - wasOnline:', wasOnline, 'external fetch test in progress...');
    },

    testNetworkConnectivity(_$, args) {
        // Manual test of network connectivity
        console.log('Testing network connectivity...');
        console.log('Current status:', m.offline_manager.isOnline);
        
        _$.act.checkNetworkConnectivity();
        
        // Check again after a short delay
        setTimeout(() => {
            console.log('Network test result - isOnline:', m.offline_manager.isOnline);
            console.log('Body class:', document.body.className);
        }, 6000); // Wait for the fetch to complete (increased timeout)
    },

    testMultipleEndpoints(_$, args) {
        // Test multiple endpoints for more reliable detection
        console.log('Testing multiple network endpoints...');
        
        const endpoints = [
            'https://httpbin.org/status/200',
            'https://www.google.com/favicon.ico',
            'https://www.cloudflare.com/favicon.ico'
        ];
        
        let successCount = 0;
        let totalTests = endpoints.length;
        
        endpoints.forEach((endpoint, index) => {
            fetch(endpoint, { 
                method: 'HEAD',
                cache: 'no-cache',
                signal: AbortSignal.timeout(3000)
            })
            .then(() => {
                successCount++;
                console.log(`Endpoint ${index + 1} (${endpoint}): SUCCESS`);
                _$.act.evaluateConnectivityTest(successCount, totalTests);
            })
            .catch((error) => {
                console.log(`Endpoint ${index + 1} (${endpoint}): FAILED - ${error.message}`);
                _$.act.evaluateConnectivityTest(successCount, totalTests);
            });
        });
    },

    evaluateConnectivityTest(_$, args) {
        const { successCount, totalTests } = args;
        
        // If we've received all test results
        if (successCount + (totalTests - successCount) === totalTests) {
            const wasOnline = m.offline_manager.isOnline;
            const isNowOnline = successCount > 0; // Online if at least one endpoint succeeded
            
            console.log(`Connectivity test complete: ${successCount}/${totalTests} endpoints succeeded`);
            
            if (wasOnline !== isNowOnline) {
                m.offline_manager.isOnline = isNowOnline;
                _$.act.updateBodyClass();
                
                if (isNowOnline) {
                    console.log('Network connectivity restored via multiple endpoint test');
                    _$.act.processOfflineQueue();
                    _$.act.checkDataFreshness();
                } else {
                    console.log('Network connectivity lost via multiple endpoint test');
                }
            }
        }
    },

    // Queue management
    addToOfflineQueue(_$, args) {
        const action = {
            id: Date.now() + Math.random(),
            timestamp: Date.now(),
            type: args.type,
            data: args.data,
            retries: 0,
            ...args
        };
        
        m.offline_manager.offlineQueue.push(action);
        _$.act.saveOfflineQueue();
        
        console.log('Action queued for offline processing:', action);
        return action.id;
    },

    updateOrAddToOfflineQueue(_$, args) {
        // Smart queue management - update existing action or add new one
        const { type, data, updateKey } = args;
        
        if (updateKey) {
            // Look for existing action with the same updateKey
            const existingIndex = m.offline_manager.offlineQueue.findIndex(action => 
                action.type === type && action.data[updateKey] === data[updateKey]
            );
            
            if (existingIndex !== -1) {
                // Update existing action
                console.log('Updating existing offline action:', type, 'for key:', updateKey);
                m.offline_manager.offlineQueue[existingIndex].data = { ...m.offline_manager.offlineQueue[existingIndex].data, ...data };
                m.offline_manager.offlineQueue[existingIndex].timestamp = Date.now();
                _$.act.saveOfflineQueue();
                return m.offline_manager.offlineQueue[existingIndex].id;
            }
        }
        
        // Add new action if no existing one found
        return _$.act.addToOfflineQueue(args);
    },

    cleanupDuplicateActions(_$, args) {
        // Remove duplicate actions, keeping only the latest version of each
        const seen = new Map(); // type + key -> latest action index
        const toRemove = [];
        
        m.offline_manager.offlineQueue.forEach((action, index) => {
            const key = `${action.type}_${action.data.tweetId || action.data.id || 'unknown'}`;
            
            if (seen.has(key)) {
                // We've seen this action before, mark for removal
                toRemove.push(index);
            } else {
                // First time seeing this action, remember it
                seen.set(key, index);
            }
        });
        
        // Remove duplicates (in reverse order to maintain indices)
        toRemove.reverse().forEach(index => {
            console.log('Removing duplicate action:', m.offline_manager.offlineQueue[index]);
            m.offline_manager.offlineQueue.splice(index, 1);
        });
        
        if (toRemove.length > 0) {
            console.log(`Cleaned up ${toRemove.length} duplicate actions`);
            _$.act.saveOfflineQueue();
        }
    },

    removeFromOfflineQueue(_$, args) {
        const index = m.offline_manager.offlineQueue.findIndex(action => action.id === args.id);
        if (index > -1) {
            m.offline_manager.offlineQueue.splice(index, 1);
            _$.act.saveOfflineQueue();
        }
    },

    saveOfflineQueue(_$, args) {
        try {
            localStorage.setItem('offlineQueue', JSON.stringify(m.offline_manager.offlineQueue));
        } catch (error) {
            console.error('Failed to save offline queue:', error);
        }
    },

    loadOfflineQueue(_$, args) {
        try {
            const saved = localStorage.getItem('offlineQueue');
            if (saved) {
                m.offline_manager.offlineQueue = JSON.parse(saved);
                console.log('Loaded offline queue:', m.offline_manager.offlineQueue.length, 'actions');
            }
        } catch (error) {
            console.error('Failed to load offline queue:', error);
            m.offline_manager.offlineQueue = [];
        }
    },

    // Local data management
    saveLocalData(_$, args) {
        try {
            m.offline_manager.localData[args.key] = {
                data: args.data,
                timestamp: Date.now()
            };
            localStorage.setItem('localData', JSON.stringify(m.offline_manager.localData));
        } catch (error) {
            console.error('Failed to save local data:', error);
        }
    },

    loadLocalData(_$, args) {
        try {
            const saved = localStorage.getItem('localData');
            if (saved) {
                m.offline_manager.localData = JSON.parse(saved);
                console.log('Loaded local data for', Object.keys(m.offline_manager.localData).length, 'keys');
            }
        } catch (error) {
            console.error('Failed to load local data:', error);
            m.offline_manager.localData = {};
        }
    },

    getLocalData(_$, args) {
        const item = m.offline_manager.localData[args.key];
        if (item && item.timestamp) {
            // Check if data is still fresh (24 hours)
            const isFresh = (Date.now() - item.timestamp) < (24 * 60 * 60 * 1000);
            if (isFresh) {
                return item.data;
            } else {
                // Remove stale data
                delete m.offline_manager.localData[args.key];
                _$.act.saveLocalData({ key: 'localData', data: m.offline_manager.localData });
            }
        }
        return null;
    },

    // Queue processing
    processOfflineQueue(_$, args) {
        if (!m.offline_manager.isOnline || m.offline_manager.offlineQueue.length === 0) {
            return;
        }

        console.log('Processing offline queue:', m.offline_manager.offlineQueue.length, 'actions');
        
        // Clean up duplicate actions before processing
        _$.act.cleanupDuplicateActions();
        
        // Process in batches
        const batch = m.offline_manager.offlineQueue.slice(0, m.offline_manager.batchSize);
        
        batch.forEach(action => {
            _$.act.processAction(action);
        });

        // Schedule next batch if there are more actions
        if (m.offline_manager.offlineQueue.length > m.offline_manager.batchSize) {
            setTimeout(() => {
                _$.act.processOfflineQueue();
            }, m.offline_manager.batchDelay);
        }
    },

    processAction(_$, args) {
        const action = args;
        
        switch (action.type) {
            case 'update_review_status':
                _$.act.processReviewStatusUpdate(action);
                break;
            case 'edit_response':
                _$.act.processResponseEdit(action);
                break;
            case 'refresh_accounts':
                _$.act.processRefreshAccounts(action);
                break;
            default:
                console.warn('Unknown action type:', action.type);
                _$.act.removeFromOfflineQueue({ id: action.id });
        }
    },

    processReviewStatusUpdate(_$, args) {
        const action = args;
        
        // Validate record id and payload before sending
        const tweetId = action && action.data && action.data.tweetId;
        const status = action && action.data && action.data.status;
        if (!tweetId || typeof tweetId !== 'string') {
            console.warn('Skipping invalid review status action (missing/invalid record id):', action);
            _$.act.removeFromOfflineQueue({ id: action.id });
            return;
        }
        if (status === undefined || status === null) {
            console.warn('Skipping invalid review status action (missing status):', action);
            _$.act.removeFromOfflineQueue({ id: action.id });
            return;
        }

        // Try to update Airtable
        m.card.act.airtable_base()('💬 Tweets').update([{
            id: tweetId,
            fields: { "Review Status": status }
        }], (err, records) => {
            if (err) {
                console.error('Failed to process review status update:', err);
                _$.act.handleActionFailure(action);
            } else {
                console.log('Successfully processed review status update');
                _$.act.removeFromOfflineQueue({ id: action.id });
                
                // Refresh accounts to update scores
                m.account.act.refresh_accounts();
            }
        });
    },

    processResponseEdit(_$, args) {
        const action = args;
        
        // Validate record id and payload before sending
        const tweetId = action && action.data && action.data.tweetId;
        const response = action && action.data && action.data.response;
        if (!tweetId || typeof tweetId !== 'string') {
            console.warn('Skipping invalid response edit action (missing/invalid record id):', action);
            _$.act.removeFromOfflineQueue({ id: action.id });
            return;
        }
        if (response === undefined || response === null) {
            console.warn('Skipping invalid response edit action (missing response):', action);
            _$.act.removeFromOfflineQueue({ id: action.id });
            return;
        }

        // Try to update Airtable
        m.card.act.airtable_base()('💬 Tweets').update([{
            id: tweetId,
            fields: { "Tweet": response }
        }], (err, records) => {
            if (err) {
                console.error('Failed to process response edit:', err);
                _$.act.handleActionFailure(action);
            } else {
                console.log('Successfully processed response edit');
                _$.act.removeFromOfflineQueue({ id: action.id });
            }
        });
    },

    processRefreshAccounts(_$, args) {
        const action = args;
        
        // Try to refresh accounts
        m.account.act.refresh_accounts().then(() => {
            console.log('Successfully refreshed accounts');
            _$.act.removeFromOfflineQueue({ id: action.id });
        }).catch(err => {
            console.error('Failed to refresh accounts:', err);
            _$.act.handleActionFailure(action);
        });
    },

    handleActionFailure(_$, args) {
        const action = args;
        action.retries++;
        
        if (action.retries >= m.offline_manager.maxRetries) {
            console.error('Action failed after max retries:', action);
            _$.act.removeFromOfflineQueue({ id: action.id });
        } else {
            // Move to end of queue for retry
            _$.act.removeFromOfflineQueue({ id: action.id });
            m.offline_manager.offlineQueue.push(action);
            _$.act.saveOfflineQueue();
        }
    },

    // Utility methods
    getQueueStatus(_$, args) {
        return {
            isOnline: m.offline_manager.isOnline,
            queueLength: m.offline_manager.offlineQueue.length,
            hasPendingActions: m.offline_manager.offlineQueue.length > 0
        };
    },

    clearOfflineQueue(_$, args) {
        m.offline_manager.offlineQueue = [];
        _$.act.saveOfflineQueue();
        console.log('Offline queue cleared');
    },

    checkDataFreshness(_$, args) {
        // Check if local data is stale and needs refresh
        const localData = m.offline_manager.localData;
        const now = Date.now();
        const staleThreshold = 30 * 60 * 1000; // 30 minutes
        
        let needsRefresh = false;
        
        Object.keys(localData).forEach(key => {
            if (localData[key].timestamp && (now - localData[key].timestamp) > staleThreshold) {
                needsRefresh = true;
            }
        });
        
        if (needsRefresh) {
            console.log('Local data is stale, refreshing...');
            // Trigger a refresh of accounts and cards
            if (m.account && m.account.act) {
                m.account.act.refresh_accounts();
            }
        }
    }
});

// Initialize offline manager data properties
m.offline_manager.isOnline = navigator.onLine;
m.offline_manager.offlineQueue = [];
m.offline_manager.localData = {};
m.offline_manager.batchSize = 5;
m.offline_manager.batchDelay = 2000; // 2 seconds between batches
m.offline_manager.maxRetries = 3;

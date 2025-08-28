// Load AirTable
let called = false;

m.card.events(_$ => {
    let load_in_data_promises = [
        m.account.act.init()
    ];

    _$("#response").addEventListener("keyup", (e) => { _$.act.edit_response({ text: e.target.value }) });

    _$("#select-all").addEventListener("click", _$.act.select_all);
    _$("#select-all").addEventListener("dblclick", _$.act.clear);

    _$("#disclose-response-edit").addEventListener("click", _$.act.toggle_response_edit);

    _$("[data-component='choice']").forEach((choice, index) => {
        choice.addEventListener("click", () => {
            m.choice.act.select_choice_at_index({ index: index });
        });
    });

    _$("#choice-response").addEventListener("keyup", _$.act.manual_edit);

    if (!called) {
        const validation = m.bottom_nav.act.validate_settings();
        if (!validation.valid) {
            m.curtain.act.set_curtain_text({ text: validation.message });
        }

        called = true;
        
        // Check if we're offline before attempting Airtable fetch
        if (m.offline_manager && !m.offline_manager.act.isOnline()) {
            console.log('Offline detected during initialization, loading from cache...');
            m.curtain.act.set_curtain_text({ text: "Loading from cache..." });
            
            // Try to load from local storage
            const loadedFromStorage = m.card.act.loadFromLocalStorage();
            if (loadedFromStorage && m.card.data.length > 0) {
                console.log('Successfully loaded', m.card.data.length, 'cards from cache');
                m.curtain.act.set_curtain_text({ text: "Done" });
                
                // Initialize the app with cached data
                m.card.act.sort_cards();
                m.account.act.post_init();
                const el = document.querySelector("[data-component='row_tweet']");
                m.row_tweet.act.open_tweet({ row: el });
                
                // Start preloading all avatar images in the background
                setTimeout(() => {
                    m.card.act.preloadAllAvatars();
                }, 100);
                
                _$.act.start();
                return;
            } else {
                console.log('No cached data available, will attempt online fetch...');
                m.curtain.act.set_curtain_text({ text: "No cached data, attempting online fetch..." });
            }
        }
        
        // Proceed with online fetch
        _$.act.airtable_base()('💬 Tweets').select({
            view: "Permutations Review Board",
            maxRecords: 500,
            sort: [{field: "Grade", direction: "desc"}]
        }).eachPage(function page(records, fetchNextPage) {
            records.forEach(record => {
                m.curtain.act.set_curtain_text({ text: "Retrieving Data..." })
                    // There are a bunch of join ops for external tweets potentially
                    // needed for each of these, so we do a Promise.all on this later.
                load_in_data_promises.push(_$.act.load_in_data({ record: record }));
            })

            fetchNextPage();
        }, function done(err) {
            if (err) { 
                console.error('Error fetching from Airtable:', err);
                // If we're offline and have cached data, try to use that instead
                if (m.offline_manager && !m.offline_manager.act.isOnline()) {
                    console.log('Airtable fetch failed, attempting to load from cache...');
                    const loadedFromStorage = m.card.act.loadFromLocalStorage();
                    if (loadedFromStorage && m.card.data.length > 0) {
                        console.log('Successfully loaded', m.card.data.length, 'cards from cache after fetch failure');
                        m.curtain.act.set_curtain_text({ text: "Loaded from cache" });
                        
                        m.card.act.sort_cards();
                        m.account.act.post_init();
                        const el = document.querySelector("[data-component='row_tweet']");
                        m.row_tweet.act.open_tweet({ row: el });
                        
                        setTimeout(() => {
                            m.card.act.preloadAllAvatars();
                        }, 100);
                        
                        _$.act.start();
                        return;
                    }
                }
                // If no cached data available, show error
                m.curtain.act.set_curtain_text({ text: "Failed to load data. Please check your connection." });
                return;
            }

            // Status update: Waiting for joined data...

            Promise.allSettled(load_in_data_promises).then(data => {
                m.curtain.act.set_curtain_text({ text: "Done" });
                if (data.length) {
                    // Sort the cards by grade after all external tweet data is loaded
                    m.card.act.sort_cards();
                    m.account.act.post_init();
                    const el = document.querySelector("[data-component='row_tweet']");
                    m.row_tweet.act.open_tweet({ row: el });
                    
                    // Start preloading all avatar images in the background
                    setTimeout(() => {
                        m.card.act.preloadAllAvatars();
                    }, 100); // Small delay to ensure UI is responsive
                };
                _$.act.start();
            });
        });
    }
})
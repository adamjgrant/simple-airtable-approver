m.card.act({
    airtable_base(_$, args) {
        const Airtable = require('airtable');
        // Get a base ID for an instance of art gallery example
        const base = new Airtable({ token: localStorage.getItem("airtable_token") }).base(localStorage.getItem('airtable_base_id'));
        return base;
    },

    // Preload all avatar images in the background
    preloadAllAvatars(_$, args) {
        if (!m.card.data || m.card.data.length === 0) return;
        
        console.log('Preloading avatar images for', m.card.data.length, 'cards...');
        
        const avatarUrls = new Set();
        
        // Collect all unique avatar URLs
        m.card.data.forEach(card => {
            if (card.thumbnail && card.thumbnail !== "img/bluesky.jpg" && card.thumbnail !== "img/twitter.jpg") {
                avatarUrls.add(card.thumbnail);
            }
            if (card.originator_profile_photo && card.originator_profile_photo !== "img/bluesky.jpg" && card.originator_profile_photo !== "img/twitter.jpg") {
                avatarUrls.add(card.originator_profile_photo);
            }
        });
        
        // Preload each unique avatar
        avatarUrls.forEach(url => {
            _$.act.preloadImage({ url: url });
        });
        
        console.log('Preloading', avatarUrls.size, 'unique avatar images');
    },

    // Preload a single image and store it in cache
    preloadImage(_$, args) {
        if (m.card.imageCache.has(args.url)) {
            return; // Already cached
        }
        
        const img = new Image();
        
        img.onload = () => {
            // Store the loaded image in cache
            m.card.imageCache.set(args.url, img);
            console.log('Preloaded avatar:', args.url);
        };
        
        img.onerror = () => {
            console.warn('Failed to preload avatar:', args.url);
            // Store a flag indicating this image failed to load
            m.card.imageCache.set(args.url, 'failed');
        };
        
        // Start loading the image
        img.src = args.url;
    },

    load_in_data(_$, args) {
        return new Promise((resolve, reject) => {
            const response_options = args.record.get("Response Options");
            let responses = JSON.parse(response_options).length ? JSON.parse(response_options) : [args.record.get("Full tweet")];
            let card_data = {
                id: args.record.getId(),
                tweet: args.record.get("Responds to (Text) cleaned up"),
                response: (responses[0] || ""),
                tweetalt1: response_options.length ? responses[1] : "",
                tweetalt2: response_options.length ? responses[2] : "",
                order: args.record.get("Optional Sort Ordering"),
                job_name: [""].concat(args.record.get("Permutation Job Name")).reverse()[0],
                job_approval_rate: [""].concat(args.record.get("Permutation Job Approval Rate")).reverse()[0],
                job_link: `https://airtable.com/app2X2gnPXhFKDs1t/tblD70jsW5F9jEjGr/viwxIVb4yRM9zrHsY/${[""].concat(args.record.get("Job")).reverse()[0]}?blocks=hide`,
                reply_to_handle: args.record.get("Reply To Handle"),
                sending_account_handle: args.record.get("Sending account handle"),
                link_to_post: _$.act.convert_at_uri_to_bluesky_url({ atUri: args.record.get("Reply To") }),
                thumbnail: _$.act.get_profile_photo({ record: args.record }),
                originator_profile_photo: _$.act.get_originator_profile_photo({ record: args.record }),
                originator_handle: _$.act.get_originator_handle({ record: args.record }),
                grade: (() => {
                    const gradeValue = args.record.get("Grade");
                    return gradeValue || 0;
                })()
            }

            _$.act.get_previous_responses({ record: args.record }).then(previous_responses => {
                card_data.previous_responses = previous_responses;
                
                // Save card data to local storage for offline use
                if (m.offline_manager && m.offline_manager.act) {
                    m.offline_manager.act.saveLocalData({
                        key: `card_${card_data.id}`,
                        data: card_data
                    });
                }
                
                resolve(m.card.data.push(card_data));
            }).catch(err => {
                console.warn("Failed to load previous responses for tweet:", args.record.getId(), err);
                // Still add the card data even if external tweets fail to load
                card_data.previous_responses = [];
                
                // Save card data to local storage for offline use
                if (m.offline_manager && m.offline_manager.act) {
                    m.offline_manager.act.saveLocalData({
                        key: `card_${card_data.id}`,
                        data: card_data
                    });
                }
                
                resolve(m.card.data.push(card_data));
            });
        })
    },

    get_profile_photo(_$, args) {
        const photo_record = args.record.get("Twitter Photo");
        if (!photo_record || !photo_record.length) return "img/bluesky.jpg"; // Keep existing image for now
        return photo_record[0].url;
    },

    get_originator_profile_photo(_$, args) {
      const photo_record = args.record.get("Profile photo");
      if (!photo_record || !photo_record.length) return "img/bluesky.jpg"; // Keep existing image for now
      return photo_record;
    },

    get_originator_handle(_$, args) {
      const handle = args.record.get("Reply To Handle");
      if (!handle || !handle.length) return "They say";
      return `@${handle}`;
    },

    start(_$, args) {
        // _$.act.advance_to_next_card();
    },

    loadFromLocalStorage(_$, args) {
        // Try to load card data from local storage if offline
        if (m.offline_manager && !m.offline_manager.act.isOnline()) {
            const localData = m.offline_manager.act.getLocalData({ key: 'cardData' });
            if (localData && localData.length > 0) {
                m.card.data = localData;
                console.log('Loaded', localData.length, 'cards from local storage');
                return true;
            }
        }
        return false;
    },

    saveAllToLocalStorage(_$, args) {
        // Save all card data to local storage for offline use
        if (m.offline_manager && m.offline_manager.act) {
            m.offline_manager.act.saveLocalData({
                key: 'cardData',
                data: m.card.data
            });
            console.log('Saved', m.card.data.length, 'cards to local storage');
        }
    },

    format_card(_$, args) {
        const turn_hashtags_into_links = (str) => {
            return str.replace(/#\w+/g, (capture_group) => {
                return `<a href="#">${capture_group}</a>`
            });
        }

        m.card.this_card.tweet = turn_hashtags_into_links(m.card.this_card.tweet);
        m.card.this_card.response = m.card.this_card.response;
    },

    no_more_cards(_$, args) {
        // Don't confuse a bad connection with a good connection with no cards.
        if (_$.act.bad_connection_details()) return false;
        return !m.card.data.length;
    },

    bad_connection_details(_$, args) {
        return !m.bottom_nav.valid_settings;
    },

    advance_to_next_card(_$, args = {}) {
        m.metadata.act.hide_badge();
        if (m.card.this_card != null) m.card.cards_processed.push(m.card.this_card);

        if (_$.act.no_more_cards()) {
            m.bottom_nav.act.hide();
            return m.curtain.act.set_curtain_text({ text: "Session complete. Refresh for more tweets" });
        }

        if (_$.act.bad_connection_details()) {
            m.bottom_nav.act.show();
            return m.curtain.act.set_curtain_text({ text: "Could not find Airtable Token/Base ID" });
        }

        m.bottom_nav.act.show();
        if (args.this_card) {
            m.card.data.splice(args.index, 1);
            m.card.this_card = args.this_card;
        } else {
            m.card.this_card = m.card.data.shift();

            const handle = m.card.this_card.sending_account_handle;

            // In case there is a filter, let's skip next items that match the filter.
            if (!m.account.act.handle_is_in_filter({ handle })) {
                _$.act.advance_to_next_card();
            }
        }
        m.embedded_tweet.act.hide_all();
        _$.act.format_card();
        _$.act.set_card_values();
        m.metadata.act.set_badge({
            job_name: m.card.this_card.job_name,
            job_approval_rate: m.card.this_card.job_approval_rate,
            job_link: m.card.this_card.job_link
        });
        m.metadata.act.set_response_quality({
            grade: m.card.this_card.grade
        });

        m.viewport.act.scroll_to_top();
    },

    advance_to_card_at_index(_$, args) {
        const this_card = m.card.data[args.index];
        _$.act.advance_to_next_card({ this_card: this_card, index: args.index });
    },

    reject_card_at_index(_$, args) {
        const this_card = m.card.data[args.index];
        m.bottom_nav.act
            .reject_specific_card({ this_card: this_card, index: args.index })
            .then();
    },

    undo(_$, args) {
        if (!m.card.cards_processed.length) return console.error("No card to go back to");
        m.card.data.unshift(m.card.this_card);
        m.card.this_card = m.card.cards_processed.pop();
        m.bottom_nav.act.in_review();
        _$.act.format_card();
        _$.act.set_card_values();
        m.tabs.act.set_tab_filter();
    },

    reset_card_values(_$, args) {
        // Reset
        _$(".tweet-minus-1").classList.remove("show");
        _$(".tweet-minus-2").classList.remove("show");
        m.choice.act.set_text_for_choice_at_index({ text: "", index: 0 });
        m.choice.act.set_text_for_choice_at_index({ text: "", index: 1 });
        m.choice.act.set_text_for_choice_at_index({ text: "", index: 2 });
    },

    set_card_values(_$, args) {
        _$.act.reset_card_values();
        _$("#tweet").innerHTML = _$.act.format_embedded_tweet_at_index({ tweet: m.card.this_card.tweet, index: 0 });

        const initial_choice = m.card.this_card.response;
        _$("#response").innerHTML = initial_choice;
        _$("#response").value = initial_choice;
        m.choice.act.set_choice_response({ text: initial_choice });

        m.choice.act.set_text_for_choice_at_index({ text: m.card.this_card.response, index: 0 });
        m.choice.act.set_text_for_choice_at_index({ text: m.card.this_card.tweetalt1, index: 1 });
        m.choice.act.set_text_for_choice_at_index({ text: m.card.this_card.tweetalt2, index: 2 });

        // Set default images immediately for instant display
        _$("#response-thumbnail").src = "img/bluesky.jpg";
        _$("#originator-profile-photo").src = "img/bluesky.jpg";
        
        // Then load the actual images asynchronously
        _$.act.lazy_load_profile_photo({ 
            element: _$("#response-thumbnail"), 
            photoUrl: m.card.this_card.thumbnail 
        });
        _$.act.lazy_load_profile_photo({ 
            element: _$("#originator-profile-photo"), 
            photoUrl: m.card.this_card.originator_profile_photo 
        });
        
        _$("#originator-handle").innerHTML = m.card.this_card.originator_handle;

        _$(".link-to-post").forEach(link => {
            link.href = m.card.this_card.link_to_post;
        });

        m.card.this_card.previous_responses.forEach((response, i) => {
            _$(`#tweet-minus-${i + 1}`).innerHTML = _$.act.format_embedded_tweet_at_index({ tweet: response.tweet, index: i + 1 });
            _$(`.tweet-minus-${i + 1}`).classList.add("show");
        });

        m.choice.act.reset_choices();
    },

    lazy_load_profile_photo(_$, args) {
        // If the photo URL is the default bluesky image, don't reload it
        if (args.photoUrl === "img/bluesky.jpg" || args.photoUrl === "img/twitter.jpg") {
            return;
        }
        
        // Check if the image is already cached
        if (m.card.imageCache.has(args.photoUrl)) {
            const cachedImage = m.card.imageCache.get(args.photoUrl);
            if (cachedImage !== 'failed' && args.element && args.element.parentNode) {
                // Use cached image immediately
                args.element.src = args.photoUrl;
                return;
            } else if (cachedImage === 'failed') {
                // Image failed to load previously, keep default
                return;
            }
        }
        
        // If not cached, load it and cache for future use
        const img = new Image();
        
        img.onload = () => {
            // Cache the successfully loaded image
            m.card.imageCache.set(args.photoUrl, img);
            
            // Only update the src if the element still exists and we're still on the same card
            if (args.element && args.element.parentNode) {
                args.element.src = args.photoUrl;
            }
        };
        
        img.onerror = () => {
            // Cache the failure to avoid retrying
            m.card.imageCache.set(args.photoUrl, 'failed');
            console.warn(`Failed to load profile photo: ${args.photoUrl}`);
        };
        
        // Start loading the image
        img.src = args.photoUrl;
    },

    toggle_response_edit(_$, args) {
        const twitter_box = _$(".twitter-box")[_$(".twitter-box").length - 1];
        if (twitter_box.classList.contains("response-edit-hidden")) {
            twitter_box.classList.remove("response-edit-hidden");
        } else {
            twitter_box.classList.add("response-edit-hidden");
        }
    },

    // Preload a single image and store it in cache
    preloadImage(_$, args) {
        if (m.card.imageCache.has(args.url)) {
            return; // Already cached
        }
        
        const img = new Image();
        
        img.onload = () => {
            // Store the loaded image in cache
            m.card.imageCache.set(args.url, img);
            console.log('Preloaded avatar:', args.url);
        };
        
        img.onerror = () => {
            console.warn('Failed to preload avatar:', args.url);
            // Store a flag indicating this image failed to load
            m.card.imageCache.set(args.url, 'failed');
        };
        
        // Start loading the image
        img.src = args.url;
    },

    priv: {
        format_embedded_tweet_at_index(_$, args) {
            const embed_regex = /https\:\/\/t\.co\/\w+/
            const matches = args.tweet.match(embed_regex);
            if (matches && matches[0]) {
                m.embedded_tweet.act.set_tweet_at_index({
                    url: matches[0],
                    index: (2 - args.index)
                })
            }
            return args.tweet.replace(embed_regex, "");
        },

        get_previous_responses(_$, args) {
            return new Promise((resolve, reject) => {
                const external_tweet = args.record.get("External tweets");
                const responds_to_text = args.record.get("Responds to (Text)");

                // Always try to fetch external tweets if they exist
                if (external_tweet && external_tweet.length > 0) {
                    let responses = [];
                    let processed_ids = new Set(); // Prevent infinite loops
                    
                    // Add timeout to prevent hanging
                    const timeout = setTimeout(() => {
                        console.warn("Timeout reached while loading external tweets, resolving with current responses");
                        resolve(responses);
                    }, 10000); // 10 second timeout

                    const get_tweet = (record_id) => {
                        if (processed_ids.has(record_id)) {
                            console.warn("Circular reference detected for external tweet ID:", record_id);
                            clearTimeout(timeout);
                            return resolve(responses);
                        }
                        
                        processed_ids.add(record_id);
                        
                        _$.act.get_external_tweet_for_record_id({ recordId: record_id }).then(tweet => {
                            responses.push(tweet);
                            
                            // Only try to fetch more if responds_to exists and has a value
                            if (tweet.responds_to && tweet.responds_to.length > 0) {
                                get_tweet(tweet.responds_to[0]);
                            } else {
                                clearTimeout(timeout);
                                resolve(responses);
                            }
                        }).catch(err => {
                            console.warn("Failed to fetch external tweet:", err);
                            clearTimeout(timeout);
                            // Don't reject the entire promise, just resolve with what we have
                            resolve(responses);
                        });
                    }
                    get_tweet(external_tweet[0]);
                } else {
                    resolve([]);
                }
            });
        },

        get_external_tweet_for_record_id(_$, args) {
            return new Promise((resolve, reject) => {
                _$.act.airtable_base()('📧 External tweets').find(args.recordId, function(err, record) {
                    if (err) { 
                        console.warn("Error finding external tweet:", err); 
                        return reject(err); 
                    }
                    
                    if (!record) {
                        console.warn("External tweet record not found for ID:", args.recordId);
                        return reject(new Error("External tweet record not found"));
                    }
                    
                    const tweet = record.get("Tweet");
                    // Use the correct field: "Responded from (Internal)" instead of "Responds to (external)"
                    const respondedFrom = record.get("Responded from (Internal)");
                    
                    if (!tweet) {
                        console.warn("External tweet record missing 'Tweet' field for ID:", args.recordId);
                        return reject(new Error("External tweet missing Tweet field"));
                    }
                    
                    const result = {
                        tweet: tweet,
                        // Since this is the external tweet being responded to, it doesn't have a "responds_to" field
                        // The relationship is the other way around - the main tweet responds to this external tweet
                        responds_to: null
                    };
                    return resolve(result);
                });
            });
        },

        convert_at_uri_to_bluesky_url(_$, args) {
            const atUri = args.atUri;
            if (!atUri) return atUri;

            // Check if it's already a Bluesky URL
            if (atUri.startsWith('https://bsky.app/profile/')) {
                return atUri;
            }

            // Parse AT protocol URI: at://did:plc:.../app.bsky.feed.post/rkey
            const uriMatch = atUri.match(/^at:\/\/([^\/]+)\/app\.bsky\.feed\.post\/([^:]+)/);
            if (!uriMatch) return atUri; // Not a valid AT URI

            const did = uriMatch[1];
            const rkey = uriMatch[2];
            
            return `https://bsky.app/profile/${did}/post/${rkey}`;
        }
    },

    manual_edit(_$, args) {
        const text = _$("#choice-response").value;
        _$.act.change_response_field({ text });
        _$.act.edit_response({ text });
        
        // Also update the selected choice's <p> element in real-time
        if (m.choice && m.choice.selected_index !== undefined && m.choice.selected_index < 3) {
            m.choice.act.set_text_for_choice_at_index({ text: text, index: m.choice.selected_index });
        }
    },

    change_response_field(_$, args) {
        // This exists because some external components need to both 
        // change the textarea and change the remote data's response.
        // Some components shouldn't use this because they are
        // triggered by editing the textarea already.
        _$("#response").value = args.text;
        _$("#response").innerHTML = args.text;
    },

    edit_response(_$, args) {
        // m.bottom_nav.act.disable();
        m.status_indicator.act.set_status_yellow({ reset: false });

        // Update the card's in-memory data based on which choice is selected
        if (m.card.this_card && m.choice && m.choice.selected_index !== undefined) {
            if (m.choice.selected_index === 0) {
                m.card.this_card.response = args.text;
            } else if (m.choice.selected_index === 1) {
                m.card.this_card.tweetalt1 = args.text;
            } else if (m.choice.selected_index === 2) {
                m.card.this_card.tweetalt2 = args.text;
            } else {
                // Autofill or no selection - update response (default)
                m.card.this_card.response = args.text;
            }
        }

        // Check if we're offline
        console.log('Card edit: Checking offline status:', m.offline_manager?.isOnline, 'navigator.onLine:', navigator.onLine);
        if (m.offline_manager && !m.offline_manager.act.isOnline()) {
            console.log('Card edit: Offline detected, updating local cache...');
            
            // Update local storage immediately
            if (m.card.this_card) {
                m.offline_manager.act.saveLocalData({
                    key: `card_${m.card.this_card.id}`,
                    data: m.card.this_card
                });
            }
            
            // Smart queue management - only keep the latest edit for each tweet
            _$.act.updateOfflineEditQueue({
                tweetId: m.card.this_card.id,
                response: args.text
            });
            
            m.status_indicator.act.set_status_green();
            m.bottom_nav.act.enable();
            return;
        } else {
            console.log('Card edit: Online, proceeding with Airtable update...');
        }

        common.debounce(() => {
                console.log('Debounce firing - updating Airtable with text:', args.text);
                
                // Build Response Options array from the current card data
                // The card data has already been updated above based on selected_index
                let responseOptions = [
                    m.card.this_card.response || "",
                    m.card.this_card.tweetalt1 || "",
                    m.card.this_card.tweetalt2 || ""
                ];
                
                console.log('Building Response Options from card data:', responseOptions);
                
                // Update both "Tweet" and "Response Options" fields
                const fields = { 
                    "Tweet": args.text,
                    "Response Options": JSON.stringify(responseOptions)
                };
                
                console.log('Updating Response Options:', responseOptions);
                
                m.card.act.airtable_base()('💬 Tweets').update([{
                    id: m.card.this_card.id,
                    fields: fields
                }], function(err, records) {
                    if (err) {
                        console.error('Airtable update error:', err);
                        m.status_indicator.act.set_status_red();
                        return console.error(err);
                    } else {
                        console.log('Airtable update successful');
                        m.bottom_nav.act.enable();
                        m.status_indicator.act.set_status_green();
                    }
                });
            },
            'edit',
            1000,
        );
    },

    select_all(_$, args) {
        _$("#response").select();
    },

    clear(_$, args) {
        _$("#response").value = "";
        _$("#response").innerHTML = "";
    },

    sort_cards(_$, args) {
        // Sort by Grade property in descending order (highest values first)
        m.card.data = m.card.data.sort((a, b) => {
            // Handle cases where grade might be null/undefined
            const gradeA = a.grade || 0;
            const gradeB = b.grade || 0;
            return gradeB - gradeA; // Descending order (highest first)
        });
        
        // TODO: I can't remember why I did this.
        // Apply the random distribution after sorting by grade
        // m.card.data = _$.act.take_ten_percent_of_items_randomly_and_distribute_them_as_every_tenth_item_in_the_array({
        //     cards: m.card.data
        // })
    },

    take_ten_percent_of_items_randomly_and_distribute_them_as_every_tenth_item_in_the_array(_$, args) {
        const arr = args.cards;
        const number_of_items_to_select = Math.round(arr.length/10);
        for (let x=0;x<number_of_items_to_select;x++) {
          const randomly_chosen_item_index = Math.floor(Math.random()*arr.length);
          const randomly_chosen_item = arr.splice(randomly_chosen_item_index, 1)[0];
          const new_position = x*10+9;
          arr.splice(new_position, 0, randomly_chosen_item);
        }
        return arr; 
    },

    updateOfflineEditQueue(_$, args) {
        // Smart queue management for offline edits
        // Only keep the latest edit for each tweet to avoid duplicate actions
        const { tweetId, response } = args;
        
        if (!m.offline_manager || !m.offline_manager.act) {
            return;
        }
        
        // Use the smart queue method to update existing action or add new one
        m.offline_manager.act.updateOrAddToOfflineQueue({
            type: 'edit_response',
            data: {
                tweetId: tweetId,
                response: response
            },
            updateKey: 'tweetId' // Use tweetId to identify duplicate actions
        });
        
        console.log('Offline edit queue updated for tweet:', tweetId);
    }
})

m.card.data = [];
m.card.cards_processed = [];
m.card.this_card = null;
m.card.imageCache = new Map();
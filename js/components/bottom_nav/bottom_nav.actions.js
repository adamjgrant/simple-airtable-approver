m.bottom_nav.acts({
    get_settings(_$, args) {
        const token = prompt("Airtable Personal Access Token");
        const base = prompt("Airtable base ID");

        localStorage.setItem("airtable_token", token);
        localStorage.setItem("airtable_base_id", base);

        alert("Set.");
    },

    validate_settings(_$, args) {
        let token = localStorage.getItem("airtable_token");
        let base_id = localStorage.getItem("airtable_base_id");

        let return_obj = { valid: false, message: "" };
        let missing_fields_array = [];

        if (token == "null") token = undefined;
        if (base_id == "null") base_id = undefined;

        if (!token) missing_fields_array.push("Airtable Token");
        if (!base_id) missing_fields_array.push("Airtable Base ID");
        if (token && base_id) return_obj.valid = true;

        if (!return_obj.valid) {
            return_obj.message = `${missing_fields_array.join(" and ")} missing.`
            _$.act.get_settings();
        }

        m.bottom_nav.valid_settings = return_obj.valid;
        return return_obj;
    },

    approve(_$, args) {
        _$.act.update_review_status({ status: 1 });
        m.odometer.act.register_that_an_approval_has_happened({ id: m.card.this_card.id });
        if (args.dont_advance) { return; }
        m.card.act.advance_to_next_card();
    },

    approve_and_go_back(_$, args) {
        _$.act.approve({ dont_advance: true });
        m.viewport.act.show_timeline();
    },

    reject(_$, args) {
        _$.act.update_review_status({ status: -1 });
        m.odometer.act.unregister_an_approval({ id: m.card.this_card.id });
        if (args.dont_advance) { return; }
        m.card.act.advance_to_next_card();
    },

    reject_and_go_back(_$, args) {
        _$.act.reject({ dont_advance: true });
        m.viewport.act.show_timeline();
    },

    reject_specific_card(_$, args) {
        m.card.data.splice(args.index, 1);
        m.row_tweet.act.populate();
        return new Promise((resolve, reject) => {
            _$.act.update_review_status({
                status: -1,
                this_card: args.this_card,
                cb: () => {
                    resolve();
                },
                ecb: reject
            });
        });
    },

    in_review(_$, args) {
        _$.act.update_review_status({ status: 0 });
    },

    show(_$, args) {
        document.querySelector("[data-component~='bottom_nav']").classList.remove("hide");
    },

    hide(_$, args) {
        document.querySelector("[data-component~='bottom_nav']").classList.add("hide");
    },

    disable(_$, args) {
        document.querySelector("[data-component~='bottom_nav']").classList.add("disabled");
    },

    enable(_$, args) {
        document.querySelector("[data-component~='bottom_nav']").classList.remove("disabled");
    },

            priv: {
            update_review_status(_$, args = {}) {
                m.status_indicator.act.set_status_yellow({ reset: false });
                let new_status = "Pending Review";
                if (args.status > 0) new_status = "Approved";
                if (args.status < 0) new_status = "Rejected";

                // Offline update of review status
                let score_modification = {};
                score_modification[args.status > 0 ? "approved" : "rejected"] = 1;
                score_modification["in_review"] = -1;

                const this_card = args.this_card || m.card.this_card;
                m.account.act.offline_score_update_for_handle({
                    handle: this_card.sending_account_handle,
                    score: score_modification
                })

                // Check if we're offline
                console.log('Checking offline status:', m.offline_manager?.isOnline, 'navigator.onLine:', navigator.onLine);
                if (m.offline_manager && !m.offline_manager.act.isOnline()) {
                    console.log('Offline detected, queuing action...');
                    // Queue the review status update for when we're online
                    m.offline_manager.act.addToOfflineQueue({
                        type: 'update_review_status',
                        data: {
                            tweetId: this_card.id,
                            status: new_status
                        }
                    });
                    
                    // Update local storage immediately
                    if (this_card) {
                        this_card.review_status = new_status;
                        m.offline_manager.act.saveLocalData({
                            key: `card_${this_card.id}`,
                            data: this_card
                        });
                    }
                    
                    m.status_indicator.act.set_status_green();
                    if (args.cb) args.cb();
                    return;
                } else {
                    console.log('Online, proceeding with Airtable update...');
                }

                m.card.act.airtable_base()('💬 Tweets').update([{
                    id: this_card.id,
                    fields: { "Review Status": new_status }
                }], function(err, records) {
                    if (err) {
                        if (args.ecb) args.ecb();
                        m.status_indicator.act.set_status_red();
                        return console.error(err);
                    }
                    if (args.cb) args.cb();
                    m.status_indicator.act.set_status_green();
                    m.account.act.refresh_accounts();
                });
            }
        }
})
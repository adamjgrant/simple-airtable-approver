m.account.accounts = [];
m.account.account_filter = [];

m.account.Account = class {
    constructor(handle, airtable_record_id, scores) {
        this.handle = handle;
        this.airtable_record_id = airtable_record_id;
        this._scores = scores;
    }

    get raw_handle() {
        return this.handle.replace(/\w*\s?@/, "").trim();
    }

    get scores() {
        return this._scores || {
            rejected: 0,
            in_review: 0,
            accepted: 0
        }
    }

    set scores(modified_scores) {
        this._scores = modified_scores;
    }
}

m.account.acts({
    init(_$, args) {
        // The Promise object to remove the need for a bunch of downstream
        // promise objects.
        // After this is run, the application can then start (curtain removed)
        // and we can expect things like m.account.accounts to be populated.
        return new Promise((resolve, reject) => {
            _$.act.refresh_accounts().then(accounts => {
                setInterval(_$.act.refresh_accounts, 60000);
                resolve(accounts);
            });
        });
    },

    post_init(_$, args) {
        m.card.act.sort_cards();
        m.tabs.act.generate_all_tabs();
        m.row_tweet.act.populate();
        m.tabs.act.select_tab({ name: "all" });
        m.curtain.act.remove_curtain()
    },

    refresh_accounts(_$, args) {
        return new Promise((resolve, reject) => {
            _$.act.get_accounts().then(accounts => {
                if (!m.account.account_filter.length) _$.act.add_all_accounts_to_filter();
                _$.act.set_scores();
                resolve(accounts);
            });
        })
    },

    set_scores: function set_scores(_$, args) {
        let scores = {
            rejected: 0,
            in_review: 0,
            approved: 0
        };

        m.account.account_filter.forEach(handle => {
            const account = _$.act.find_account_by_handle({ handle });
            scores.rejected += account.scores.rejected;
            scores.in_review += account.scores.in_review;
            scores.approved += account.scores.approved;
        })

        _$("#score-rejected").innerText = String(scores.rejected).padStart(3, '0');
        _$("#score-in-review").innerText = String(scores.in_review).padStart(3, '0');
        _$("#score-approved").innerText = String(scores.approved).padStart(3, '0');
    },

    find_account_by_handle(_$, args) {
        return m.account.accounts.find(account => account.raw_handle === args.handle);
    },

    set_account_filter_to_one_account_by_handle(_$, args) {
        if (args.handle === "all") return _$.act.add_all_accounts_to_filter();
        m.account.account_filter = [args.handle];
    },

    get_account_filter_handles(_$, args) {
        return m.account.account_filter;
    },

    add_all_accounts_to_filter(_$, args) {
        m.account.account_filter = m.account.accounts.map(account => account.raw_handle);
    },

    handle_is_in_filter(_$, args) {
        return m.account.account_filter.find(raw_handle => {
            const arg_raw_handle = new m.account.Account(args.handle, "", {}).raw_handle;
            return raw_handle === arg_raw_handle;
        });
    },

    offline_score_update_for_handle(_$, args) {
        // For a little UX boost, when a vote is made, update the score immediately
        // while we're waiting for the remote update.
        // e.g. { handle: "nicegoingadam", score: { approved: 1 } }
        const raw_handle = _$.act.get_raw_handle_for_handle({ handle: args.handle });
        const account_index = m.account.accounts.findIndex(account => account.raw_handle === raw_handle);

        if (account_index < 0) {
            console.error("Could not find account for handle " + raw_handle);
            return;
        }

        let modified_scores = m.account.accounts[account_index].scores;
        Object.keys(args.score).forEach(key => {
            const value = args.score[key];
            modified_scores[key] += value;
            m.account.accounts[account_index].scores = modified_scores;
        });

        return _$.act.set_scores();
    },

    get_raw_handle_for_handle(_$, args) {
        const throwaway_account = new m.account.Account(args.handle, "", {});
        return throwaway_account.raw_handle;
    },

    priv: {
        get_accounts(_$, args = {}) {
            let all_records = [];
            return new Promise((resolve, reject) => {
                m.card.act.airtable_base()('🙂 Accounts').select({
                    view: "Active permutations"
                }).eachPage(function page(records, fetchNextPage) {
                    all_records = all_records.concat(records);
                    fetchNextPage();

                }, function done(err) {
                    if (err) {
                        console.error(err);
                        reject(err);
                    }
                    _$.act.turn_account_records_into_account_objects({ all_records })
                        .then(accounts => resolve());
                });
            });
        },

        turn_account_records_into_account_objects(_$, args) {
            return new Promise((resolve, reject) => {
                const accounts_as_airtable_records = args.all_records;
                const retrieval_promises = [];
                m.account.accounts = [];
                accounts_as_airtable_records.forEach(record => {
                    retrieval_promises.push(new Promise((_resolve, _reject) => {
                        const rejected = record.get("# Rejected");
                        const in_review = record.get("# In Review");
                        const approved_and_waiting = record.get("# Approved and waiting");
                        const handle = record.get("Handle");
                        const scores = {
                            rejected: rejected,
                            in_review: in_review,
                            approved: approved_and_waiting
                        };

                        const account = new m.account.Account(handle, record.id, scores);

                        m.account.accounts.push(account);
                        _resolve(account);
                    }));
                })
                Promise.allSettled(retrieval_promises).then(results => {
                    resolve(m.account.accounts);
                });
            });
        }
    }
});
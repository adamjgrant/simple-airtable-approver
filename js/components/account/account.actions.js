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
}

m.account.acts({
    init(_$, args) {
        // The Promise object to remove the need for a bunch of downstream
        // promise objects.
        // After this is run, the application can then start (curtain removed)
        // and we can expect things like m.account.accounts to be populated.
        return new Promise((resolve, reject) => {
            _$.act.get_accounts().then(accounts => {
                _$.act.add_all_accounts_to_filter();
                _$.act.set_scores();
                setInterval(_$.act.set_scores, 5000);
                resolve(accounts);
            });
        });
    },

    set_scores: function set_scores(_$, args) {
        let scores = {
            rejected: 0,
            in_review: 0,
            approved: 0
        };

        m.account.account_filter.forEach(account => {
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
        if (args.handle === "all") return m.account.account_filter = m.account.accounts;
        const account = _$.act.find_account_by_handle({ handle: args.handle });
        m.account.account_filter = [account];
    },

    get_account_filter_handles(_$, args) {
        return m.account.account_filter.map(account => account.raw_handle);
    },

    add_all_accounts_to_filter(_$, args) {
        m.account.account_filter = m.account.accounts;
    },

    handle_is_in_filter(_$, args) {
        // TODO: Confirm if a passed in (raw) handle is in the filter.
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
                accounts_as_airtable_records.forEach(record => {
                    retrieval_promises.push(new Promise((_resolve, _reject) => {
                        const rejected = record.get("# Rejected");
                        const in_review = record.get("# In Review");
                        const approved = record.get("# Approved");
                        const handle = record.get("Handle");
                        const scores = {
                            rejected: rejected,
                            in_review: in_review,
                            approved: approved
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
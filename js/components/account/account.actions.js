m.account.accounts = [];

m.account.Account = class {
    constructor(handle, airtable_record_id) {
        this.handle = handle;
        this.airtable_record_id = airtable_record_id;
        this.scores = {
            rejected: 0,
            in_review: 0,
            approved: 0
        }
    }

    get raw_handle() {
        // TODO: Use a regex instead to get everything between the "@" and the next space.
        return this.handle.replace("Permutations", "").replace("@", "").trim();
    }

    update_score() {
        // TODO: Just set the in-memory data. The remote call should happen elsewhere
        //       and across all accounts.
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
                _$.act.set_scores();
                setInterval(_$.act.set_scores, 5000);
                resolve(accounts);
            });
        });
    },

    set_scores: function set_scores(_$, args) {
        // TODO: This should only update the UI and shows summed-up scores for the
        //       filtered accounts.
        // TODO: Pass in account object
        _$.act.get_scores_for_account().then(scores => {
            _$("#score-rejected").innerText = String(scores.rejected).padStart(3, '0');
            _$("#score-in-review").innerText = String(scores.in_review).padStart(3, '0');
            _$("#score-approved").innerText = String(scores.approved).padStart(3, '0');
        });
    },

    find_account_by_handle(_$, args) {
        return m.account.accounts.find(account => account.raw_handle === args.handle);
    },

    set_account_filter(_$, args) {
        const account = _$.act.find_account_by_handle({ handle: args.handle });
        // TODO: Set m.account.account_filter to an array with the m.account.Account
        //       objects that should be shown.
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
                    resolve(all_records);
                });
            });
        },


        get_scores_for_account(_$, args = {}) {
            // TODO: Takes an account object as input
            return new Promise((resolve, reject) => {
                // TODO: Make this work with any account
                m.card.act.airtable_base()('🙂 Accounts').find('rec1IPb2uSQz3GKrf', function(err, record) {
                    if (err) {
                        if (args.ecb) args.ecb();
                        m.status_indicator.act.set_status_red();
                        return console.error(err);
                    }
                    if (args.cb) args.cb();
                    const scores = {
                        rejected: record.get("# Rejected"),
                        in_review: record.get("# In Review"),
                        approved: record.get("# Approved")
                    }
                    resolve(scores);
                });
            });
        }
    }
});
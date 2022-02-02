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
    set_scores: function set_scores(_$, args) {
        // TODO: This should only update the UI and shows summed-up scores for the
        //       filtered accounts.
        _$.act.get_scores().then(scores => {
            _$("#score-rejected").innerText = String(scores.rejected).padStart(3, '0');
            _$("#score-in-review").innerText = String(scores.in_review).padStart(3, '0');
            _$("#score-approved").innerText = String(scores.approved).padStart(3, '0');
        });
    },

    get_accounts_available(_$, args) {
        // TODO: Populate m.account.accounts with m.account.Account objects
    },

    set_account_filter(_$, args) {
        // TODO: Set m.account.account_filter to an array with the m.account.Account
        //       objects that should be shown.
    },

    handle_is_in_filter(_$, args) {
        // TODO: Confirm if a passed in (raw) handle is in the filter.
    },

    priv: {
        get_scores(_$, args = {}) {
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
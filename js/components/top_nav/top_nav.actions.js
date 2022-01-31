m.top_nav.act({
    set_scores: function set_scores(_$, args) {
        _$.act.get_scores().then(scores => {
            _$("#score-rejected").innerText = scores.rejected;
            _$("#score-approved").innerText = scores.approved;
            _$("#score-in-review").innerText = scores.in_review;
        });
    },

    priv: {
        get_scores(_$, args = {}) {
            return new Promise((resolve, reject) => {
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
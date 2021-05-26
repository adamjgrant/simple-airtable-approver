m.toolbar.acts({
    get_settings(_$, args) {
        const api_key = prompt("Airtable API Key");
        const base = prompt("Airtable base ID");

        localStorage.setItem("airtable_api_key", api_key);
        localStorage.setItem("airtable_base_id", base);

        alert("Set.");
    },

    approve(_$, args) {
        _$.act.update_review_status({ status: 1 });
    },

    reject(_$, args) {
        _$.act.update_review_status({ status: -1 });
    },

    priv: {
        update_review_status(_$, args) {
            base('💬 Tweets').update([{
                id: m.card.this_card.id,
                fields: {
                    "Review Status": args.status > 0 ? "Approved" : "Rejected"
                }
            }], function(err, records) {
                if (err) return console.error(err);
            });
        }
    }
})
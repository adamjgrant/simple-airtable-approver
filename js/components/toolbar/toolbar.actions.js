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
        m.card.act.advance_to_next_card();
    },

    reject(_$, args) {
        _$.act.update_review_status({ status: -1 });
        m.card.act.advance_to_next_card();
    },

    in_review(_$, args) {
        _$.act.update_review_status({ status: 0 });
    },

    priv: {
        update_review_status(_$, args) {
            let new_status = "Pending Review";
            if (args.status > 0) new_status = "Approved";
            if (args.status < 0) new_status = "Rejected";
            base('💬 Tweets').update([{
                id: m.card.this_card.id,
                fields: { "Review Status": new_status }
            }], function(err, records) {
                if (err) return console.error(err);
            });
        }
    }
})
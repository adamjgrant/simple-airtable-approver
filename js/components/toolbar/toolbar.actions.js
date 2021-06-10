m.toolbar.acts({
    get_settings(_$, args) {
        const api_key = prompt("Airtable API Key");
        const base = prompt("Airtable base ID");

        localStorage.setItem("airtable_api_key", api_key);
        localStorage.setItem("airtable_base_id", base);

        alert("Set.");
    },

    validate_settings(_$, args) {
        const key = localStorage.getItem("airtable_api_key");
        const base_id = localStorage.getItem("airtable_base_id");

        let return_obj = { valid: false, message: "" };
        let missing_fields_array = [];

        if (!key) missing_fields_array.push("Airtable Key");
        if (!base_id) missing_fields_array.push("Airtable Base ID");
        if (key && base_id) return_obj.valid === true;

        if (!return_obj.valid) return_obj.message = `${missing_fields_array.join(" and ")} missing.`

        return return_obj;
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

    reset_status(_$, args) {
        _$(".status-indicator").classList.remove("green");
        _$(".status-indicator").classList.remove("red");
        _$(".status-indicator").classList.remove("yellow");
    },

    set_status_green(_$, args) { _$.act.set_status({ color: "green" }) },

    set_status_red(_$, args) { _$.act.set_status({ color: "red" }) },

    set_status_yellow(_$, args) { _$.act.set_status({ color: "yellow" }) },

    priv: {
        set_status(_$, args) {
            _$.act.reset_status();
            _$(".status-indicator").classList.add(args.color);
            const reset = _$.act.debounce({
                func: _$.act.reset_status,
                wait: 2000,
            });
            reset();
        },

        update_review_status(_$, args) {
            m.card.act.set_status_yellow();
            let new_status = "Pending Review";
            if (args.status > 0) new_status = "Approved";
            if (args.status < 0) new_status = "Rejected";
            m.card.act.airtable_base()('💬 Tweets').update([{
                id: m.card.this_card.id,
                fields: { "Review Status": new_status }
            }], function(err, records) {
                if (err) {
                    m.card.act.set_status_red();
                    return console.error(err);
                }
                m.card.act.set_status_green();
            });
        },

        debounce(_$, args) {
            const func = args.func;
            const wait = args.wait;
            const immediate = args.immediate;

            var timeout;
            return function() {
                var context = this,
                    args = arguments;
                var later = function() {
                    timeout = null;
                    if (!immediate) func.apply(context, args);
                };
                var callNow = immediate && !timeout;
                clearTimeout(timeout);
                timeout = setTimeout(later, wait);
                if (callNow) func.apply(context, args);
            };
        }
    }
})
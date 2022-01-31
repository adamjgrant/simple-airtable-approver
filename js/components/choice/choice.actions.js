m.choice.acts({
    reset_choices(_$, args) {
        _$.act.unselect_all_choices();
        _$.act.select_choice_at_index({ index: 0, skip_update: true });
        _$.act.reset_permutation_field();
        _$.act.show_all_choices();
        _$.act.hide_empty_choices();
        _$.act.select_the_next_nonempty_choice();
    },

    show_all_choices(_$, args) {
        _$.me().forEach(choice => { choice.classList.remove("hide"); });
    },

    select_the_next_nonempty_choice(_$, args) {
        let index = 0;
        while (index < _$.me().length) {
            const text_for_this_choice = _$.act.get_text_for_choice_at_index({ index: index }).trim();
            if (!text_for_this_choice.length) {
                index++;
                _$.act.select_choice_at_index({ index: index });
            } else {
                break;
            }
        }
    },

    hide_empty_choices(_$, args) {
        _$.me().forEach((choice, index) => {
            const text = (_$.act.get_text_for_choice_at_index({ index: index })).trim();
            if (text === "" || text === "undefined" || !text) choice.classList.add("hide");
        });
    },

    get_text_for_choice_at_index(_$, args) {
        const chosen_choice = _$.me()[args.index];
        const statically_filled = !!chosen_choice.querySelectorAll("p").length;
        if (statically_filled) {
            return chosen_choice.querySelector("p").innerHTML;
        } else {
            return chosen_choice.querySelector("#choice-response").value;
        }
    },

    select_choice_at_index(_$, args) {
        _$.act.unselect_all_choices();
        const chosen_choice = _$.me()[args.index]
        chosen_choice.classList.add("selected");
        let choice_text = _$.act.get_text_for_choice_at_index({ index: args.index });

        if (!args.skip_update) {
            m.card.act.change_response_field({ text: choice_text });
            m.card.act.edit_response({ text: choice_text });
        }
    },

    set_text_for_choice_at_index(_$, args) {
        const chosen_choice = _$.me()[args.index]
        chosen_choice.querySelector("p").innerHTML = args.text;
    },

    permute(_$, args) {
        const tree = new Tree(args.json);
        const generated_text = tree.one;
        console.log(generated_text);
        _$("#choice-response").innerHTML = generated_text;
        _$("#choice-response").value = generated_text;
        m.card.act.change_response_field({ text: generated_text });
        m.card.act.edit_response({ text: generated_text });
        const last_index = _$.me().length - 1;
        _$.act.select_choice_at_index({ index: last_index });
    },


    priv: {
        unselect_all_choices(_$, args) {
            _$.me().forEach(choice => choice.classList.remove("selected"));
        },

        reset_permutation_field(_$, args) {
            _$("#choice-response").innerHTML = "...";
            _$("#choice-response").value = "...";
        }
    }
});
import { lol } from '../../permutations/lol.js';
import { agreed } from '../../permutations/agreed.js';
import { nice } from '../../permutations/nice.js';
import { tell_me_more } from '../../permutations/tell_me_more.js';

m.choice.acts({
    reset_choices(_$, args) {
        _$.act.unselect_all_choices();
        _$.act.select_choice_at_index({ index: 0 });
    },

    permute_lol(_$, args) { _$.act.permute({ json: lol }); },
    permute_nice(_$, args) { _$.act.permute({ json: nice }); },
    permute_agreed(_$, args) { _$.act.permute({ json: agreed }); },
    permute_oh(_$, args) { _$.act.permute({ json: tell_me_more }); },

    select_choice_at_index(_$, args) {
        _$.act.unselect_all_choices();
        const chosen_choice = _$.me()[args.index]
        chosen_choice.classList.add("selected");
        let choice_text;
        const statically_filled = !!chosen_choice.querySelectorAll("p").length;
        if (statically_filled) {
            choice_text = chosen_choice.querySelector("p").innerHTML;
        } else {
            choice_text = chosen_choice.querySelector("#choice-response").value;
        }
        m.card.act.change_response_field({ text: choice_text });
        m.card.act.edit_response({ text: choice_text });
    },

    set_text_for_choice_at_index(_$, args) {
        const chosen_choice = _$.me()[args.index]
        chosen_choice.querySelector("p").innerHTML = args.text;
    },

    priv: {
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

        unselect_all_choices(_$, args) {
            _$.me().forEach(choice => choice.classList.remove("selected"));
        }
    }
});
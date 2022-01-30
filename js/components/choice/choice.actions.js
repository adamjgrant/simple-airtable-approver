import { lol } from '../../permutations/lol.js';
import { agreed } from '../../permutations/agreed.js';
import { nice } from '../../permutations/nice.js';

m.choice.acts({
    permute_lol(_$, args) { _$.act.permute({ json: lol }); },
    permute_nice(_$, args) { _$.act.permute({ json: nice }); },
    permute_agreed(_$, args) { _$.act.permute({ json: agreed }); },

    select_choice_at_index(_$, args) {
        _$.act.unselect_all_choices();
        _$.me()[args.index].classList.add("selected");
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
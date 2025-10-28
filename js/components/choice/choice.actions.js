m.choice.acts({
    reset_choices(_$, args) {
        _$.act.unselect_all_choices();
        _$.act.select_choice_at_index({ index: 0, skip_update: true });
        _$.act.reset_permutation_field();
        _$.act.show_all_choices();
        _$.act.hide_empty_choices();
        _$.act.select_the_next_nonempty_choice();
        m.choice.selected_index = 0;
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
        
        // Track which choice is selected (for editing purposes)
        m.choice.selected_index = args.index;

        if (!args.skip_update) {
            m.card.act.change_response_field({ text: choice_text });
            m.card.act.edit_response({ text: choice_text });
            _$.act.set_choice_response({ text: choice_text });
        }
    },

    set_text_for_choice_at_index(_$, args) {
        const chosen_choice = _$.me()[args.index];
        console.log('set_text_for_choice_at_index: index', args.index, 'choice element:', chosen_choice, 'text:', args.text);
        if (chosen_choice) {
            const pElement = chosen_choice.querySelector("p");
            if (pElement) {
                pElement.innerHTML = args.text;
                console.log('Updated p element:', pElement);
            } else {
                console.error('No p element found in choice:', chosen_choice);
            }
        } else {
            console.error('No choice element found at index:', args.index);
        }
    },

    permute(_$, args) {
        const tree = new Tree(args.json);
        const generated_text = tree.one;
        console.log(generated_text);
        _$.act.set_choice_response({ text: generated_text });
        m.card.act.change_response_field({ text: generated_text });
        m.card.act.edit_response({ text: generated_text });
        const last_index = _$.me().length - 1;
        _$.act.select_choice_at_index({ index: last_index });
    },

    set_choice_response(_$, args) {
        _$("#choice-response").innerHTML = args.text;
        _$("#choice-response").value = args.text;
        m.card.act.edit_response(args);
        _$.act.updateCharacterCounter();
        
        // Also update the selected choice's <p> element (if not the autofill choice)
        if (m.choice.selected_index !== undefined && m.choice.selected_index < 3) {
            _$.act.set_text_for_choice_at_index({ text: args.text, index: m.choice.selected_index });
        }
    },

    blur_choice_response(_$, args) {
        _$("#choice-response").blur();
    },

    select_all(_$, args) {
        let input = _$("#choice-response");
        if (args) args.preventDefault();
        input.setSelectionRange(0, 9999);
        setTimeout(() => {
            input.focus();
        }, 100);
    },

    updateCharacterCounter(_$, args) {
        const textarea = _$("#choice-response");
        const counter = _$("#character-counter");
        if (!textarea || !counter) return;
        const remaining = 300 - (textarea.value || "").length;
        counter.textContent = remaining;
    },

    remove_question(_$, args) {
        // This can be called from any component context, so we need to use document.querySelector
        const textarea = document.querySelector("#choice-response");
        if (!textarea) return console.error("No textarea found");
        
        let text = textarea.value || textarea.innerHTML;
        
        // Split by ".", remove last item if it ends with "?", then join
        let sentences = text.split(".");
        
        if (sentences.length > 1) {
            const lastSentence = sentences[sentences.length - 1].trim();
            
            // Check if last sentence ends with "?"
            if (lastSentence.endsWith("?")) {
                // Remove the last sentence
                sentences.pop();
                // Join with "." and add a "." at the end if there's content
                text = sentences.join(".").trim();
                if (text && !text.endsWith(".")) {
                    text += ".";
                }
                
                // Update the card's data in memory based on which choice is selected
                if (m.card.this_card && m.choice && m.choice.selected_index !== undefined) {
                    if (m.choice.selected_index === 0) {
                        m.card.this_card.response = text;
                    } else if (m.choice.selected_index === 1) {
                        m.card.this_card.tweetalt1 = text;
                    } else if (m.choice.selected_index === 2) {
                        m.card.this_card.tweetalt2 = text;
                    } else {
                        // Autofill or no selection - update response (default)
                        m.card.this_card.response = text;
                    }
                }
                
                // Update the textarea and call edit_response via the choice component
                // This will also update the selected choice's <p> element via set_choice_response
                m.choice.act.set_choice_response({ text: text });
            }
        }
    },

    priv: {
        unselect_all_choices(_$, args) {
            _$.me().forEach(choice => choice.classList.remove("selected"));
        },

        reset_permutation_field(_$, args) {
            _$.act.set_choice_response({ text: m.card.this_card.response });
        }    
    }
});

// Initialize the selected_index to 0 (first choice)
m.choice.selected_index = 0;
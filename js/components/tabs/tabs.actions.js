m.tabs.acts({
    select_tab(_$, args) {
        const all_tabs = _$("a");
        const handle = args.name.replace("#tab-", "");
        m.account.act.set_account_filter_to_one_account_by_handle({ handle });

        all_tabs.forEach((tab, index) => {
            if (index === args.index) tab.classList.add("active");
            else tab.classList.remove("active");
        });
        m.viewport.act.show_timeline();
        _$.act.set_tab_filter(args);
        m.account.act.set_scores();
    },

    set_tab_filter(_$, args) {
        m.row_tweet.act.show_only_these_rows_by_name({
            handles: m.account.act.get_account_filter_handles()
        });
    },

    generate_all_tabs(_$, args) {
        _$.act.clear_out_tabs();
        // TODO: Get all the handles available and generate the tabs.

        _$.act.bind_tabs();
    },

    priv: {
        get_tab_all_template(_$, args) {
            return document.getElementById("tab-template-all");
        },
        get_tab_template(_$, args) {
            return document.getElementById("tab-template");
        },
        clear_out_tabs(_$, args) {},

        generate_tab_for_handle(_$, args) {
            const all_tab = !!handle === "all";
            const handle = m.account.act.get_raw_handle_for_handle({ handle: args.handle });
            const template =  all_tab ? _$.act.get_tab_all_template() : _$.act.get_tab_template();
            const template_element = template.content.cloneNode(true);
            const tab_element = template_element.querySelector("[data-component='row_tweet']");

            if (!all_tab) {
                tab_element.href = `#tab-${args.handle}`
            }
            else {

            }
            // tab_element.querySelector(".tweet").innerHTML = card.tweet;
        },
        bind_tabs(_$,args) {

        },
    }
});
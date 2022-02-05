m.tabs.acts({
    select_tab(_$, args) {
        const all_tabs = document.querySelectorAll("[data-component='tabs'] a")
        const handle = args.name.replace("#tab-", "");
        if (handle === "all") {
            m.account.act.add_all_accounts_to_filter();
            args.index = 0;
        } else {
            m.account.act.set_account_filter_to_one_account_by_handle({ handle });
        }

        all_tabs.forEach((tab, index) => {
            if (index === args.index) tab.classList.add("active");
            else tab.classList.remove("active");
        });
        m.viewport.act.show_timeline();
        _$.act.set_tab_filter();
        m.account.act.set_scores();
    },

    set_tab_filter(_$, args) {
        m.row_tweet.act.show_only_these_rows_by_name({
            handles: m.account.act.get_account_filter_handles()
        });
    },

    generate_all_tabs(_$, args) {
        _$.act.clear_out_tabs();
        _$.act.generate_tab_for_handle({ handle: "all" });
        m.account.accounts.forEach(account => {
            _$.act.generate_tab_for_handle({ handle: account.raw_handle });
        });
        _$.act.bind_tabs();
    },

    priv: {
        get_tab_all_template(_$, args) {
            return document.getElementById("tab-template-all");
        },
        get_tab_template(_$, args) {
            return document.getElementById("tab-template");
        },
        clear_out_tabs(_$, args) {
            _$.me().querySelector("ul").innerHTML = "";
        },

        generate_tab_for_handle(_$, args) {
            const all_tab = !!args.handle === "all";
            const handle = m.account.act.get_raw_handle_for_handle({ handle: args.handle });
            const template =  all_tab ? _$.act.get_tab_all_template() : _$.act.get_tab_template();
            const template_element = template.content.cloneNode(true);
            const tab_element = template_element.querySelector("li");

            if (!all_tab) {
                tab_element.querySelector("a").href = `#tab-${handle}`;
                tab_element.querySelector(".handle").innerText = handle;
            }
            _$.me().querySelector("ul").appendChild(tab_element);
        },
        bind_tabs(_$,args) {
            _$("a").forEach((a, index) => {
                const name = a.getAttribute("href");
                a.addEventListener("click", () => _$.act.select_tab({ index, name }));
            });
        },
    }
});
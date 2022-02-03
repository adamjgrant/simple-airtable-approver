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
    },

    set_tab_filter(_$, args) {
        m.row_tweet.act.show_only_these_rows_by_name({
            handles: m.account.act.get_account_filter_handles()
        });
    }
});
m.tabs.acts({
    select_tab(_$, args) {
        const all_tabs = _$("a");
        all_tabs.forEach((tab, index) => {
            if (index === args.index) tab.classList.add("active");
            else tab.classList.remove("active");
        });

        m.row_tweet.act.show_only_these_rows_by_name({
            name: args.name
        })
    }
});
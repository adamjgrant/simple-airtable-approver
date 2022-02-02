m.tabs.acts({
    select_tab(_$, args) {
        const all_tabs = _$("a");
        all_tabs.forEach((tab, index) => {
            if (index === args.index) tab.classList.add("active");
            else tab.classList.remove("active");
        });
    }
});
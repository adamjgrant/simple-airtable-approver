m.tabs.events(_$ => {
    _$("a").forEach((a, index) => {
        a.addEventListener("click", () => _$.act.select_tab({ index }))
    });
});
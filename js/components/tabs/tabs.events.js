m.tabs.events(_$ => {
    _$("a").forEach((a, index) => {
        const name = a.getAttribute("href");
        a.addEventListener("click", () => _$.act.select_tab({ index, name }))
    });
});
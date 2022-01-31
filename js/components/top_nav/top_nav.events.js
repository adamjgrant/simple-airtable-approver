m.top_nav.events((_$) => {
    _$("#timeline").addEventListener("click", m.viewport.act.show_timeline);
    _$("#tinder").addEventListener("click", m.viewport.act.show_tinder);

    _$.act.set_scores();
    setTimeout(_$.act.set_scores, 1500);
});
m.toolbar.events(_$ => {
    _$("#set-localstorage-values").addEventListener("click", _$.act.get_settings);

    _$("#approve").addEventListener("click", _$.act.approve);
    _$("#reject").addEventListener("click", _$.act.reject);
    _$("#undo").addEventListener("click", m.card.act.undo);
});
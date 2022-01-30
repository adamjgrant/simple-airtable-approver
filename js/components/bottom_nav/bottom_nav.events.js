m.bottom_nav.events(_$ => {
    _$("#set-localstorage-values").addEventListener("click", _$.act.get_settings);

    _$("#approve").addEventListener("click", _$.act.approve);
    _$("#reject").addEventListener("click", _$.act.reject);

    _$("#approve-and-go-back").addEventListener("click", _$.act.approve_and_go_back);
    _$("#reject-and-go-back").addEventListener("click", _$.act.reject_and_go_back);

    _$("#undo").addEventListener("click", m.card.act.undo);
});
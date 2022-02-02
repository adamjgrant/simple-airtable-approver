m.account.events(_$ => {
    _$.act.set_scores();
    setInterval(_$.act.set_scores, 5000);
});
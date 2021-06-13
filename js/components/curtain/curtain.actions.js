m.curtain.acts({
    set_curtain_text(_$, args) {
        _$.act.show_curtain();
        _$("h1").innerHTML = args.text;
    },

    remove_curtain(_$, args) {
        _$.me().classList.add("hide");
    },

    priv: {
        show_curtain(_$, args) {
            _$.me().classList.remove("hide");
        }
    }
});
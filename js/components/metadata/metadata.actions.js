m.metadata.act({
    clear(_$, args) {
        _$.act.hide_badge();
    },

    hide_badge(_$, args) {
        _$("#badge").classList.add("hide");
    },

    show_badge(_$, args) {
        _$("#badge").classList.remove("hide");
    },

    hide_response_quality(_$, args) {
        _$("#response_quality").classList.add("hide");
    },

    show_response_quality(_$, args) {
        _$("#response_quality").classList.remove("hide");
    },

    set_badge(_$, args) {
        if (m.viewport.current_view === "tinder") _$.act.show_badge();
        const approval_rate = _$.act.format_percentage({ number: args.job_approval_rate });
        _$("#badge p").innerHTML = `"${args.job_name}": ${approval_rate}%`;
        _$("#badge").href = args.job_link;
    },

    set_response_quality(_$, args) {
        if (m.viewport.current_view === "tinder") _$.act.show_response_quality();
        
        // Handle cases where grade might be null, undefined, or not a number
        let gradeValue = args.grade;
        if (gradeValue === null || gradeValue === undefined || isNaN(gradeValue)) {
            gradeValue = 0;
        }
        
        _$("#response_quality").innerHTML = `Grade: ${gradeValue}`;
    },

    priv: {
        format_percentage(_$, args) {
            return parseFloat(Math.round(args.number * 1000)) / 10.0;
        }
    }
})
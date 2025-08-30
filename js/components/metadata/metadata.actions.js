m.metadata.act({
    clear(_$, args) {
        _$.act.hide_badge();
    },

    hide_badge(_$, args) {
        if (_$("#badge")) {
          _$("#badge").classList.add("hide");
        }
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

    update_metadata_approval_date(_$, args) {
        // Get current date in YYYY-MM-DD format
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');
        const dateString = `${year}-${month}-${day}`;
        
        // Check if we're offline
        if (m.offline_manager && !m.offline_manager.act.isOnline()) {
            console.log('Offline detected, queuing metadata update...');
            // Queue the metadata update for when we're online
            m.offline_manager.act.addToOfflineQueue({
                type: 'update_metadata_approval_date',
                data: {
                    metadataId: 'recMfVvygJa10rCue',
                    date: dateString
                }
            });
            return;
        }

        // Update the metadata record in Airtable
        m.card.act.airtable_base()('📊 Metadata').update([{
            id: 'recMfVvygJa10rCue',
            fields: { "Value": dateString }
        }], function(err, records) {
            if (err) {
                console.error('Failed to update metadata approval date:', err);
            } else {
                console.log('Successfully updated metadata approval date to:', dateString);
            }
        });
    },

    priv: {
        format_percentage(_$, args) {
            return parseFloat(Math.round(args.number * 1000)) / 10.0;
        }
    }
})
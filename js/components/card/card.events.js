// Load AirTable
let called = false;

m.card.events(_$ => {
    let load_in_data_promises = [];

    _$("#response").addEventListener("keyup", (e) => { _$.act.edit_response({ text: e.target.value }) });

    _$("#select-all").addEventListener("click", _$.act.select_all);
    _$("#select-all").addEventListener("dblclick", _$.act.clear);

    if (!called) {
        const validation = m.bottom_nav.act.validate_settings();
        if (!validation.valid) {
            m.curtain.act.set_curtain_text({ text: validation.message });
        }

        // TODO: Status update: Loading data...
        called = true;
        _$.act.airtable_base()('💬 Tweets').select({
            view: "Permutations Review Board",
            maxRecords: 100
        }).eachPage(function page(records, fetchNextPage) {
            records.forEach(record => {
                m.curtain.act.set_curtain_text({ text: "Retrieving Data..." })
                    // There are a bunch of join ops for external tweets potentially
                    // needed for each of these, so we do a Promise.all on this later.
                load_in_data_promises.push(_$.act.load_in_data({ record: record }));
            })

            fetchNextPage();
        }, function done(err) {
            if (err) { console.error(err); }

            // TODO: Status update: Waiting for joined data...

            Promise.allSettled(load_in_data_promises).then(data => {
                m.curtain.act.set_curtain_text({ text: "Done" });
                if (data.length) { m.curtain.act.remove_curtain() };
                _$.act.start();

                // TODO: Status update: Done.
            });
        });
    }
})
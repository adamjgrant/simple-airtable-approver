// Load AirTable
var Airtable = require('airtable');
// Get a base ID for an instance of art gallery example
var base = new Airtable({ apiKey: localStorage.getItem("airtable_api_key") }).base(localStorage.getItem('airtable_base_id'));

m.card.events(_$ => {
    base('💬 Tweets').select({
        view: "Permutations Review Board",
        maxRecords: 100
    }).eachPage(function page(records, fetchNextPage) {
        records.forEach(record => {
            _$.act.load_in_data({ record: record });
        })

        fetchNextPage();
    }, function done(err) {
        if (err) { console.error(err); return }
        _$.act.start();
    });
})
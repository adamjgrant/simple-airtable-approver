// Load AirTable
const Airtable = require('airtable');
// Get a base ID for an instance of art gallery example
const base = new Airtable({ apiKey: localStorage.getItem("airtable_api_key") }).base(localStorage.getItem('airtable_base_id'));
let called = false;

m.card.events(_$ => {
    if (!called) {
        called = true;
        base('💬 Tweets').select({
            view: "Permutations Review Board",
            maxRecords: 100
        }).eachPage(function page(records, fetchNextPage) {
            records.forEach(record => {
                _$.act.load_in_data({ record: record });
            })

            fetchNextPage();
        }, function done(err) {
            if (err) { console.error(err); }
            _$.act.start();
        });
    }
})
// Load AirTable
var Airtable = require('airtable');
// Get a base ID for an instance of art gallery example
var base = new Airtable({ apiKey: localhost.getItem("airtable_api_key") }).base(localhost.getItem('airtable_base_id'));
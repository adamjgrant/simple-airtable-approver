m.toolbar.acts({
    get_settings(_$, args) {
        console.log("ping");
        const api_key = prompt("Airtable API Key");
        const base = prompt("Airtable base ID");

        localStorage.setItem("airtable_api_key", api_key);
        localStorage.setItem("airtable_base_id", base);

        alert("Set.");
    }
})
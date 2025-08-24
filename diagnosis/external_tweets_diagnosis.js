// External Tweets Diagnosis Script
// Run this in the browser console to diagnose external tweets issues

class ExternalTweetsDiagnosis {
    constructor() {
        this.airtable = null;
        this.baseId = localStorage.getItem('airtable_base_id');
        this.token = localStorage.getItem('airtable_token');
    }

    async init() {
        if (!this.baseId || !this.token) {
            console.error("Missing Airtable credentials. Please check localStorage for 'airtable_base_id' and 'airtable_token'");
            return false;
        }

        try {
            const Airtable = require('airtable');
            this.airtable = new Airtable({ token: this.token }).base(this.baseId);
            console.log("✅ Airtable initialized successfully");
            return true;
        } catch (error) {
            console.error("❌ Failed to initialize Airtable:", error);
            return false;
        }
    }

    async diagnoseRecord(recordId) {
        console.log(`🔍 Diagnosing record: ${recordId}`);
        
        try {
            // Get the main tweet record
            const mainRecord = await this.getRecord('💬 Tweets', recordId);
            console.log("📝 Main tweet record:", mainRecord);
            
            if (!mainRecord) {
                console.error("❌ Main tweet record not found");
                return;
            }

            // Check the External tweets field
            const externalTweetsField = mainRecord.get("External tweets");
            console.log("🔗 External tweets field value:", externalTweetsField);
            
            if (!externalTweetsField || !externalTweetsField.length) {
                console.log("ℹ️ No external tweets linked to this record");
                return;
            }

            // Get the first external tweet record
            const externalTweetId = externalTweetsField[0];
            console.log("🔍 Fetching external tweet with ID:", externalTweetId);
            
            const externalRecord = await this.getRecord('📧 External tweets', externalTweetId);
            console.log("📧 External tweet record:", externalRecord);
            
            if (!externalRecord) {
                console.error("❌ External tweet record not found");
                return;
            }

            // Check what fields are available on the external tweet record
            console.log("📋 External tweet record fields:", Object.keys(externalRecord.fields));
            
            // Check the Tweet field specifically
            const tweetField = externalRecord.get("Tweet");
            console.log("🐦 Tweet field value:", tweetField);
            
            // Check the Responds to (external) field
            const respondsToField = externalRecord.get("Responds to (external)");
            console.log("↩️ Responds to (external) field value:", respondsToField);
            
            // Check the Responded from (Internal) field
            const respondedFromField = externalRecord.get("Responded from (Internal)");
            console.log("🔄 Responded from (Internal) field value:", respondedFromField);
            
            // Check the Created field
            const createdField = externalRecord.get("Created");
            console.log("📅 Created field value:", createdField);
            
            // Let's also check the raw JSON to see if there are any hidden fields
            console.log("🔍 Raw record JSON:", externalRecord._rawJson);
            
            // Verify the table names are correct
            await this.verifyTableNames();
            
            // Try to get a sample of external tweets to see if this is a data issue
            await this.checkExternalTweetsSample();
            
        } catch (error) {
            console.error("❌ Error during diagnosis:", error);
        }
    }

    async getRecord(tableName, recordId) {
        return new Promise((resolve, reject) => {
            this.airtable(tableName).find(recordId, (err, record) => {
                if (err) {
                    console.error(`❌ Error fetching record from ${tableName}:`, err);
                    reject(err);
                    return;
                }
                resolve(record);
            });
        });
    }

    async verifyTableNames() {
        console.log("🔍 Verifying table names...");
        
        try {
            // Try to access the Tweets table
            const tweetsTable = this.airtable('💬 Tweets');
            console.log("✅ Tweets table accessible");
            
            // Try to access the External tweets table
            const externalTweetsTable = this.airtable('📧 External tweets');
            console.log("✅ External tweets table accessible");
            
            // Try to access the Accounts table
            const accountsTable = this.airtable('🙂 Accounts');
            console.log("✅ Accounts table accessible");
            
        } catch (error) {
            console.error("❌ Error accessing tables:", error);
        }
    }

    async checkExternalTweetsSample() {
        console.log("🔍 Checking sample of external tweets to see field availability...");
        
        try {
            const externalTweetsTable = this.airtable('📧 External tweets');
            const sampleRecords = await new Promise((resolve, reject) => {
                externalTweetsTable.select({
                    maxRecords: 5
                }).firstPage((err, records) => {
                    if (err) reject(err);
                    else resolve(records);
                });
            });
            
            if (sampleRecords && sampleRecords.length > 0) {
                console.log(`📊 Found ${sampleRecords.length} sample external tweet records`);
                
                sampleRecords.forEach((record, index) => {
                    console.log(`\n📝 Sample record ${index + 1} (ID: ${record.id}):`);
                    console.log("  Fields:", Object.keys(record.fields));
                    console.log("  Tweet:", record.get("Tweet"));
                    console.log("  Responds to (external):", record.get("Responds to (external)"));
                    console.log("  Responded from (Internal):", record.get("Responded from (Internal)"));
                });
            }
        } catch (error) {
            console.error("❌ Error checking external tweets sample:", error);
        }
    }

    async runFullDiagnosis() {
        console.log("🚀 Starting External Tweets Diagnosis...");
        
        if (!(await this.init())) {
            return;
        }
        
        // Diagnose the specific record mentioned in the issue
        await this.diagnoseRecord('recTWmjqlld8BvM9N');
        
        console.log("🏁 Diagnosis complete!");
    }
}

// Usage instructions
console.log("To run the diagnosis:");
console.log("const diagnosis = new ExternalTweetsDiagnosis();");
console.log("diagnosis.runFullDiagnosis();");

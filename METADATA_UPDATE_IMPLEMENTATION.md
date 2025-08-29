# Metadata Update Implementation

## Overview

This implementation adds functionality to automatically update a specific metadata record in the "📊 Metadata" table whenever a user approves a tweet. The "Value" field is updated to the current date in YYYY-MM-DD format.

## What Was Implemented

### 1. Metadata Component Enhancement (`js/components/metadata/metadata.actions.js`)

Added a new function `update_metadata_approval_date()` that:
- Generates the current date in YYYY-MM-DD format (e.g., "2025-01-15")
- Checks if the app is online or offline
- Updates the Airtable record with ID "recMfVvygJa10rCue" in the "📊 Metadata" table
- Handles offline scenarios by queuing the action

### 2. Offline Manager Enhancement (`js/components/offline_manager/offline_manager.actions.js`)

Added support for processing metadata updates when coming back online:
- New case `'update_metadata_approval_date'` in the action processor
- New function `processMetadataApprovalDateUpdate()` that validates and processes queued metadata updates
- Proper error handling and retry logic

### 3. Tweet Approval Integration (`js/components/bottom_nav/bottom_nav.actions.js`)

Modified the `update_review_status()` function to:
- Call the metadata update function when a tweet is approved (status > 0)
- Handle both online and offline scenarios
- Maintain existing functionality for rejections and other status changes

## How It Works

### Online Scenario
1. User approves a tweet (status = 1)
2. Tweet review status is updated in Airtable
3. Metadata update function is called immediately
4. Current date is formatted as YYYY-MM-DD
5. Airtable record "recMfVvygJa10rCue" in "📊 Metadata" table is updated
6. Success/failure is logged to console

### Offline Scenario
1. User approves a tweet while offline
2. Tweet approval is queued for later processing
3. Metadata update is also queued with the current date
4. When connection is restored, both actions are processed
5. Metadata table is updated with the date from when the approval occurred

## Technical Details

### Date Format
- Uses JavaScript's `Date` object
- Formats as YYYY-MM-DD using `padStart(2, '0')` for consistent two-digit months/days
- Example: January 15, 2025 becomes "2025-01-15"

### Airtable Integration
- Table name: "📊 Metadata" (exact emoji included)
- Record ID: "recMfVvygJa10rCue"
- Field to update: "Value"
- Uses existing Airtable base configuration

### Error Handling
- Console logging for debugging
- Graceful failure handling
- Retry logic for offline actions (up to 3 attempts)

## Testing

A test file was created at `diagnosis/metadata_update_test.js` that:
- Tests date formatting logic
- Tests approval status logic
- Mocks Airtable interactions
- Verifies the complete flow

## Usage

The feature is automatically active and requires no user interaction:
1. Simply approve a tweet as usual
2. The metadata will be automatically updated
3. Check the browser console for confirmation logs
4. Verify the update in Airtable's "📊 Metadata" table

## Files Modified

1. `js/components/metadata/metadata.actions.js` - Added metadata update function
2. `js/components/offline_manager/offline_manager.actions.js` - Added offline processing support
3. `js/components/bottom_nav/bottom_nav.actions.js` - Integrated with tweet approval flow

## Dependencies

- Requires existing Airtable integration
- Requires existing offline manager functionality
- No new external dependencies added

## Future Enhancements

Potential improvements could include:
- Configurable metadata record IDs
- Additional metadata fields to update
- Batch processing for multiple approvals
- Custom date formats
- Metadata update history tracking

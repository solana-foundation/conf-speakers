# Airtable Fields Audit Report

## Fields Currently Being Fetched in fetchSessions()

1. "⚙️ Session Name" ✅ (exists in Airtable)
2. "Description" ✅ (exists in Airtable)
3. "Start Time" ✅ (exists in Airtable)
4. "End Time" ✅ (exists in Airtable)
5. "Stage" ✅ (exists in Airtable)
6. "Speakers" ✅ (exists in Airtable)
7. "Session Type" ❌ (NOT FOUND in Airtable fields list)
8. "Format" ✅ (exists in Airtable)
9. "Track" ❌ (NOT FOUND in Airtable fields list)
10. "Duration (Minutes)" ❌ (NOT FOUND in Airtable fields list)
11. "Session Template (from Session Template)" ❌ (NOT FOUND in Airtable fields list)
12. "Session Template_Type" ❌ (NOT FOUND in Airtable fields list)
13. "Session Image" ❌ (NOT FOUND in Airtable fields list)
14. "Replay URL" ❌ (NOT FOUND in Airtable fields list)
15. "Slides URL" ❌ (NOT FOUND in Airtable fields list)
16. "Content Summary" ❌ (NOT FOUND in Airtable fields list)
17. "Talk Format" ❌ (NOT FOUND in Airtable fields list)
18. "Has Slides" ❌ (NOT FOUND in Airtable fields list)
19. "Slide Guidelines" ❌ (NOT FOUND in Airtable fields list)
20. "Allow Recording" ❌ (NOT FOUND in Airtable fields list)
21. "Session Topics (from Session Topics)" ❌ (NOT FOUND in Airtable fields list)
22. "Stream Status" ❌ (NOT FOUND in Airtable fields list)
23. "Record Id (from Session Template)" ❌ (NOT FOUND in Airtable fields list)
24. "Categories (from Session Template)" ❌ (NOT FOUND in Airtable fields list)
25. "TBD" ❌ (NOT FOUND in Airtable fields list)

## Fields Available in Airtable (from provided list)

### Currently Enabled Fields (green toggle):

- Start Time ✅
- End Time ✅
- ⚙️ Session Name ✅
- Description ✅
- Speakers ✅
- Moderator ✅
- Format ✅
- Stage ✅
- Web Publishing Status ✅

### Available but Disabled Fields:

- Max. Seats
- Sequence Ordinal
- Section
- Day Ordinal
- Potential Speakers
- Duration
- Discuss
- Owner
- Content
- Internal Notes
- Duration_from day start
- Duration_running total
- Duration_Integer
- ⚙️ Session Status
- Day Start Time
- Start Time (Calc)
- ⚙️ End Time (Calc)
- ⚙️ Start Day
- ⚙️ Seat Status
- ⚙️ Time?
- ⚙️ Title?
- ⚙️ Description?
- ⚙️ Confirmed Speakers Count
- ⚙️ Full House?
- ⚙️ Live on Web?
- ⚙️ Speakers Informed of Session?
- ⚙️ Last Modified
- ⚙️ Confirmed Moderator
- ⚙️ No. Confirmed Speakers and Mod
- ⚙️ Number of Speakers/Moderators Needed
- ⚙️ Interactions with Speaker
- ⚙️ Notes
- ⚙️ Seat Status Formula (Full House)
- ⚙️ Seat Status Formula (Max Speaker Empty?)
- 📊 Seat Status Formula
- Wait formula
- ⚙️ Confirmed Speakers/Max Speakers
- ⚙️ Is Title Assigned
- ⚙️ Description Added
- ⚙️ Max Speaker's Assigned
- ⚙️ Assign Statuses
- ⚙️ Max Speaker Status Helper (formatted)
- ⚙️ TD Missing
- ⚙️ TD Missing Formatted helper
- ⚙️ Session Name concatenated
- Confirmed Speaker Email
- Confirmed Speaker Contact Email
- Confirmed Moderator Email
- Confirmed Speaker Asst Email

## Summary

**CRITICAL ISSUES FOUND:**

- 20 out of 25 fields being fetched do NOT exist in the Airtable base
- Only 5 fields are actually valid and exist in Airtable
- This explains the "Session Type" error and likely many other similar errors

**RECOMMENDATIONS:**

1. Remove all non-existent fields from fetchSessions()
2. Update SessionFieldsSchema to only include valid fields
3. Update Session type definition to match actual available fields
4. Consider adding useful fields that are available but not currently fetched

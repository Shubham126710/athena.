import re

with open('src/pages/Calendar.jsx', 'r') as f:
    text = f.read()

# Add a massive block of Indian festivals and hardcoded 2026 events.
hardcoded_festivals = """// Major Indian Festivals & Holidays 2026
    { id: 201, title: 'New Year\\'s Day', date: new Date(2026, 0, 1), type: 'holiday', time: 'All Day', location: 'India' },
    { id: 202, title: 'Makar Sankranti', date: new Date(2026, 0, 14), type: 'holiday', time: 'All Day', location: 'India' },
    { id: 203, title: 'Republic Day', date: new Date(2026, 0, 26), type: 'holiday', time: 'All Day', location: 'India' },
    { id: 204, title: 'Maha Shivaratri', date: new Date(2026, 1, 14), type: 'holiday', time: 'All Day', location: 'India' },
    { id: 205, title: 'Holi', date: new Date(2026, 2, 3), type: 'holiday', time: 'All Day', location: 'India' },
    { id: 206, title: 'Good Friday', date: new Date(2026, 3, 3), type: 'holiday', time: 'All Day', location: 'India' },
    { id: 207, title: 'Eid al-Fitr', date: new Date(2026, 2, 20), type: 'holiday', time: 'All Day', location: 'India' },
    { id: 208, title: 'Independence Day', date: new Date(2026, 7, 15), type: 'holiday', time: 'All Day', location: 'India' },
    { id: 209, title: 'Raksha Bandhan', date: new Date(2026, 7, 28), type: 'holiday', time: 'All Day', location: 'India' },
    { id: 210, title: 'Janmashtami', date: new Date(2026, 8, 3), type: 'holiday', time: 'All Day', location: 'India' },
    { id: 211, title: 'Gandhi Jayanti', date: new Date(2026, 9, 2), type: 'holiday', time: 'All Day', location: 'India' },
    { id: 212, title: 'Dussehra', date: new Date(2026, 9, 18), type: 'holiday', time: 'All Day', location: 'India' },
    { id: 213, title: 'Diwali', date: new Date(2026, 10, 8), type: 'holiday', time: 'All Day', location: 'India' },
    { id: 214, title: 'Guru Nanak Jayanti', date: new Date(2026, 10, 24), type: 'holiday', time: 'All Day', location: 'India' },
    { id: 215, title: 'Christmas Day', date: new Date(2026, 11, 25), type: 'holiday', time: 'All Day', location: 'India' },
"""

text = re.sub(r"// Academic Events", hardcoded_festivals + "\n    // Academic Events", text)

with open('src/pages/Calendar.jsx', 'w') as f:
    f.write(text)

print("Calendar updated with explicit festivals!")

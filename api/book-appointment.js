const { google } = require('googleapis');

module.exports = async function handler(req, res) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { name, phone, email, zip, goal, timeline, idea, dateIso, startTime, endTime } = req.body;

    if (!name || !email || !dateIso || !startTime) {
      return res.status(400).json({ error: 'Missing required lead details' });
    }

    const clientEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
    const privateKey = (process.env.GOOGLE_PRIVATE_KEY || '').replace(/\\n/g, '\n');
    const calendarId = process.env.GOOGLE_CALENDAR_ID || 'primary';

    // Fallback response if environment variables are not configured yet
    if (!clientEmail || !privateKey) {
      console.log('Google Calendar API environment variables missing. Lead saved:', req.body);
      return res.status(200).json({
        success: true,
        message: 'Lead received successfully. Google Calendar API credentials pending configuration.',
        lead: { name, email, phone, dateIso, startTime }
      });
    }

    // Authenticate with Google Calendar API using Service Account
    const auth = new google.auth.JWT(
      clientEmail,
      null,
      privateKey,
      ['https://www.googleapis.com/auth/calendar', 'https://www.googleapis.com/auth/calendar.events']
    );

    const calendar = google.calendar({ version: 'v3', auth });

    // Format Start & End ISO strings (e.g. 2026-08-14T09:00:00)
    const startDateTime = `${dateIso}T${startTime}:00`;
    const endDateTime = `${dateIso}T${endTime}:00`;

    const event = {
      summary: `DM Home Improvement: ${name} (${phone || 'No Phone'})`,
      location: '3440 Toringdon Way Suite 205, Charlotte, NC 28277',
      description: `15-Minute In-Home Deck & Ramp Consultation\n\nClient Name: ${name}\nPhone: ${phone}\nEmail: ${email}\nZIP Code: ${zip}\nGoal: ${goal}\nTimeline: ${timeline}\nIdea/Vision: ${idea}`,
      start: {
        dateTime: new Date(startDateTime).toISOString(),
        timeZone: 'America/New_York'
      },
      end: {
        dateTime: new Date(endDateTime).toISOString(),
        timeZone: 'America/New_York'
      },
      attendees: [
        { email: email, displayName: name }
      ],
      reminders: {
        useDefault: false,
        overrides: [
          { method: 'email', minutes: 24 * 60 },
          { method: 'popup', minutes: 30 }
        ]
      }
    };

    const response = await calendar.events.insert({
      calendarId: calendarId,
      resource: event,
      sendUpdates: 'all' // Automatically sends Google Calendar email invites to client & DM team!
    });

    return res.status(200).json({
      success: true,
      eventId: response.data.id,
      htmlLink: response.data.htmlLink,
      message: 'Event created automatically on Google Calendar!'
    });

  } catch (error) {
    console.error('Error creating Google Calendar event:', error);
    return res.status(500).json({
      error: 'Failed to create calendar event',
      details: error.message
    });
  }
};

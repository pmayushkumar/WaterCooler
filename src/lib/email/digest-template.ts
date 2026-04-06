import type { GeminiResponse, DigestEvent, User } from '@/types';
import { esc } from '@/lib/sanitize';

const CATEGORY_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  sports: { bg: '#E8F5E9', text: '#2E7D32', border: '#4CAF50' },
  food: { bg: '#FFF3E0', text: '#E65100', border: '#FF9800' },
  festival: { bg: '#F3E5F5', text: '#6A1B9A', border: '#9C27B0' },
  news: { bg: '#E3F2FD', text: '#1565C0', border: '#2196F3' },
  hobby: { bg: '#E0F2F1', text: '#00695C', border: '#009688' },
};

function eventCard(event: DigestEvent): string {
  const colors = CATEGORY_COLORS[event.category] || CATEGORY_COLORS.news;

  const followUps = (event.follow_ups || [])
    .map((q) => `<li style="margin-bottom:4px;color:#555;">${esc(q)}</li>`)
    .join('');

  return `
    <div style="border:1px solid ${colors.border};border-radius:8px;padding:16px;margin-bottom:12px;background:${colors.bg};">
      <span style="display:inline-block;background:${colors.border};color:white;font-size:11px;font-weight:bold;padding:2px 8px;border-radius:4px;text-transform:uppercase;margin-bottom:8px;">
        ${esc(event.category)}
      </span>
      <h3 style="margin:8px 0 4px;color:#333;font-size:16px;">${esc(event.event_title)}</h3>

      <p style="margin:8px 0;color:#555;font-size:14px;">
        <strong style="color:${colors.text};">What is this?</strong><br/>
        ${esc(event.user_explainer)}
      </p>

      <p style="margin:8px 0;color:#555;font-size:14px;">
        <strong style="color:${colors.text};">Why this might matter:</strong><br/>
        ${esc(event.why_it_matters)}
      </p>

      <p style="margin:8px 0;color:#333;font-size:14px;font-style:italic;background:white;padding:10px;border-radius:6px;border-left:3px solid ${colors.border};">
        <strong>Try saying:</strong> ${esc(event.conversation_starter)}
      </p>

      ${followUps ? `
      <div style="margin-top:8px;">
        <strong style="color:${colors.text};font-size:13px;">If they're into it, ask:</strong>
        <ul style="margin:4px 0 0;padding-left:20px;font-size:13px;">
          ${followUps}
        </ul>
      </div>` : ''}
    </div>`;
}

function colleagueSection(
  colleagueName: string,
  colleagueId: string,
  events: DigestEvent[],
  user: User,
  baseUrl: string
): string {
  const editUrl = `${baseUrl}/colleagues/edit?colleague_id=${colleagueId}&user_id=${user.user_id}&token=${user.secret_token}`;
  const removeUrl = `${baseUrl}/colleagues/remove?colleague_id=${colleagueId}&user_id=${user.user_id}&token=${user.secret_token}`;

  const eventCards = events.map((e) => eventCard(e)).join('');

  return `
    <div style="margin-bottom:32px;">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;border-bottom:2px solid #eee;padding-bottom:8px;">
        <h2 style="margin:0;color:#333;font-size:20px;">${esc(colleagueName)}</h2>
        <div>
          <a href="${editUrl}" style="color:#666;font-size:12px;text-decoration:none;margin-right:12px;">Edit Info</a>
          <a href="${removeUrl}" style="color:#999;font-size:12px;text-decoration:none;">Remove</a>
        </div>
      </div>
      ${eventCards}
    </div>`;
}

export function buildDigestEmail(
  user: User,
  digest: GeminiResponse,
  baseUrl: string
): { subject: string; html: string } {
  const weekOf = new Date().toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  const subject = `Your Weekly Conversation Guide — Week of ${weekOf}`;

  const colleagueSections = digest.colleagues
    .map((col) =>
      colleagueSection(col.colleague_name, col.colleague_id, col.events, user, baseUrl)
    )
    .join('');

  const addColleagueUrl = `${baseUrl}/colleagues/add?email=${encodeURIComponent(user.email)}`;
  const feedbackUrl = `${baseUrl}/feedback?email=${encodeURIComponent(user.email)}`;

  const html = `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/></head>
<body style="margin:0;padding:0;background:#f5f5f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <div style="max-width:600px;margin:0 auto;background:white;padding:32px;">

    <div style="text-align:center;margin-bottom:24px;">
      <h1 style="color:#333;font-size:24px;margin:0;">Your Weekly Conversation Guide</h1>
      <p style="color:#888;font-size:14px;margin:4px 0 0;">Week of ${weekOf}</p>
    </div>

    <p style="color:#555;font-size:15px;line-height:1.5;">
      Hi ${esc(user.name)}, here are personalized conversation starters for your colleagues this week:
    </p>

    ${colleagueSections}

    <div style="text-align:center;margin-top:32px;padding-top:24px;border-top:2px solid #eee;">
      <a href="${addColleagueUrl}" style="display:inline-block;background:#4a6cf7;color:white;padding:10px 24px;border-radius:6px;text-decoration:none;font-weight:bold;font-size:14px;">
        + Add New Colleague
      </a>
      <p style="margin-top:16px;">
        <a href="${feedbackUrl}" style="color:#888;font-size:13px;text-decoration:none;">Share feedback on this digest</a>
      </p>
      <p style="color:#aaa;font-size:12px;margin-top:16px;">
        Water Cooler — Build deeper connections
      </p>
    </div>

  </div>
</body>
</html>`;

  return { subject, html };
}

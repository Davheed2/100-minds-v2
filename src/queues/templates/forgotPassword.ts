import { baseTemplate } from './baseTemplate';

export const forgotPasswordEmail = (data: { name: string; resetLink: string }) => {
	return baseTemplate(
		`<h2>Hey ${data.name}!</h2>

        <p>
            We received a request to reset your password for your <strong>100 Minds</strong> account.
            Click the button below to set a new password:
        </p>

        <table class="body-action" align="center" width="100%" cellpadding="0" cellspacing="0">
            <tr>
              <td align="center">
                <table width="100%" border="0" cellspacing="0" cellpadding="0">
                 <tr>
                    <td align="center">
                    <table border="0" cellspacing="0" cellpadding="0">
                        <tr>
                            <td>
                                <a href="${data.resetLink}" style="background-color: #099999; color: white; padding: 12px 24px; border-radius: 6px; text-decoration: none; display: inline-block; font-weight: 600;">
                                    Reset Password
                                </a>
                            </td>
                        </tr>
                    </table>
                    </td>
                 </tr>
                </table>
              </td>
            </tr>
        </table>

        <p>
            If the button above doesn't work, copy and paste the link below into your browser:
        </p>

        <p style="word-break: break-all;">
            <a href="${data.resetLink}" style="color: #099999;">${data.resetLink}</a>
        </p>

        <p>
            This link is valid for <strong>15 minutes</strong>. If you did not request a password reset, please ignore this email or contact our support team immediately.
        </p>

        <p>Stay secure 💪<br />The 100 Minds Team</p>`
	);
};
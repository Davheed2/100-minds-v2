import { baseTemplate } from './baseTemplate';

export const resetPasswordEmail = (data: { name: string }) => {
	return baseTemplate(
		`<h2>Hey ${data.name}!</h2>

        <p>
            Your password has been successfully reset. You can now log in with your new password.
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
                                <a href="https://100minds.com/login" style="background-color: #099999; color: white; padding: 12px 24px; border-radius: 6px; text-decoration: none; display: inline-block; font-weight: 600;">
                                    Log In
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
            <a href="https://100minds.com/login" style="color: #099999;">https://100minds.com/login</a>
        </p>

        <p>
            If you did not reset your password, please <a href="https://100minds.com/support" style="color: #099999; text-decoration: none;">contact our support team</a> immediately.
        </p>

        <p>Stay secure 💪<br />The 100 Minds Team</p>`
	);
};

import { baseTemplate } from './baseTemplate';

export const signUpEmail = (data: { name: string; verificationUrl: string }) => {
	return baseTemplate(
		`<h2>Hey ${data.name}!</h2>

    <p>
      Welcome to <strong>100 Minds</strong>, we're excited to have you join us!
    </p>

    <p>
      To get started, please verify your email address by clicking the button below:
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
                      <a href="${data.verificationUrl}" style="background-color: #099999; color: white; padding: 12px 24px; border-radius: 6px; text-decoration: none; display: inline-block; font-weight: 600;">
                        Verify Your Email
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
      <a href="${data.verificationUrl}" style="color: #099999;">${data.verificationUrl}</a>
    </p>

    <p>
      This link is valid for <strong>30 days</strong>. If you didn't sign up for 100 Minds, you can safely ignore this email.
    </p>

    <p>Let's get started 💪<br/>The 100 Minds Team</p>`
	);
};

import { baseTemplate } from './baseTemplate';

export const loginEmail = (data: { name: string; time: string }) => {
	return baseTemplate(
		`<h2>Hey ${data.name}!</h2>

    <p>
      We detected a new sign-in to your <strong>100 Minds</strong> account on <strong>${data.time}</strong>.
    </p>

    <p>
      If this was you, you're all set! If this login seems unfamiliar, please update your password right away or reach out to our support team.
    </p>

    <p>
      Keeping your account secure is our top priority — we're here to help you stay safe 💪
    </p>

    <p>Thanks,<br />The 100 Minds Team</p>`
	);
};

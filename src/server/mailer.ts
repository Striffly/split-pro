import { type User } from 'next-auth';
import { Unsend } from 'unsend';
import { Resend } from 'resend';
import { env } from '~/env';


export async function sendSignUpEmail(email: string, token: string, url: string) {
  const { host } = new URL(url);

  if (env.NODE_ENV === 'development') {
    console.log('Sending sign in email', email, url, token);
    return;
  }

  const subject = 'Sign in to SplitPro';
  const text = `Hey,\n\nYou can sign in to SplitPro by clicking the below URL:\n${url}\n\nYou can also use this OTP: ${token}\n\nThanks,\nKoushik KM\nSplitPro`;
  const html = `<p>Hey,</p> <p>You can sign in to SplitPro by clicking the below URL:</p><p><a href="${url}">Sign in to ${host}</a></p><p>You can also use this OTP: <b>${token}</b></p<br /><br /><p>Thanks,</p><p>Koushik KM<br/>SplitPro</p>`;

  await sendMail(email, subject, text, html);
}

export async function sendInviteEmail(email: string, name: string) {
  const { host } = new URL(env.NEXTAUTH_URL);

  if (env.NODE_ENV === 'development') {
    console.log('Sending invite email', email, name);
    return;
  }

  const subject = 'Invitation to SplitPro';
  const text = `Hey,\n\nYou have been invited to SplitPro by ${name}. It's a completely open source free alternative to splitwise. You can sign in to SplitPro by clicking the below URL:\n${env.NEXTAUTH_URL}\n\nThanks,\nKoushik KM\nSplitPro`;
  const html = `<p>Hey,</p> <p>You have been invited to SplitPro by ${name}. It's a completely open source free alternative to splitwise. You can sign in to SplitPro by clicking the below URL:</p><p><a href="${env.NEXTAUTH_URL}">Sign in to ${host}</a></p><br><p>Thanks,<br/>Koushik KM<br/>SplitPro</p>`;

  await sendMail(email, subject, text, html);
}

export async function sendFeedbackEmail(feedback: string, user: User) {
  console.log('Received feedback from: ', user.email, 'Feedback: ', feedback);

  if (!env.FEEDBACK_EMAIL) return;

  const subject = `Feedback received on SplitPro from ${user.name}`;
  const text = `Feedback created by ${user.name} :\n\nFeedback: ${feedback}\n\nemail: ${user.email}`;

  await sendMail(env.FEEDBACK_EMAIL, subject, text, text);
}

async function sendMail(email: string, subject: string, text: string, html: string) {
  try {
    if (env.EMAIL_METHOD === "smtp" && env.UNSEND_API_KEY && env.UNSEND_FROM_EMAIL) {
      const unsend = new Unsend(env.UNSEND_API_KEY);

      const response = await unsend.emails.send({
        from: env.UNSEND_FROM_EMAIL,
        to: email,
        subject,
        text,
        html,
      });

      if (response.data) {
        console.log('Email sent using unsend', response.data);
        return;
      } else {
        console.log('Error sending email using unsend', response.error);
      }
    }
  } catch (error) {
    console.log('Error sending email using unsend, so fallback to resend', error);
  }

  try {
    if (env.EMAIL_METHOD === "smtp" && env.SMTP_HOST && env.SMTP_PORT && env.SMTP_SECURE && env.SMTP_FROM_EMAIL && env.SMTP_USER && env.SMTP_PASSWORD) {
      const transporter = nodemailer.createTransport({
        host: env.SMTP_HOST,
        port: env.SMTP_PORT,
        secure: env.SMTP_SECURE,
        auth: {
          user: env.SMTP_USER,
          pass: env.SMTP_PASSWORD,
        },
      });

      const response = await transporter.sendMail({
        from: env.SMTP_FROM_EMAIL,
        to: email,
        subject,
        text,
        html,
      });
    }
  } catch (error) {
    console.log('Error sending email using smtp, so fallback to resend', error);
  }
}

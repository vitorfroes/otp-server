interface IEmail {
  to: string;
  subject: string;
  body: string;
}

export interface EmailService {
  sendEmail: ({ to, subject, body }: IEmail) => Promise<void>;
}

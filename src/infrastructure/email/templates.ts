interface IBodyTemplate {
  token: string;
  expiresAt: Date;
}

export function otpBodyTemplate({ token, expiresAt }: IBodyTemplate) {
  return `
        <h1>OTP Server</h1>
        <p>Your OTP token is: <strong>${token}</strong></p>
        <p>This token will expire at: <strong>${expiresAt.toLocaleDateString(
          "pt-BR",
          {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            timeZone: "America/Sao_Paulo",
          }
        )}</strong></p>
        <p>Please use this token to complete your authentication.</p>       
    `;
}

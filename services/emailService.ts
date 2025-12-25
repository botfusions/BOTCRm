
export interface EmailConfig {
  senderName: string;
  senderEmail: string;
  welcomeSubject: string;
  welcomeBody: string;
  smtpHost?: string;
  smtpPort?: string;
}

export const getEmailSettings = (): EmailConfig => {
  const saved = localStorage.getItem('lumina_settings');
  const defaults = {
    senderName: 'BOTSCRm Team',
    senderEmail: 'no-reply@botscrm.com',
    welcomeSubject: 'Hoş Geldin {{name}}! Otomasyon Yolculuğun Başlıyor',
    welcomeBody: 'Merhaba {{name}},\n\nBOTSCRm ailesine katıldığın için çok mutluyuz! Artık işlerini yapay zeka ile uçuşa geçirebilirsin.\n\nSevgiler,\nBOTSCRm Ekibi'
  };
  
  if (!saved) return defaults;
  const parsed = JSON.parse(saved);
  return {
    senderName: parsed.senderName || defaults.senderName,
    senderEmail: parsed.senderEmail || defaults.senderEmail,
    welcomeSubject: parsed.welcomeSubject || defaults.welcomeSubject,
    welcomeBody: parsed.welcomeBody || defaults.welcomeBody,
    smtpHost: parsed.smtpHost,
    smtpPort: parsed.smtpPort
  };
};

export const sendEmail = async (to: string, subject: string, body: string) => {
  // Gerçek bir senaryoda burada Resend, SendGrid veya özel bir API rotası çağrılır.
  console.log(`[Email Service] Gönderiliyor... 
    Kime: ${to}
    Konu: ${subject}
    İçerik: ${body}
  `);
  
  // Simülasyon: API isteği 1 saniye sürer
  return new Promise((resolve) => setTimeout(resolve, 1000));
};

export const triggerWelcomeEmail = async (userEmail: string, userName: string) => {
  const settings = getEmailSettings();
  const subject = settings.welcomeSubject.replace('{{name}}', userName);
  const body = settings.welcomeBody.replace('{{name}}', userName);
  
  await sendEmail(userEmail, subject, body);
};

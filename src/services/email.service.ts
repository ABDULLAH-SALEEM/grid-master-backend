const SibApiV3Sdk = require("sib-api-v3-sdk");
const defaultClient = SibApiV3Sdk.ApiClient.instance;
const apiKey = defaultClient.authentications["api-key"];
apiKey.apiKey = process.env.SENDINBLUE_API_KEY;
const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();
let sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();

class EmailService {
  sendEmail(data: { email: string; id: number; params: {} }) {
    const { email, id, params } = data;
    sendSmtpEmail = {
      to: [
        {
          email: email.toLowerCase(),
        },
      ],
      templateId: id,
    };
    if (params) {
      sendSmtpEmail.params = params;
    }
    return apiInstance.sendTransacEmail(sendSmtpEmail);
  }
}

export default new EmailService();

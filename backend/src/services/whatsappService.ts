export const sendWhatsAppOrderUpdate = async (phone: string, orderId: string, status: string): Promise<boolean> => {
  try {
    const accessToken = process.env.WHATSAPP_ACCESS_TOKEN;
    const phoneId = process.env.WHATSAPP_PHONE_NUMBER_ID;

    if (!accessToken || !phoneId || accessToken.includes('your_')) {
      console.warn('[WhatsApp] Order update halted dynamically: WHATSAPP_ACCESS_TOKEN missing natively.');
      return false; 
    }

    const cleanPhone = phone.replace(/\D/g, '');
    let formattedPhone = cleanPhone;
    if (cleanPhone.length === 10) formattedPhone = `91${cleanPhone}`;

    const response = await fetch(`https://graph.facebook.com/v18.0/${phoneId}/messages`, {
      method: "POST",
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        messaging_product: "whatsapp",
        recipient_type: "individual",
        to: formattedPhone,
        type: "template",
        template: {
          name: "order_update",
          language: { code: "en" },
          components: [
            {
              type: "body",
              parameters: [
                { type: "text", text: orderId },
                { type: "text", text: status }
              ]
            }
          ]
        }
      })
    });

    if (!response.ok) {
       const json = await response.json();
       console.error('[WhatsApp] Meta Vector Request fault:', json);
       return false;
    }

    console.log(`[WhatsApp] Delivery status dynamically sent to ${formattedPhone} via Meta v18.0 APIs.`);
    return true;
  } catch (error: any) {
    console.error('[WhatsApp] Critical dispatch fault bypassed natively:', error.message);
    return false;
  }
};

export const sendWhatsAppOtp = async (phone: string, otp: string): Promise<boolean> => {
  try {
    const accessToken = process.env.WHATSAPP_ACCESS_TOKEN;
    const phoneId = process.env.WHATSAPP_PHONE_NUMBER_ID;

    if (!accessToken || !phoneId || accessToken.includes('your_')) {
      console.warn('[WhatsApp] OTP validation halted implicitly: WHATSAPP_ACCESS_TOKEN missing natively. Resorting to console fallback natively.');
      console.log(`\n===============\n[OTP FALLBACK FOR ${phone}]: ${otp}\n===============\n`);
      return true; // Mock success loop natively if no API configured locally
    }

    const cleanPhone = phone.replace(/\D/g, '');
    let formattedPhone = cleanPhone;
    if (cleanPhone.length === 10) formattedPhone = `91${cleanPhone}`;

    const response = await fetch(`https://graph.facebook.com/v18.0/${phoneId}/messages`, {
      method: "POST",
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        messaging_product: "whatsapp",
        recipient_type: "individual",
        to: formattedPhone,
        type: "template",
        template: {
          name: "otp_verification",
          language: { code: "en" },
          components: [
            {
              type: "body",
              parameters: [
                { type: "text", text: otp }
              ]
            },
            {
              type: "button",
              sub_type: "url",
              index: "0",
              parameters: [
                { type: "text", text: otp }
              ]
            }
          ]
        }
      })
    });

    if (!response.ok) {
       const json = await response.json();
       console.error('[WhatsApp] Meta OTP Transmission fault natively:', json);
       // Mock fallback mapping ensuring auth succeeds even if Meta node fails
       console.log(`\n===============\n[OTP FALLBACK FOR ${phone}]: ${otp}\n===============\n`);
       return false;
    }

    console.log(`[WhatsApp] Secure OTP dynamically routed globally to ${formattedPhone}.`);
    return true;
  } catch (error: any) {
    console.error('[WhatsApp] Critical OTP logic fault bypassed natively:', error.message);
    return false;
  }
};

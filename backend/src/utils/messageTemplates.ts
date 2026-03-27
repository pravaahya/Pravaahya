export const getOrderTemplate = (orderId: string, status: string): string => {
  const s = status.toLowerCase();
  switch (s) {
    case 'pending':
    case 'paid':
      return `Thank you for choosing Pravaahya! Your order #${orderId} has been successfully placed and is awaiting processing. 🌿`;
    case 'processing':
      return `Great news! We have started processing your Pravaahya order #${orderId}. We are getting your sustainable items ready. 📦`;
    case 'shipped':
      return `Your Pravaahya order #${orderId} has been shipped! It's on its way to you via carbon-neutral delivery. Track it securely! 🚚`;
    case 'delivered':
      return `Your Pravaahya order #${orderId} has been delivered! We hope you love your sustainable goods. Thank you for making a difference! 💚`;
    case 'cancelled':
    case 'failed':
      return `Your Pravaahya order #${orderId} has been cancelled. If you believe this is an error, please reach out to our support team unconditionally. ❌`;
    default:
      return `There is an update on your Pravaahya order #${orderId}: Status is now ${status.toUpperCase()}.`;
  }
};

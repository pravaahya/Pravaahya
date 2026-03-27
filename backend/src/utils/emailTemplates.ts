interface OrderData {
  orderId: string;
  amount: number;
  userName: string;
  status: string;
}

export const getOrderConfirmationEmail = (data: OrderData): string => `
  <div style="font-family: Arial, sans-serif; padding: 30px; color: #111827; background-color: #f9fafb; border-radius: 12px; max-width: 600px; margin: 0 auto; border: 1px solid #e5e7eb;">
    <h2 style="color: #166534; font-size: 24px; font-weight: 900; margin-bottom: 5px;">Order Confirmation</h2>
    <p style="color: #6b7280; font-size: 14px; margin-top: 0; margin-bottom: 25px;">Pravaahya Eco Sustainable Delivery</p>
    
    <p style="font-size: 16px;">Hi <strong>${data.userName}</strong>,</p>
    <p style="font-size: 16px; line-height: 1.5;">Thank you for shopping securely at Pravaahya! Your transaction has been logged and your order <strong>#${data.orderId}</strong> has been successfully placed into our dispatch queue.</p>
    
    <div style="background-color: #ffffff; padding: 20px; border-radius: 8px; margin: 25px 0; border: 1px solid #e5e7eb;">
       <p style="margin: 5px 0;"><strong>Estimated Total Amount:</strong> <span style="color: #16a34a; font-weight: bold;">₹${data.amount.toFixed(2)}</span></p>
       <p style="margin: 5px 0;"><strong>Active Status:</strong> <span style="background-color: #fef08a; padding: 2px 8px; border-radius: 4px; font-weight: bold; font-size: 12px; color: #a16207;">${data.status.toUpperCase()}</span></p>
    </div>
    
    <p style="font-size: 16px; line-height: 1.5;">Our native automation bounds will trace your shipment and notify you instantaneously upon dispatch.</p>
    
    <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;" />
    <p style="font-size: 14px; font-weight: bold; margin: 0;">Sustainable Regards,</p>
    <p style="font-size: 14px; color: #6b7280; margin-top: 5px;">The Pravaahya Node Architecture</p>
  </div>
`;

export const getOrderStatusUpdateEmail = (data: OrderData): string => `
  <div style="font-family: Arial, sans-serif; padding: 30px; color: #111827; background-color: #f9fafb; border-radius: 12px; max-width: 600px; margin: 0 auto; border: 1px solid #e5e7eb;">
    <h2 style="color: #1d4ed8; font-size: 24px; font-weight: 900; margin-bottom: 5px;">Delivery Logic Update</h2>
    <p style="color: #6b7280; font-size: 14px; margin-top: 0; margin-bottom: 25px;">Pravaahya Eco Logistical Triggers</p>
    
    <p style="font-size: 16px;">Hi <strong>${data.userName}</strong>,</p>
    <p style="font-size: 16px; line-height: 1.5;">A physical operational state change has occurred for your Pravaahya order <strong>#${data.orderId}</strong> internally.</p>
    
    <div style="background-color: #ffffff; padding: 20px; border-radius: 8px; margin: 25px 0; border: 1px solid #e5e7eb;">
       <p style="margin: 5px 0;"><strong>Calculated Invoice Total:</strong> <span style="color: #16a34a; font-weight: bold;">₹${data.amount.toFixed(2)}</span></p>
       <p style="margin: 5px 0;"><strong>Synchronized Checkpoint:</strong> <span style="background-color: #dbeafe; padding: 2px 8px; border-radius: 4px; font-weight: bold; font-size: 12px; color: #1e40af;">${data.status.toUpperCase()}</span></p>
    </div>
    
    <p style="font-size: 16px; line-height: 1.5;">Track your lifecycle organically via your integrated dashboard matrix.</p>
    
    <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;" />
    <p style="font-size: 14px; font-weight: bold; margin: 0;">Best Logic Bounds,</p>
    <p style="font-size: 14px; color: #6b7280; margin-top: 5px;">The Pravaahya Operations Array</p>
  </div>
`;

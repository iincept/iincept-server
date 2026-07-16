const nodemailer = require("nodemailer");

// Initialize Mail Transporter using environment configurations
const createTransporter = () => {
  const hasSMTP =
    process.env.SMTP_HOST &&
    process.env.SMTP_PORT &&
    process.env.SMTP_USER &&
    process.env.SMTP_PASS;

  if (hasSMTP) {
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: Number(process.env.SMTP_PORT) === 465,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }
  return null;
};

// Dispatch HTML Email Alert
const dispatchEmail = async (to, subject, htmlContent) => {
  const transporter = createTransporter();
  if (transporter) {
    try {
      await transporter.sendMail({
        from: `"iiNCEPT Business Store" <${process.env.SMTP_USER}>`,
        to,
        subject,
        html: htmlContent,
      });
      console.log(`[Email Dispatched] to: ${to} | Subject: ${subject}`);
    } catch (err) {
      console.error("[Email Dispatch Error]:", err.message);
    }
  } else {
    console.log(`
======================================================
[SIMULATED EMAIL NOTIFICATION]
To: ${to}
Subject: ${subject}
Content Preview:
${htmlContent.replace(/<[^>]*>/g, " ").substring(0, 300)}...
======================================================
    `);
  }
};

// Dispatch Simulated WhatsApp Message
const dispatchWhatsApp = (phone, text) => {
  console.log(`
======================================================
[SIMULATED WHATSAPP NOTIFICATION]
Recipient: ${phone}
Message Body:
"${text}"
======================================================
  `);
};

// Notification Event: Order Placed Success
const sendOrderPlacedNotification = async (order) => {
  if (!order || !order.user) return;
  const customerEmail = order.user.email;
  const customerName = order.user.name || "Customer";
  const orderId = order._id.toString().substring(0, 10).toUpperCase();

  const emailHtml = `
    <div style="font-family: sans-serif; padding: 24px; color: #333;">
      <h2 style="color: #0071e3;">Order Confirmed!</h2>
      <p>Hi ${customerName},</p>
      <p>Thank you for shopping at iiNCEPT. We have received your order <b>#${orderId}</b> and it is currently being processed.</p>
      <h3>Order Summary:</h3>
      <p>Total Paid Amount: <b>₹${order.totalAmount.toLocaleString("en-IN")}</b></p>
      <p>Payment Method: <b>${order.paymentMethod}</b></p>
      <p>We will send another notification once your package leaves our fulfillment warehouse.</p>
      <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
      <p style="font-size: 11px; color: #888;">This is an automated notification. Please do not reply directly to this mail.</p>
    </div>
  `;

  await dispatchEmail(customerEmail, `Your iiNCEPT Order #${orderId} has been placed!`, emailHtml);

  if (order.user.phone || (order.shippingAddress && order.shippingAddress.phone)) {
    const phone = order.user.phone || order.shippingAddress.phone;
    dispatchWhatsApp(
      phone,
      `Hi ${customerName}! Your order #${orderId} of ₹${order.totalAmount.toLocaleString("en-IN")} has been placed successfully on iiNCEPT. Tracking timeline is active at: http://localhost:5173/profile?tab=orders`
    );
  }
};

// Notification Event: Order Shipped
const sendOrderShippedNotification = async (order) => {
  if (!order || !order.user) return;
  const customerEmail = order.user.email;
  const customerName = order.user.name || "Customer";
  const orderId = order._id.toString().substring(0, 10).toUpperCase();

  const emailHtml = `
    <div style="font-family: sans-serif; padding: 24px; color: #333;">
      <h2 style="color: #0071e3;">Your Order has Shipped!</h2>
      <p>Hi ${customerName},</p>
      <p>Great news! Your order <b>#${orderId}</b> has been handed over to our shipping courier partners and is on its way to you.</p>
      <p>You can track delivery timeline statuses directly under your customer account page dashboard.</p>
      <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
      <p style="font-size: 11px; color: #888;">iiNCEPT Logistical Fulfillment</p>
    </div>
  `;

  await dispatchEmail(customerEmail, `Your iiNCEPT Order #${orderId} has been shipped!`, emailHtml);

  if (order.user.phone || (order.shippingAddress && order.shippingAddress.phone)) {
    const phone = order.user.phone || order.shippingAddress.phone;
    dispatchWhatsApp(
      phone,
      `Hi ${customerName}! Good news: your iiNCEPT order #${orderId} has been shipped out. Track its movement here: http://localhost:5173/profile?tab=orders`
    );
  }
};

// Notification Event: Order Delivered
const sendOrderDeliveredNotification = async (order) => {
  if (!order || !order.user) return;
  const customerEmail = order.user.email;
  const customerName = order.user.name || "Customer";
  const orderId = order._id.toString().substring(0, 10).toUpperCase();

  const emailHtml = `
    <div style="font-family: sans-serif; padding: 24px; color: #333;">
      <h2 style="color: #10b981;">Delivered Successfully!</h2>
      <p>Hi ${customerName},</p>
      <p>Your order <b>#${orderId}</b> was successfully delivered to your shipping address.</p>
      <p>We hope you love your new Apple device! Let us know your thoughts by submitting a product review.</p>
      <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
      <p style="font-size: 11px; color: #888;">Thank you for sourcing with iiNCEPT!</p>
    </div>
  `;

  await dispatchEmail(customerEmail, `Delivered: Your iiNCEPT Order #${orderId}`, emailHtml);

  if (order.user.phone || (order.shippingAddress && order.shippingAddress.phone)) {
    const phone = order.user.phone || order.shippingAddress.phone;
    dispatchWhatsApp(
      phone,
      `Hey ${customerName}! Your order #${orderId} was delivered. Thank you for choosing iiNCEPT. Leave a review to let us know your feedback!`
    );
  }
};

// Notification Event: Return Request Status Updated
const sendReturnUpdateNotification = async (order, returnReq) => {
  if (!order || !order.user) return;
  const customerEmail = order.user.email;
  const customerName = order.user.name || "Customer";
  const orderId = order._id.toString().substring(0, 10).toUpperCase();
  const returnStatus = returnReq.status;

  const emailHtml = `
    <div style="font-family: sans-serif; padding: 24px; color: #333;">
      <h2>Return Request Status Update</h2>
      <p>Hi ${customerName},</p>
      <p>The return request files for your order <b>#${orderId}</b> have been updated by our business desk.</p>
      <p>Current Return Status: <b style="color: #0071e3;">${returnStatus}</b></p>
      ${
        returnStatus === "Approved"
          ? "<p>Please pack the device securely. Our logistics courier will arrive within 2-3 days for pickup.</p>"
          : returnStatus === "Refunded"
          ? "<p>Your refund transaction has been processed. The amount will credit to your account in 5-7 business days.</p>"
          : ""
      }
      <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
      <p style="font-size: 11px; color: #888;">iiNCEPT Support Desk</p>
    </div>
  `;

  await dispatchEmail(customerEmail, `Update: Return Request for Order #${orderId}`, emailHtml);

  if (order.user.phone || (order.shippingAddress && order.shippingAddress.phone)) {
    const phone = order.user.phone || order.shippingAddress.phone;
    dispatchWhatsApp(
      phone,
      `Hello ${customerName}, the return request status for your order #${orderId} is now updated to: ${returnStatus.toUpperCase()}. Check updates on http://localhost:5173/profile?tab=orders`
    );
  }
};

module.exports = {
  sendOrderPlacedNotification,
  sendOrderShippedNotification,
  sendOrderDeliveredNotification,
  sendReturnUpdateNotification,
};

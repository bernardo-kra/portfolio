// Deployment policy: never take ownership from environment, requests or user roles.
export const chatOwnerEmail = () => 'bernardokrac@gmail.com';

export function isChatOwner(user: { email?: string; googleSub?: string }) {
  return (
    user.email === chatOwnerEmail() &&
    typeof user.googleSub === 'string' &&
    user.googleSub.length > 0
  );
}

export function conversationEmail(message: {
  conversationUserEmail?: string;
  senderEmail?: string;
  recipientEmail?: string;
  replyTo?: string;
  isAdmin?: boolean;
}) {
  return (
    message.conversationUserEmail ||
    (message.isAdmin
      ? message.recipientEmail || message.replyTo
      : message.senderEmail)
  );
}

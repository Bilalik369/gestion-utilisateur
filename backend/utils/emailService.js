const emailjs = require('@emailjs/nodejs');


emailjs.init({
  publicKey: process.env.EMAILJS_PUBLIC_KEY,
  privateKey: process.env.EMAILJS_PRIVATE_KEY
});

/**
 * Send verification email to user
 * @param {string} email - User's email
 * @param {string} username - User's username
 * @param {string} token - Verification token
 * @returns {Promise} - EmailJS response
 */
exports.sendVerificationEmail = async (email, username, token) => {
  try {
    const verificationUrl = `${process.env.CLIENT_URL}/verify-email/${token}`;
    
    const templateParams = {
      to_email: email,
      to_name: username,
      verification_link: verificationUrl,
      subject: 'Vérifiez votre adresse email'
    };

    const response = await emailjs.send(
      process.env.EMAILJS_SERVICE_ID,
      process.env.EMAILJS_VERIFICATION_TEMPLATE_ID,
      templateParams
    );

    console.log('Verification email sent successfully:', response.status, response.text);
    return response;
  } catch (error) {
    console.error('Error sending verification email:', error);
    throw new Error('Failed to send verification email');
  }
};

/**
 * Send password reset email to user
 * @param {string} email - User's email
 * @param {string} username - User's username
 * @param {string} token - Reset token
 * @returns {Promise} - EmailJS response
 */
exports.sendPasswordResetEmail = async (email, username, token) => {
  try {
    const resetUrl = `${process.env.CLIENT_URL}/reset-password/${token}`;
    
    const templateParams = {
      to_email: email,
      to_name: username,
      reset_link: resetUrl,
      subject: 'Réinitialisation de votre mot de passe'
    };

    const response = await emailjs.send(
      process.env.EMAILJS_SERVICE_ID,
      process.env.EMAILJS_RESET_TEMPLATE_ID,
      templateParams
    );

    console.log('Password reset email sent successfully:', response.status, response.text);
    return response;
  } catch (error) {
    console.error('Error sending password reset email:', error);
    throw new Error('Failed to send password reset email');
  }
};

/**
 * Send email change confirmation email
 * @param {string} newEmail - User's new email
 * @param {string} username - User's username
 * @param {string} token - Email change token
 * @returns {Promise} - EmailJS response
 */
exports.sendEmailChangeConfirmation = async (newEmail, username, token) => {
  try {
    const confirmationUrl = `${process.env.CLIENT_URL}/confirm-email/${token}`;
    
    const templateParams = {
      to_email: newEmail,
      to_name: username,
      confirmation_link: confirmationUrl,
      subject: 'Confirmez votre nouvelle adresse email'
    };

    const response = await emailjs.send(
      process.env.EMAILJS_SERVICE_ID,
      process.env.EMAILJS_EMAIL_CHANGE_TEMPLATE_ID,
      templateParams
    );

    console.log('Email change confirmation sent successfully:', response.status, response.text);
    return response;
  } catch (error) {
    console.error('Error sending email change confirmation:', error);
    throw new Error('Failed to send email change confirmation');
  }
};
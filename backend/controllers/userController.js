import User from '../models/User.js';
import UserLog from '../models/UserLog.js';
import { generateToken } from '../utils/tokenService.js';
import { sendEmailChangeConfirmation } from '../utils/emailService.js';
import bcrypt from 'bcryptjs';

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password -verificationToken -resetPasswordToken');
    
    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// @desc    Update username
// @route   PUT /api/users/username
// @access  Private
export const updateUsername = async (req, res) => {
  try {
    const { username } = req.body;
    
    // Check if username is already taken
    const existingUser = await User.findOne({ username, _id: { $ne: req.user.id } });
    if (existingUser) {
      return res.status(400).json({ message: 'Ce nom d\'utilisateur est déjà utilisé' });
    }

    const user = await User.findById(req.user.id);
    const oldUsername = user.username;
    
    // Update username
    user.username = username;
    await user.save();

    // Log username change
    await UserLog.create({
      userId: user._id,
      action: 'update_username',
      details: `Nom d'utilisateur modifié: ${oldUsername} -> ${username}`,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent']
    });

    res.status(200).json({ message: 'Nom d\'utilisateur mis à jour avec succès', username });
  } catch (error) {
    console.error('Update username error:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// @desc    Request email change
// @route   POST /api/users/email
// @access  Private
export const requestEmailChange = async (req, res) => {
  try {
    const { newEmail } = req.body;
    
    // Check if email is already taken
    const existingUser = await User.findOne({ email: newEmail, _id: { $ne: req.user.id } });
    if (existingUser) {
      return res.status(400).json({ message: 'Cet email est déjà utilisé' });
    }

    const user = await User.findById(req.user.id);
    
    // Generate verification token
    const emailChangeToken = generateToken();
    
    // Update user
    user.pendingEmail = newEmail;
    user.emailChangeToken = emailChangeToken;
    user.emailChangeTokenExpires = Date.now() + 24 * 60 * 60 * 1000; // 24 hours
    await user.save();

    // Send confirmation email
    await sendEmailChangeConfirmation(newEmail, user.username, emailChangeToken);

    // Log email change request
    await UserLog.create({
      userId: user._id,
      action: 'request_email_change',
      details: `Demande de changement d'email: ${user.email} -> ${newEmail}`,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent']
    });

    res.status(200).json({ 
      message: 'Un email de confirmation a été envoyé à votre nouvelle adresse email' 
    });
  } catch (error) {
    console.error('Request email change error:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// @desc    Confirm email change
// @route   GET /api/users/email/confirm/:token
// @access  Public
export const confirmEmailChange = async (req, res) => {
  try {
    const { token } = req.params;

    // Find user with this token
    const user = await User.findOne({
      emailChangeToken: token,
      emailChangeTokenExpires: { $gt: Date.now() }
    });

    if (!user || !user.pendingEmail) {
      return res.status(400).json({ message: 'Token de confirmation invalide ou expiré' });
    }

    const oldEmail = user.email;
    const newEmail = user.pendingEmail;

    // Update user
    user.email = newEmail;
    user.pendingEmail = undefined;
    user.emailChangeToken = undefined;
    user.emailChangeTokenExpires = undefined;
    await user.save();

    // Log email change
    await UserLog.create({
      userId: user._id,
      action: 'confirm_email_change',
      details: `Email modifié: ${oldEmail} -> ${newEmail}`,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent']
    });

    res.status(200).json({ message: 'Adresse email mise à jour avec succès' });
  } catch (error) {
    console.error('Confirm email change error:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// @desc    Update phone number
// @route   PUT /api/users/phone
// @access  Private
export const updatePhone = async (req, res) => {
  try {
    const { phone } = req.body;
    
    const user = await User.findById(req.user.id);
    const oldPhone = user.phone;
    
    // Update phone
    user.phone = phone;
    await user.save();

    // Log phone change
    await UserLog.create({
      userId: user._id,
      action: 'update_phone',
      details: `Numéro de téléphone modifié: ${oldPhone} -> ${phone}`,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent']
    });

    res.status(200).json({ message: 'Numéro de téléphone mis à jour avec succès', phone });
  } catch (error) {
    console.error('Update phone error:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// @desc    Change password
// @route   PUT /api/users/password
// @access  Private
export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    
    const user = await User.findById(req.user.id);
    
    // Check current password
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Mot de passe actuel incorrect' });
    }
    
    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    
    // Update password
    user.password = hashedPassword;
    await user.save();

    // Log password change
    await UserLog.create({
      userId: user._id,
      action: 'change_password',
      details: 'Mot de passe modifié',
      ipAddress: req.ip,
      userAgent: req.headers['user-agent']
    });

    res.status(200).json({ message: 'Mot de passe mis à jour avec succès' });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};
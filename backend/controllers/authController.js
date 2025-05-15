import User from '..';
import UserLog from '../models/UserLog.js';
import { generateToken } from '../utils/tokenService.js';
import { sendVerificationEmail, sendPasswordResetEmail } from '../utils/emailService.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

export const register = async (req, res) => {
  try {
    const { username, email, password, phone } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'Cet email est déjà utilisé' });
    }

    
    const verificationToken = generateToken();

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    
    const user = await User.create({
      username,
      email,
      password: hashedPassword,
      phone,
      verificationToken,
      verificationTokenExpires: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
      isVerified: false
    });

    
    await sendVerificationEmail(email, username, verificationToken);

   
    await UserLog.create({
      userId: user._id,
      action: 'register',
      details: 'Inscription utilisateur',
      ipAddress: req.ip,
      userAgent: req.headers['user-agent']
    });

    res.status(201).json({
      message: 'Inscription réussie. Veuillez vérifier votre email pour activer votre compte.'
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

export const verifyEmail = async (req, res) => {
  try {
    const { token } = req.params;

   
    const user = await User.findOne({
      verificationToken: token,
      verificationTokenExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ message: 'Token de vérification invalide ou expiré' });
    }


    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpires = undefined;
    await user.save();

 
    await UserLog.create({
      userId: user._id,
      action: 'verify_email',
      details: 'Email vérifié',
      ipAddress: req.ip,
      userAgent: req.headers['user-agent']
    });

    res.status(200).json({ message: 'Email vérifié avec succès. Vous pouvez maintenant vous connecter.' });
  } catch (error) {
    console.error('Verify email error:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};


export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Email ou mot de passe incorrect' });
    }

    if (!user.isVerified) {
      return res.status(401).json({ message: 'Veuillez vérifier votre email avant de vous connecter' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Email ou mot de passe incorrect' });
    }

    
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    
    await UserLog.create({
      userId: user._id,
      action: 'login',
      details: 'Connexion utilisateur',
      ipAddress: req.ip,
      userAgent: req.headers['user-agent']
    });

    res.status(200).json({
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};


export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

 
    const user = await User.findOne({ email });
    if (!user) {
      
      return res.status(200).json({ 
        message: 'Si votre email est enregistré, vous recevrez un lien de réinitialisation' 
      });
    }

    const resetToken = generateToken();

    
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
    await user.save();

    await sendPasswordResetEmail(email, user.username, resetToken);

  
    await UserLog.create({
      userId: user._id,
      action: 'forgot_password',
      details: 'Demande de réinitialisation de mot de passe',
      ipAddress: req.ip,
      userAgent: req.headers['user-agent']
    });

    res.status(200).json({ 
      message: 'Si votre email est enregistré, vous recevrez un lien de réinitialisation' 
    });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};


export const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ message: 'Token de réinitialisation invalide ou expiré' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);


    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

  
    await UserLog.create({
      userId: user._id,
      action: 'reset_password',
      details: 'Mot de passe réinitialisé',
      ipAddress: req.ip,
      userAgent: req.headers['user-agent']
    });

    res.status(200).json({ message: 'Mot de passe réinitialisé avec succès' });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};
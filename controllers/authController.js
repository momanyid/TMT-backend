const bcryptjs = require("bcryptjs");
const crypto = require("crypto");
const { generateTokenAndSetCookie } = require("../utils/generateTokenAndSetCookie.js");
const {
	sendPasswordResetEmail,
	sendResetSuccessEmail,
	sendVerificationEmail,
	sendWelcomeEmail,
} = require("../mailtrap/emails.js");
const { User } = require("../models/index.js");
const { Op } = require("sequelize");

const signup = async (req, res) => {
	const { email, password, username, phoneNumber, firstName, lastName } = req.body;

	try {
		if (!email || !password || !username || !firstName || !lastName) {
			throw new Error("Email, password, username, first name, and last name are required");
		}

		const userAlreadyExists = await User.findOne({
			where: {
				[Op.or]: [{ email }, { username }]
			}
		});

		if (userAlreadyExists) {
			return res.status(400).json({ success: false, message: "User already exists" });
		}

		const hashedPassword = await bcryptjs.hash(password, 10);
		const verificationToken = Math.floor(100000 + Math.random() * 900000).toString();

		const user = await User.create({
			email,
			password: hashedPassword,
			username,
			phoneNumber,
			firstName,
			lastName,
			verificationToken,
			verificationTokenExpiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
		});

		// jwt
		generateTokenAndSetCookie(res, user.id);

		await sendVerificationEmail(user.email, verificationToken);

		res.status(201).json({
			success: true,
			message: "User created successfully",
			user: {
				id: user.id,
				email: user.email,
				username: user.username,
				firstName: user.firstName,
				lastName: user.lastName,
				phoneNumber: user.phoneNumber,
				role: user.role,
				isVerified: user.isVerified,
				createdAt: user.createdAt,
				updatedAt: user.updatedAt
			},
		});
	} catch (error) {
		res.status(400).json({ success: false, message: error.message });
	}
};

const verifyEmail = async (req, res) => {
	const { code } = req.body;
	try {
		const user = await User.findOne({
			where: {
				verificationToken: code,
				verificationTokenExpiresAt: { [Op.gt]: new Date() },
			}
		});

		if (!user) {
			return res.status(400).json({ success: false, message: "Invalid or expired verification code" });
		}

		await user.update({
			isVerified: true,
			verificationToken: null,
			verificationTokenExpiresAt: null
		});

		await sendWelcomeEmail(user.email, user.username);

		res.status(200).json({
			success: true,
			message: "Email verified successfully",
			user: {
				id: user.id,
				email: user.email,
				username: user.username,
				firstName: user.firstName,
				lastName: user.lastName,
				phoneNumber: user.phoneNumber,
				role: user.role,
				isVerified: user.isVerified,
				createdAt: user.createdAt,
				updatedAt: user.updatedAt
			},
		});
	} catch (error) {
		console.log("error in verifyEmail ", error);
		res.status(500).json({ success: false, message: "Server error" });
	}
};

const login = async (req, res) => {
	const { email, password } = req.body;
	try {
		const user = await User.findOne({ where: { email } });
		if (!user) {
			return res.status(400).json({ success: false, message: "Invalid credentials" });
		}
		const isPasswordValid = await bcryptjs.compare(password, user.password);
		if (!isPasswordValid) {
			return res.status(400).json({ success: false, message: "Invalid credentials" });
		}

		generateTokenAndSetCookie(res, user.id);

		await user.update({ lastLogin: new Date() });

		res.status(200).json({
			success: true,
			message: "Logged in successfully",
			user: {
				id: user.id,
				email: user.email,
				username: user.username,
				firstName: user.firstName,
				lastName: user.lastName,
				phoneNumber: user.phoneNumber,
				role: user.role,
				isVerified: user.isVerified,
				lastLogin: user.lastLogin,
				createdAt: user.createdAt,
				updatedAt: user.updatedAt
			},
		});
	} catch (error) {
		console.log("Error in login ", error);
		res.status(400).json({ success: false, message: error.message });
	}
};

const logout = async (req, res) => {
	res.clearCookie("token");
	res.status(200).json({ success: true, message: "Logged out successfully" });
};

const forgotPassword = async (req, res) => {
	const { email } = req.body;
	try {
		const user = await User.findOne({ where: { email } });

		if (!user) {
			return res.status(400).json({ success: false, message: "User not found" });
		}

		// Generate reset token
		const resetToken = crypto.randomBytes(20).toString("hex");
		const resetTokenExpiresAt = new Date(Date.now() + 1 * 60 * 60 * 1000); // 1 hour

		await user.update({
			resetPasswordToken: resetToken,
			resetPasswordExpiresAt: resetTokenExpiresAt
		});

		// send email
		await sendPasswordResetEmail(user.email, `${process.env.CLIENT_URL}/reset-password/${resetToken}`);

		res.status(200).json({ success: true, message: "Password reset link sent to your email" });
	} catch (error) {
		console.log("Error in forgotPassword ", error);
		res.status(400).json({ success: false, message: error.message });
	}
};

const resetPassword = async (req, res) => {
	try {
		const { token } = req.params;
		const { password } = req.body;

		const user = await User.findOne({
			where: {
				resetPasswordToken: token,
				resetPasswordExpiresAt: { [Op.gt]: new Date() },
			}
		});

		if (!user) {
			return res.status(400).json({ success: false, message: "Invalid or expired reset token" });
		}

		// update password
		const hashedPassword = await bcryptjs.hash(password, 10);

		await user.update({
			password: hashedPassword,
			resetPasswordToken: null,
			resetPasswordExpiresAt: null
		});

		await sendResetSuccessEmail(user.email);

		res.status(200).json({ success: true, message: "Password reset successful" });
	} catch (error) {
		console.log("Error in resetPassword ", error);
		res.status(400).json({ success: false, message: error.message });
	}
};

const checkAuth = async (req, res) => {
	try {
		const user = await User.findByPk(req.userId, {
			attributes: { exclude: ['password'] }
		});
		if (!user) {
			return res.status(400).json({ success: false, message: "User not found" });
		}

		res.status(200).json({ success: true, user });
	} catch (error) {
		console.log("Error in checkAuth ", error);
		res.status(400).json({ success: false, message: error.message });
	}
};

module.exports = {
	signup,
	verifyEmail,
	login,
	logout,
	forgotPassword,
	resetPassword,
	checkAuth,
};
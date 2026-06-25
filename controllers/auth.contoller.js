const bcrypt = require("bcryptjs");

const generateToken = require("../utils/generateToken");
const asyncHandler = require("../utils/asyncHandler");
const ApiError = require("../utils/ApiError");
const ApiResponse = require("../utils/ApiResponse");

const userModel = require("../models/user.model");

module.exports = {
	register: asyncHandler(async (req, res) => {
		const { name, email, password } = req.body;

		if (!name || !email || !password) {
			throw new ApiError(
				400,
				"All fields are required"
			);
		}

		const existingUser = await userModel.findOne({
			email,
		});

		if (existingUser) {
			throw new ApiError(
				409,
				"User already exists"
			);
		}

		const hashedPassword = await bcrypt.hash(
			password,
			10
		);

		const user = await userModel.create({
			name,
			email,
			password: hashedPassword,
		});

		const token = generateToken(user);

		return res.status(201).json(
			new ApiResponse(
				201,
				{
					token,
					user: {
						id: user._id,
						name: user.name,
						email: user.email,
					},
				},
				"User registered successfully"
			)
		);
	}),

	login: asyncHandler(async (req, res) => {
		const { email, password } = req.body;

		if (!email || !password) {
			throw new ApiError(
				400,
				"Email and password are required"
			);
		}

		const user = await userModel.findOne({
			email,
		});

		if (!user) {
			throw new ApiError(
				401,
				"Invalid credentials"
			);
		}

		const isMatch = await bcrypt.compare(
			password,
			user.password
		);

		if (!isMatch) {
			throw new ApiError(
				401,
				"Invalid credentials"
			);
		}

		const token = generateToken(user);

		return res.status(200).json(
			new ApiResponse(
				200,
				{
					token,
					user: {
						id: user._id,
						name: user.name,
						email: user.email,
					},
				},
				"Login successful"
			)
		);
	}),
};
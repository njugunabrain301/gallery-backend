const express = require("express");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const { generateToken } = require("../utils/Auth");
const SendSMS = require("../utils/sendSMS");
const router = express.Router();
const { authenticate } = require("../utils/Auth");

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - firstName
 *         - lastName
 *         - phoneNumber
 *         - password
 *         - email
 *         - userType
 *       properties:
 *         _id:
 *           type: string
 *         firstName:
 *           type: string
 *           example: John
 *         lastName:
 *           type: string
 *           example: Doe
 *         otherNames:
 *           type: string
 *           example: Middle
 *         phoneNumber:
 *           type: string
 *           example: "254712345678"
 *         email:
 *           type: string
 *           format: email
 *           example: john.doe@example.com
 *         userType:
 *           type: string
 *           enum: [customer, partner, admin]
 *         documentType:
 *           type: string
 *           enum: [ID, Passport, Driving License]
 *         documentNumber:
 *           type: string
 *         address:
 *           type: string
 *         dateOfBirth:
 *           type: string
 *           format: date
 *         customerDetails:
 *           type: string
 *           description: Reference to Customer model
 *         partnerDetails:
 *           type: string
 *           description: Reference to Partner model
 *         adminDetails:
 *           type: string
 *           description: Reference to Admin model
 *
 * /auth/signup:
 *   post:
 *     tags: [Auth]
 *     summary: Register a new user
 *     description: Create a new user account with the provided details
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - firstName
 *               - lastName
 *               - phoneNumber
 *               - password
 *               - email
 *               - userType
 *             properties:
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               otherNames:
 *                 type: string
 *               phoneNumber:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 format: password
 *               userType:
 *                 type: string
 *                 enum: [customer, partner, admin]
 *               documentType:
 *                 type: string
 *                 enum: [ID, Passport, Driving License]
 *               documentNumber:
 *                 type: string
 *               address:
 *                 type: string
 *               dateOfBirth:
 *                 type: string
 *                 format: date
 *     responses:
 *       201:
 *         description: User created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *
 * /auth/update-profile:
 *   put:
 *     tags: [Auth]
 *     summary: Update user profile
 *     description: Update user profile including personal and employment information. Requires authentication.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *                 example: "John"
 *               lastName:
 *                 type: string
 *                 example: "Doe"
 *               otherNames:
 *                 type: string
 *                 example: "Middle"
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "john.doe@example.com"
 *               documentType:
 *                 type: string
 *                 enum: ["ID", "Passport", "Driving License"]
 *               documentNumber:
 *                 type: string
 *               address:
 *                 type: string
 *               dateOfBirth:
 *                 type: string
 *                 format: date
 *               employmentStatus:
 *                 type: string
 *                 enum: ["employed", "self-employed", "unemployed"]
 *               employerName:
 *                 type: string
 *                 description: Required if employmentStatus is "employed"
 *               natureOfBusiness:
 *                 type: string
 *                 description: Required if employmentStatus is "self-employed"
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Profile updated successfully"
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *
 * /auth/get-profile:
 *   get:
 *     tags: [Auth]
 *     summary: Get user profile
 *     description: Get detailed user profile information
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *
 * /auth/login:
 *   post:
 *     tags: [Auth]
 *     summary: Login user
 *     description: Authenticate a user with phone number and password
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - phoneNumber
 *               - password
 *             properties:
 *               phoneNumber:
 *                 type: string
 *                 example: "254712345678"
 *               password:
 *                 type: string
 *                 format: password
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                 user:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                     firstName:
 *                       type: string
 *                     lastName:
 *                       type: string
 *                     userType:
 *                       type: string
 *                     phoneNumber:
 *                       type: string
 *       400:
 *         description: Invalid credentials
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   examples:
 *                     userNotFound:
 *                       value: "User not found"
 *                     invalidPassword:
 *                       value: "Invalid password"
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Customer:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         user:
 *           $ref: '#/components/schemas/User'
 *         rentedVehicles:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Vehicle'
 *         activeRentals:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Application'
 *         rentalHistory:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Application'
 */

// Signup route
router.post("/signup", async (req, res) => {
  try {
    // Check if user already exists
    const existingUser = await User.findOne({
      phoneNumber: req.body.phoneNumber,
    });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    // Create new user
    const user = new User({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      otherNames: req.body.otherNames,
      phoneNumber: req.body.phoneNumber,
      password: hashedPassword,
      userType: req.body.userType,
      email: req.body.email,
    });

    const savedUser = await user.save();

    // Generate token
    const token = generateToken({
      _id: savedUser._id,
      userType: savedUser.userType,
      phoneNumber: savedUser.phoneNumber,
    });

    // Send welcome SMS
    const smsMessage = `Welcome to Flex Drive! Download our application here: ${process.env.APP_DOWNLOAD_LINK}`;
    await SendSMS(smsMessage, savedUser.phoneNumber);

    res.status(201).json({
      token,
      user: {
        _id: savedUser._id,
        firstName: savedUser.firstName,
        lastName: savedUser.lastName,
        userType: savedUser.userType,
        phoneNumber: savedUser.phoneNumber,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Login route
router.post("/login", async (req, res) => {
  try {
    // Find user
    const user = await User.findOne({ phoneNumber: req.body.username });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    // Verify password
    const validPassword = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!validPassword) {
      return res.status(400).json({ message: "Invalid password" });
    }

    // Generate token
    const token = generateToken({
      _id: user._id,
      userType: user.userType,
      phoneNumber: user.phoneNumber,
    });

    res.json({
      token,
      user: {
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        userType: user.userType,
        phoneNumber: user.phoneNumber,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Forgot Password route
router.post("/forgot-password", async (req, res) => {
  try {
    const user = await User.findOne({ phoneNumber: req.body.phoneNumber });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    // Generate temporary password
    const tempPassword = Math.random().toString(36).slice(-8);
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(tempPassword, salt);

    // Update user password
    user.password = hashedPassword;
    await user.save();

    // Send SMS with temporary password
    const smsMessage = `Your temporary password is: ${tempPassword}. Please change it after logging in.`;
    await SendSMS(smsMessage, user.phoneNumber);

    res.json({ message: "Temporary password has been sent to your phone" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put("/update-profile", authenticate, async (req, res) => {
  try {
    const user = await User.findById(req.user.payload._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Update basic information
    const basicFields = [
      "firstName",
      "lastName",
      "otherNames",
      "email",
      "documentType",
      "documentNumber",
      "address",
      "dateOfBirth",
    ];
    basicFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        user[field] = req.body[field];
      }
    });

    // Update employment information
    if (req.body.employmentStatus) {
      user.employmentStatus = req.body.employmentStatus;

      // Reset employment fields
      user.employerName = undefined;
      user.natureOfBusiness = undefined;

      // Set relevant employment field based on status
      if (user.employmentStatus === "employed") {
        if (!req.body.employerName) {
          return res.status(400).json({
            success: false,
            message: "Employer name is required for employed status",
          });
        }
        user.employerName = req.body.employerName;
      } else if (user.employmentStatus === "self-employed") {
        if (!req.body.natureOfBusiness) {
          return res.status(400).json({
            success: false,
            message: "Nature of business is required for self-employed status",
          });
        }
        user.natureOfBusiness = req.body.natureOfBusiness;
      }
    }

    await user.save();

    res.json({
      success: true,
      message: "Profile updated successfully",
      user: {
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        otherNames: user.otherNames,
        email: user.email,
        phoneNumber: user.phoneNumber,
        documentType: user.documentType,
        documentNumber: user.documentNumber,
        address: user.address,
        dateOfBirth: user.dateOfBirth,
        employmentStatus: user.employmentStatus,
        ...(user.employmentStatus === "employed" && {
          employerName: user.employerName,
        }),
        ...(user.employmentStatus === "self-employed" && {
          natureOfBusiness: user.natureOfBusiness,
        }),
      },
    });
  } catch (error) {
    console.error("Update profile error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

router.get("/check-token", authenticate, async (req, res) => {
  try {
    // Get expiration time from the token payload
    const expirationTime = new Date(req.user.exp * 1000); // Convert to milliseconds
    const now = new Date();

    // If token expires in less than 30 minutes, refresh it
    if (expirationTime - now < 30 * 60 * 1000) {
      // Generate new token with 2 more hours
      const newToken = generateToken(
        {
          _id: req.user.payload._id,
          userType: req.user.payload.userType,
          phoneNumber: req.user.payload.phoneNumber,
        },
        "2h"
      );

      return res.json({
        valid: true,
        newToken,
      });
    }

    // Token is still valid and not close to expiration
    res.json({
      valid: true,
      newToken: null,
    });
  } catch (error) {
    res.status(500).json({
      valid: false,
      message: error.message,
    });
  }
});

module.exports = router;

const User = require('../models/user.model');
const bcrypt = require('bcrypt')
const UserController = {
  // GET /api/v1/users
  async getAll(req, res) {
    try {
      const users = await User.findAll();

      return res.status(200).json({
        success: true,
        data: users,
      });
    } catch (error) {
      console.error('Get all users error:', error);

      return res.status(500).json({
        success: false,
        message: 'Internal server error',
      });
    }
  },

  // GET /api/v1/users/:id
  async getById(req, res) {
    try {
      const id = Number(req.params.id);

      if (!Number.isSafeInteger(id) || id <= 0) {
        return res.status(400).json({
          success: false,
          message: 'Invalid user ID',
        });
      }

      const user = await User.findById(id);

      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found',
        });
      }

      return res.status(200).json({
        success: true,
        data: user,
      });
    } catch (error) {
      console.error('Get user error:', error);

      return res.status(500).json({
        success: false,
        message: 'Internal server error',
      });
    }
  },

  // POST /api/v1/users
  async  create(req, res) {
    try {
      const { email, password, fullName } = req.body;

      if (!email || !password || !fullName) {
        return res.status(400).json({
          success: false,
          message: 'Email, password and fullName are required',
        });
      }

      const existingUser = await User.findByEmail(email);

      if (existingUser) {
        return res.status(409).json({
          success: false,
          message: 'Email already exists',
        });
      }
      const passwordHash = await hashPassword(password)
      const user = await User.create({
        email,
        passwordHash,
        fullName,
      });

      return res.status(201).json({
        success: true,
        message: 'User created successfully',
        data: user,
      });
    } catch (error) {
      console.error('Create user error:', error);

      // MySQL duplicate-key protection
      if (error.code === 'ER_DUP_ENTRY') {
        return res.status(409).json({
          success: false,
          message: 'Email already exists',
        });
      }

      return res.status(500).json({
        success: false,
        message: 'Internal server error',
      });
    }
  },

  // PUT /api/v1/users/:id
  async update(req, res) {
    try {
      const id = Number(req.params.id);
      const { email, fullName } = req.body;

      if (!Number.isSafeInteger(id) || id <= 0) {
        return res.status(400).json({
          success: false,
          message: 'Invalid user ID',
        });
      }

      if (!email || !fullName) {
        return res.status(400).json({
          success: false,
          message: 'Email and fullName are required',
        });
      }

      const existingUser = await User.findById(id);

      if (!existingUser) {
        return res.status(404).json({
          success: false,
          message: 'User not found',
        });
      }

      const userWithEmail = await User.findByEmail(email);

      if (userWithEmail && userWithEmail.id !== id) {
        return res.status(409).json({
          success: false,
          message: 'Email already exists',
        });
      }

      const user = await User.update(id, {
        email,
        fullName,
      });

      return res.status(200).json({
        success: true,
        message: 'User updated successfully',
        data: user,
      });
    } catch (error) {
      console.error('Update user error:', error);

      if (error.code === 'ER_DUP_ENTRY') {
        return res.status(409).json({
          success: false,
          message: 'Email already exists',
        });
      }

      return res.status(500).json({
        success: false,
        message: 'Internal server error',
      });
    }
  },

  // DELETE /api/v1/users/:id
  async delete(req, res) {
    try {
      const id = Number(req.params.id);

      if (!Number.isSafeInteger(id) || id <= 0) {
        return res.status(400).json({
          success: false,
          message: 'Invalid user ID',
        });
      }

      const deleted = await User.delete(id);

      if (!deleted) {
        return res.status(404).json({
          success: false,
          message: 'User not found',
        });
      }

      return res.status(200).json({
        success: true,
        message: 'User deleted successfully',
      });
    } catch (error) {
      console.error('Delete user error:', error);

      return res.status(500).json({
        success: false,
        message: 'Internal server error',
      });
    }
  },
};

async function hashPassword(password) {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    return hashedPassword;
}

module.exports = UserController;
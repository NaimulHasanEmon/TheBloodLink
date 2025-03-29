// User model schema definition for MongoDB
// This is a reference schema, not enforced by MongoDB directly
// but can be used for validation in application code

const userSchema = {
  name: { type: 'string', required: true },
  email: { type: 'string', required: true, unique: true },
  phone: { type: 'string' },
  photoURL: { type: 'string' },
  role: { type: 'string', default: 'user' }
};

// Helper function to validate a user object against the schema
const validateUser = (user) => {
  if (!user.name) return { valid: false, error: 'Name is required' };
  if (!user.email) return { valid: false, error: 'Email is required' };
  
  return { valid: true };
};

module.exports = {
  userSchema,
  validateUser
}; 
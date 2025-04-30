import JWT from 'jsonwebtoken';

// Middleware to check if the user is authenticated
export const Authentication = async (req, res, next) => {
  const authHeader = req.headers.authorization; // Get the Authorization header
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No token provided' });
  }

  const token = authHeader.split(' ')[1]; // Extract token from the 'Bearer <token>' format

  try {
    const decoded = JWT.verify(token, "TR24-PWRD-STRE"); // Verify the token with the secret
    req.user = decoded; // Attach the decoded user information to the request object
    next(); // Call the next middleware or route handler
  } catch (error) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};

const jwt = require('jsonwebtoken');

class JWTManager {
  constructor() {
    this.accessTokenSecret = process.env.JWT_SECRET;
    this.refreshTokenSecret = process.env.JWT_REFRESH_SECRET;
    this.accessTokenExpiry = process.env.JWT_EXPIRES_IN || '24h';
    this.refreshTokenExpiry = process.env.JWT_REFRESH_EXPIRES_IN || '7d';
  }

  /**
   * Generate access token
   */
  generateAccessToken(payload) {
    try {
      if (!this.accessTokenSecret) {
        throw new Error('JWT_SECRET not configured');
      }

      const token = jwt.sign(
        {
          ...payload,
          type: 'access',
          iat: Math.floor(Date.now() / 1000)
        },
        this.accessTokenSecret,
        { 
          expiresIn: this.accessTokenExpiry,
          issuer: 'saint-api',
          audience: 'saint-app'
        }
      );

      console.log('Access token generated', { userId: payload.userId, email: payload.email });
      return token;
    } catch (error) {
      console.error('Error generating access token:', error.message);
      throw new Error('Token generation failed');
    }
  }

  /**
   * Generate refresh token
   */
  generateRefreshToken(payload) {
    try {
      if (!this.refreshTokenSecret) {
        throw new Error('JWT_REFRESH_SECRET not configured');
      }

      const token = jwt.sign(
        {
          ...payload,
          type: 'refresh',
          iat: Math.floor(Date.now() / 1000)
        },
        this.refreshTokenSecret,
        { 
          expiresIn: this.refreshTokenExpiry,
          issuer: 'saint-api',
          audience: 'saint-app'
        }
      );

      console.log('Refresh token generated', { userId: payload.userId });
      return token;
    } catch (error) {
      console.error('Error generating refresh token:', error.message);
      throw new Error('Refresh token generation failed');
    }
  }

  /**
   * Verify access token
   */
  verifyAccessToken(token) {
    try {
      if (!token) {
        throw new Error('Token not provided');
      }

      const decoded = jwt.verify(token, this.accessTokenSecret, {
        issuer: 'saint-api',
        audience: 'saint-app'
      });

      if (decoded.type !== 'access') {
        throw new Error('Invalid token type');
      }

      console.log('Access token verified', { userId: decoded.userId });
      return decoded;
    } catch (error) {
      console.log('Access token verification failed:', error.message);
      
      if (error.name === 'TokenExpiredError') {
        throw new Error('Token expired');
      } else if (error.name === 'JsonWebTokenError') {
        throw new Error('Invalid token');
      } else {
        throw new Error('Token verification failed');
      }
    }
  }

  /**
   * Verify refresh token
   */
  verifyRefreshToken(token) {
    try {
      if (!token) {
        throw new Error('Refresh token not provided');
      }

      const decoded = jwt.verify(token, this.refreshTokenSecret, {
        issuer: 'saint-api',
        audience: 'saint-app'
      });

      if (decoded.type !== 'refresh') {
        throw new Error('Invalid token type');
      }

      console.log('Refresh token verified', { userId: decoded.userId });
      return decoded;
    } catch (error) {
      console.log('Refresh token verification failed:', error.message);
      
      if (error.name === 'TokenExpiredError') {
        throw new Error('Refresh token expired');
      } else if (error.name === 'JsonWebTokenError') {
        throw new Error('Invalid refresh token');
      } else {
        throw new Error('Refresh token verification failed');
      }
    }
  }

  /**
   * Get token info without verification (for expired tokens)
   */
  getTokenInfo(token) {
    try {
      const decoded = jwt.decode(token, { complete: true });
      
      if (!decoded) {
        return { valid: false, error: 'Invalid token format' };
      }

      const payload = decoded.payload;
      const header = decoded.header;

      return {
        valid: true,
        header,
        payload: {
          userId: payload.userId,
          email: payload.email,
          role: payload.role,
          type: payload.type,
          iat: payload.iat,
          exp: payload.exp,
          iss: payload.iss,
          aud: payload.aud
        },
        isExpired: payload.exp < Math.floor(Date.now() / 1000),
        expiresAt: new Date(payload.exp * 1000),
        issuedAt: new Date(payload.iat * 1000)
      };
    } catch (error) {
      console.log('Error getting token info:', error.message);
      return { valid: false, error: error.message };
    }
  }

  /**
   * Generate token pair (access + refresh)
   */
  generateTokenPair(payload) {
    try {
      const accessToken = this.generateAccessToken(payload);
      const refreshToken = this.generateRefreshToken(payload);

      return {
        accessToken,
        refreshToken,
        tokenType: 'Bearer',
        expiresIn: this.accessTokenExpiry
      };
    } catch (error) {
      console.error('Error generating token pair:', error.message);
      throw error;
    }
  }

  /**
   * Extract token from Authorization header
   */
  extractTokenFromHeader(authHeader) {
    if (!authHeader) {
      return null;
    }

    const parts = authHeader.split(' ');
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
      return null;
    }

    return parts[1];
  }
}

module.exports = new JWTManager();

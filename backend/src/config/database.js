const mongoose = require('mongoose');

class DatabaseConnection {
  constructor() {
    this.isConnected = false;
    this.connectionAttempts = 0;
    this.maxRetries = 5;
  }

  async connect() {
    try {
      if (this.isConnected) {
        console.log('Database already connected');
        return;
      }

      const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/saint_database';
      
      const options = {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        maxPoolSize: 10,
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000,
        family: 4
      };

      await mongoose.connect(mongoUri, options);
      this.isConnected = true;
      this.connectionAttempts = 0;
      
      console.log(`✅ Database connected successfully to: ${mongoUri}`);
      
      // Handle connection events
      mongoose.connection.on('error', (err) => {
        console.error('Database connection error:', err);
        this.isConnected = false;
      });

      mongoose.connection.on('disconnected', () => {
        console.warn('Database disconnected');
        this.isConnected = false;
      });

      mongoose.connection.on('reconnected', () => {
        console.log('Database reconnected');
        this.isConnected = true;
      });

    } catch (error) {
      this.connectionAttempts++;
      this.isConnected = false;
      
      console.error(`❌ Database connection failed (attempt ${this.connectionAttempts}):`, error.message);
      
      if (this.connectionAttempts < this.maxRetries) {
        console.log(`Retrying connection in 5 seconds... (${this.connectionAttempts}/${this.maxRetries})`);
        setTimeout(() => this.connect(), 5000);
      } else {
        console.error('Max connection attempts reached. Please check your database configuration.');
        throw error;
      }
    }
  }

  async disconnect() {
    try {
      if (!this.isConnected) {
        console.log('Database already disconnected');
        return;
      }

      await mongoose.disconnect();
      this.isConnected = false;
      console.log('✅ Database disconnected successfully');
    } catch (error) {
      console.error('❌ Error disconnecting from database:', error.message);
      throw error;
    }
  }

  getStatus() {
    return {
      connected: this.isConnected,
      readyState: mongoose.connection.readyState,
      host: mongoose.connection.host,
      port: mongoose.connection.port,
      name: mongoose.connection.name,
      connectionAttempts: this.connectionAttempts
    };
  }

  async testConnection() {
    try {
      if (!this.isConnected) {
        throw new Error('Database not connected');
      }

      // Simple ping test
      const admin = mongoose.connection.db.admin();
      const result = await admin.ping();
      
      console.log('Database ping test successful');
      return {
        success: true,
        ping: result,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('Database test failed:', error.message);
      return {
        success: false,
        error: error.message,
        timestamp: new Date().toISOString()
      };
    }
  }
}

// Create singleton instance
const dbConnection = new DatabaseConnection();

module.exports = dbConnection;

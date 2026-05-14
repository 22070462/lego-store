/**
 * Server Entry Point
 */

const app = require('./app');
const database = require('./config/database');
const { PORT, HOST, NODE_ENV } = require('./config/constants');
const initializeDatabase = require('./utils/init-database');

// Connect to database
database.connect();

// Initialize database schema and default data
initializeDatabase()
  .then(() => {
    // Start server
    const server = app.listen(PORT, () => {
      console.log('');
      console.log('╔════════════════════════════════════════════════════════╗');
      console.log('║                                                        ║');
      console.log('║              🎮 PLAYARENA SERVER STARTED 🎮            ║');
      console.log('║                                                        ║');
      console.log('╚════════════════════════════════════════════════════════╝');
      console.log('');
      console.log(`✓ Environment: ${NODE_ENV}`);
      console.log(`✓ Server running at: http://${HOST}:${PORT}`);
      console.log(`✓ API endpoint: http://${HOST}:${PORT}/api`);
      console.log(`✓ Health check: http://${HOST}:${PORT}/api/health`);
      console.log('');
      console.log('Press CTRL+C to stop the server');
      console.log('');
    });

    // Graceful shutdown
    process.on('SIGTERM', () => {
      console.log('SIGTERM signal received: closing HTTP server');
      server.close(() => {
        console.log('HTTP server closed');
        database.close().then(() => {
          process.exit(0);
        });
      });
    });

    process.on('SIGINT', () => {
      console.log('\nSIGINT signal received: closing HTTP server');
      server.close(() => {
        console.log('HTTP server closed');
        database.close().then(() => {
          process.exit(0);
        });
      });
    });
  })
  .catch((error) => {
    console.error('Failed to initialize database:', error);
    process.exit(1);
  });

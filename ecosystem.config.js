// PM2 process manager config — used on the AWS EC2 instance
// Start with: pm2 start ecosystem.config.js --env production
// Save process list: pm2 save
// Auto-start on reboot: pm2 startup

module.exports = {
  apps: [
    {
      name: 'kindmatch-api',
      script: './backend/server.js',
      cwd: '/home/ubuntu/kindmatch',   // absolute path — PM2 needs this in cluster mode
      instances: 'max',          // one worker per CPU core
      exec_mode: 'cluster',      // cluster mode for zero-downtime reloads
      env: {
        NODE_ENV: 'development',
        PORT: 5000,
      },
      env_production: {
        NODE_ENV: 'production',
        PORT: 5000,
      },
      // Auto-restart on crash
      autorestart: true,
      watch: false,              // never watch files in production
      max_memory_restart: '512M',
      // Logging
      out_file: '/var/log/kindmatch/out.log',
      error_file: '/var/log/kindmatch/error.log',
      merge_logs: true,
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      // Graceful shutdown — waits for in-flight requests before killing
      kill_timeout: 10000,
      wait_ready: false,
      listen_timeout: 10000,
    },
  ],
};

FROM node:lts-slim


# Install PM2 globally
RUN npm install -g pm2

WORKDIR /usr/src/app

COPY . .

RUN npm install

# Expose port
EXPOSE 3000

# Start the application with PM2
CMD ["pm2-runtime", "start", "server.js"]

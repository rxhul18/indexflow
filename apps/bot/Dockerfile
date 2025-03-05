FROM node:18-alpine 

# Install dependencies
RUN apk update && \
    apk add --no-cache libc6-compat
# Set working directory
WORKDIR /app
RUN yarn global add turbo

# Copy package files
COPY package.json yarn.lock ./
COPY apps/bot/package.json ./apps/bot/

# Install dependencies
RUN yarn install

# Copy source code
COPY . .

WORKDIR /app/apps/bot
# Start dev server
CMD ["yarn", "run", "dev"]
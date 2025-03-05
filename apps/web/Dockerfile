FROM node:18-alpine 

# Install dependencies
RUN apk update && \
    apk add --no-cache libc6-compat
# Set working directory
WORKDIR /app
RUN yarn global add turbo

# Copy package files
COPY package.json yarn.lock ./
COPY apps/web/package.json ./apps/web/

# Install dependencies
RUN yarn install

# Copy source code
COPY . .

# Expose port
EXPOSE 3000
WORKDIR /app/apps/web
# Start dev server
CMD ["yarn", "run", "dev"]
FROM node:20-bullseye

# Install Python, build tools, and Puppeteer dependencies
RUN apt-get update && apt-get install -y \
    python3 \
    python3-pip \
    python3-venv \
    build-essential \
    libnss3 \
    libxss1 \
    libasound2 \
    libatk-bridge2.0-0 \
    libgtk-3-0 \
    libgbm-dev \
    && rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Copy package files and install Node dependencies
COPY package.json package-lock.json ./
RUN npm ci

# Set up Python virtual environment and install Python dependencies
# We create a venv so pip doesn't complain about system-wide installs
ENV VIRTUAL_ENV=/opt/venv
RUN python3 -m venv $VIRTUAL_ENV
ENV PATH="$VIRTUAL_ENV/bin:$PATH"

# Install the Python libraries needed for your PDF tools
RUN pip install --no-cache-dir pandas pdfplumber PyMuPDF openpyxl pdfminer.six pdf2docx python-pptx

# Copy the rest of the application
COPY . .

# Build the Next.js application
# We pass build args or rely on environment variables being passed during build
RUN npm run build

# Expose the port Next.js runs on
EXPOSE 3000

# Start the application
CMD ["npm", "start"]

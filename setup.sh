#!/bin/bash

# Setup script for the Developer Buzz Campaign Proposal project

echo "Setting up the project..."

# Clone Cal.com repository
if [ ! -d "cal.com" ]; then
    echo "Cloning Cal.com repository..."
    git clone https://github.com/calcom/cal.com.git
    echo "Cal.com repository cloned successfully."
else
    echo "Cal.com repository already exists."
fi

echo "Setup complete!"

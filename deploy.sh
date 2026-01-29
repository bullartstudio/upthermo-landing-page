#!/bin/bash
# Enable access to home dir
chmod o+x /home/ubuntu
chmod o+x /home/ubuntu/upthermo-landing-page

# Create symlink in web root (assuming /var/www/html)
if [ -d "/var/www/html" ]; then
    ln -sf /home/ubuntu/upthermo-landing-page /var/www/html/upthermo-lp-prev
    echo "Symlink created in /var/www/html"
else
    echo "Web root not found or accessible"
    exit 1
fi

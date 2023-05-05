#!/bin/bash
sudo apt-get update
sudo apt-get install -y curl git vim build-essential pkg-config

# for building tauri project
sudo apt-get install -y \
    libgtk-3-dev \
    webkit2gtk-4.0 \
    libappindicator3-dev \
    librsvg2-dev \
    patchelf \
    libgtksourceview-3.0-dev \
    webkit2gtk-driver \
    xvfb \
    libssl-dev

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_16.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install Yarn
sudo npm install --global yarn

# Install Rust
curl https://sh.rustup.rs -sSf | sh -s -- -y
source "$HOME/.cargo/env"


# Install Tauri CLI
cargo install tauri-driver

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

# Install Docker
sudo apt-get install ca-certificates curl gnupg

sudo install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
sudo chmod a+r /etc/apt/keyrings/docker.gpg

echo \
  "deb [arch="$(dpkg --print-architecture)" signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
  "$(. /etc/os-release && echo "$VERSION_CODENAME")" stable" | \
  sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

sudo apt-get update
sudo apt-get install docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin


# Game Specific Dependencies
sudo apt-get install -y \
    openjdk-19-jre-headless \
    iperf3

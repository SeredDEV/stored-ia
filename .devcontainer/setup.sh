#!/bin/bash

# Instalar paquetes base
apt-get update
apt-get install -y git curl wget zsh

# Configurar bash con uv en PATH y prompt personalizado
cat >> ~/.bashrc << 'EOF'

# Add uv to PATH
export PATH="$HOME/.local/bin:$PATH"

# Prompt navideño personalizado con Git
parse_git_branch() {
    git branch 2> /dev/null | sed -e '/^[^*]/d' -e 's/* \(.*\)/ 🎄 \1/'
}
export PS1='🎅 \[\033[01;32m\]Dev\[\033[00m\] 🎁 \[\033[01;34m\]\W\[\033[01;31m\]$(parse_git_branch)\[\033[00m\] → '
EOF

# Instalar uv/uvx
curl -LsSf https://astral.sh/uv/install.sh | sh

# Cambiar shell por defecto a zsh
chsh -s $(which zsh)

echo "✅ Terminal configurada con éxito!"

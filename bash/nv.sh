LATEST_NODE_VERSION=$(nvm list available)
LATEST_NODE_VERSION=$(echo "${LATEST_NODE_VERSION}" | sed -n 4p)
LATEST_NODE_VERSION=$(echo "${LATEST_NODE_VERSION}" | cut -d '|' -f 2)
LATEST_NODE_VERSION=$(echo "${LATEST_NODE_VERSION}" | tr -d '[:space:]')
echo "s${LATEST_NODE_VERSION}e"
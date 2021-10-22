#!/usr/bin/env bash

# Run the command `chmod +x ./install-hooks.bash` in the scripts directory

HOOK_DIR=git-hooks
GIT_DIR=$(git rev-parse --git-dir)

chmod +x pre-commit.py commit-msg.py pre-push.py

echo "Installing hooks..."
git config --local commit.template $HOOK_DIR/commit_template.txt
# symlinks to the hook scripts
ln -sf $GIT_DIR/../$HOOK_DIR/pre-commit.py $GIT_DIR/hooks/pre-commit
ln -sf $GIT_DIR/../$HOOK_DIR/commit-msg.py $GIT_DIR/hooks/commit-msg
ln -sf $GIT_DIR/../$HOOK_DIR/pre-push.py $GIT_DIR/hooks/pre-push
echo "Done!"

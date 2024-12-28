#!/usr/bin/env bash

cd ..

# Get the newest astal-gjs path from the nix store
new_astal_path=$(ls -d /nix/store/*-astal-gjs | sort -V | tail -n 1)

# Check if the path exists, exit if it doesn't
if [ -z "$new_astal_path" ]; then
    echo "Error: No astal-gjs path found in the nix store."
    exit 1
fi

# Ensure subfolders `share/astal/gjs` exist
expected_subfolder="$new_astal_path/share/astal/gjs"
if [ ! -d "$expected_subfolder" ]; then
    echo "Error: Subfolder $expected_subfolder does not exist."
    exit 1
fi

# Remove the current astal link in the main folder and replace it with the new link
if [ -L astal ]; then
    rm astal
fi

ln -s "$expected_subfolder" astal
echo "Updated astal symlink to $expected_subfolder."

# Update paths in tsconfig.json
tsconfig_file="tsconfig.json"

if [ ! -f "$tsconfig_file" ]; then
    echo "Error: $tsconfig_file not found."
    exit 1
fi

# Use `sed` to replace the paths in tsconfig.json
sed -i \
    -e "s|\"jsxImportSource\": \".*\"|\"jsxImportSource\": \"$expected_subfolder/gtk3\"|" \
    -e "s|\"astal\": \[\".*\"\]|\"astal\": [\"$expected_subfolder\"]|" \
    -e "s|\"astal/\*\": \[\".*\"\]|\"astal/*\": [\"$expected_subfolder/*\"]|" \
    "$tsconfig_file"

echo "Updated tsconfig.json with the new astal-gjs path: $expected_subfolder."
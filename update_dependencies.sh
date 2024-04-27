#!/bin/bash

# Define the path to your project
PROJECT_DIR="./"

# Change to the project directory
cd "$PROJECT_DIR"

# Fetch outdated packages and format the output using awk
npm outdated --json | awk -F'[:,]' '
  /"latest"/ {
    getline; # This gets the line with the version number
    gsub(/[^0-9a-zA-Z\.-]/, "", $2); # Clean up the version string
    print depName "@" $2; # Print the dependency@version
  }
  /"current"/ {
    getline; # Move to the next line to get the dependency name
    gsub(/"|:|,/, "", $2); # Clean up the package name
    depName = $2; # Store the package name
  }
' | while read package; do
    npm install "$package" --save
done

# Optionally, handle version control
git add package.json package-lock.json
git commit -m "update: node package dependencies"
git push

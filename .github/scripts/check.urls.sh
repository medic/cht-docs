#!/bin/bash

# Function to get HTTP response code of a URL
get_response_code() {
    local url=$1
    local response_code=$(curl -s -o /dev/null -w "%{http_code}" "$url")
    echo "$response_code"
}

# Function to check for meta refresh tag in HTML content
check_meta_refresh() {
    local html_content=$1
    url=$2
    if grep -q '<meta http-equiv="refresh"' <<< "$html_content"; then
        local redirect_url=$(grep -oP 'url=[^"]+' <<< "$html_content" | cut -d'=' -f2)
        local redirect_response_code=$(get_response_code "$redirect_url")
        echo "${url} Is redirected! Result is:"
        echo "    -> $redirect_url $redirect_response_code "
    fi
}

run_checks(){
  # Loop through each URL in the file
  while IFS= read -r url; do
      # Get HTTP response code, if it's not 200, print it so they know
      response_code=$(get_response_code "$url")
      if [ "$response_code" -ne 200 ]; then
          echo "$url $response_code"
      fi

      # If response code is 200, check for meta refresh tag
      if [ "$response_code" -eq 200 ]; then
          html_content=$(curl -s "$url")
          check_meta_refresh "$html_content" "$url"
      fi
  done < urls.txt
}

echo;echo "Are you on test branch running hugo on http://localhost:1313 and already run get.urls.sh?";echo
read -p "\"y\" to proceed, \"n\" to cancel " -n 1 -r
echo    # (optional) move to a new line
if [[ ! $REPLY =~ ^[nN]$ ]]
then
  run_checks
  echo;echo "Done!";echo
fi


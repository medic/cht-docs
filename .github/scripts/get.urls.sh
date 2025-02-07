#!/bin/bash

# Function to crawl URLs recursively
function crawl_urls {
    local base_url="$1"
    local path="$2"
    local url="$base_url$path"
    local visited_urls=("${@:3}")

    # Check if the URL has already been visited
    if [[ " ${visited_urls[@]} " =~ " $url " ]]; then
        return
    fi

    # Add the current URL to the visited list
    visited_urls+=("$url")

    # Fetch the HTML content of the URL and suppress all output
    html_content=$(wget -qO- "$url" 2>/dev/null)
    wget_exit_status=$?

    # Check if wget command was successful
    if [ $wget_exit_status -ne 0 ]; then
        return
    fi

    # Extract all anchor tags and their href attributes
    local links=$(echo "$html_content" | grep -oE '<a [^>]+>' | grep -oE 'href="([^"#]+)"' | sed -e 's/^href="//' -e 's/"$//')

    # Output each URL found under the current URL
    for link in $links; do
        # Construct absolute URL if the link is relative
        if [[ $link == /* ]]; then
            link="$base_url$link"
        fi

        # Check if the URL is under the specified path and has not been visited before
        if [[ $link == "$base_url$path/"* && ! " ${visited_urls[@]} " =~ " $link " ]]; then
            echo "$link"
            # Recursively crawl the URL
            crawl_urls "$base_url" "$path" "$link" "${visited_urls[@]}"
        fi
    done
}

echo;echo "Are you on 'main' branch and running hugo on http://localhost:1313?";echo
read -p "\"y\" to proceed, \"n\" to cancel " -n 1 -r
echo    # (optional) move to a new line
if [[ ! $REPLY =~ ^[nN]$ ]]
then
  # Start crawling from the base URL with the specified path
  base_url="http://localhost:1313"
  path=""
  declare -a visited_urls=()
  crawl_urls "$base_url" "$path" "${visited_urls[@]}" | sort -u > urls.txt
  count=$(wc -l urls.txt)
  echo "Saved $count URLs in urls.txt"
fi



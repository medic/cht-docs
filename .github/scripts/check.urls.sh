#!/bin/bash

# Function to get HTTP response code of a URL
get_response_code() {
    local response_code
    local url=$1
    response_code=$(curl -s -o /dev/null -w "%{http_code}" "$url")
    echo "$response_code"
}

# Function to check for meta refresh tag in HTML content
check_meta_refresh() {
    local html_content=$1
    url=$2
    if grep -q '<meta http-equiv="refresh"' <<< "$html_content"; then
        local redirect_url
        local redirect_response_code
        redirect_url=$(grep -oP 'url=[^"]+' <<< "$html_content" | cut -d'=' -f2)
        redirect_response_code=$(get_response_code "$redirect_url")
        echo "${url} Is redirected! Result is:"
        echo "    -> $redirect_url $redirect_response_code "
    fi
}

run_checks(){
    echo
    prod_urls=$1
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
    done <<< "$prod_urls"
}

get_urls_from_prod_site_map(){
    local urls
    # thanks https://aruljohn.com/blog/download-extract-urls-sitemaps/
    urls=$(curl -qs https://docs.communityhealthtoolkit.org/sitemap.xml  2>&1 | grep -o "<loc>[^<]*" | sed -e 's/<[^>]*>//g')
    urls="${urls//https:\/\/docs.communityhealthtoolkit.org/http:\/\/localhost:1313}"
    echo "$urls"
}

echo;echo "Are you on a test branch and is hugo running on http://localhost:1313 ?";echo
read -p "\"y\" to proceed, \"n\" to cancel " -n 1 -r
echo    # (optional) move to a new line
if [[ ! $REPLY =~ ^[nN]$ ]]
then
    echo;echo "Fetching URLs from production."
    prod_urls=$(get_urls_from_prod_site_map)
    url_count=$(echo "$prod_urls" | wc -l | cut -d' ' -f1)
    echo;echo "Checking ${url_count} URLs, be patient.  Any non 200 URLs will be listed here:"
    run_checks "$prod_urls"
    echo "Successfully checked ${url_count} URLs!"
fi

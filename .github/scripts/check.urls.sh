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
    local url=$2
    if grep -q '<meta http-equiv="refresh"' <<< "$html_content"; then
        local redirect_url
        local redirect_response_code
        redirect_url=$(echo "$html_content" | sed -n 's/.*url=\([^"]*\).*/\1/p')
        redirect_response_code=$(get_response_code "$redirect_url")
        redirects+=("${url} Is redirected! Result is:")
        redirects+=("    -> $redirect_url $redirect_response_code")
    fi
}


run_checks(){
    echo
    prod_urls=$1
    local count=0
    local redirects=()
    local not_found=()
    local other_errors=()

    echo "Checking URLs, please wait..."

    # Loop through each URL in the file and collect results
    while IFS= read -r url; do
        [ -z "$url" ] && continue
        ((count++))

        # Show progress every 10 URLs
        if [ $((count % 10)) -eq 0 ]; then
            echo "Checked: $count URLs..."
        fi

        # Get HTTP response code
        response_code=$(get_response_code "$url")

        if [ "$response_code" -eq 200 ]; then
            # Check for meta refresh tag (redirects)
            html_content=$(curl -s "$url")
            check_meta_refresh "$html_content" "$url"
        elif [ "$response_code" -eq 404 ]; then
            not_found+=("$url $response_code")
        elif [ "$response_code" -ne 200 ]; then
            other_errors+=("$url $response_code")
        fi

    done <<< "$prod_urls"

    echo "Finished checking $count URLs."
    echo

    # Output results in desired order
    if [ ${#redirects[@]} -gt 0 ]; then
        echo "=== REDIRECTS (200 with meta refresh) ==="
        for redirect in "${redirects[@]}"; do
            echo "$redirect"
        done
        echo
    fi

    if [ ${#other_errors[@]} -gt 0 ]; then
        echo "=== OTHER ERRORS ==="
        for error in "${other_errors[@]}"; do
            echo "$error"
        done
        echo
    fi

    if [ ${#not_found[@]} -gt 0 ]; then
        echo "=== 404 NOT FOUND ==="
        for nf in "${not_found[@]}"; do
            echo "$nf"
        done
        echo
    fi

    # Summary
    redirect_count=${#redirects[@]}
    # Divide by 2 since each redirect has 2 lines
    redirect_count=$((redirect_count / 2))
    other_error_count=${#other_errors[@]}
    not_found_count=${#not_found[@]}

    echo "=== SUMMARY ==="
    echo "Total URLs checked: $count"
    echo "Redirects (200): $redirect_count"
    echo "Other errors: $other_error_count"
    echo "404 Not Found: $not_found_count"
}

get_urls_from_prod_site_map(){
    local urls
    # thanks https://aruljohn.com/blog/download-extract-urls-sitemaps/
    urls=$(curl -qs https://docs.communityhealthtoolkit.org/sitemap.xml  2>&1 | grep -o "<loc>[^<]*" | sed -e 's/<[^>]*>//g')
    urls=$(echo "$urls" | sed 's|https://docs.communityhealthtoolkit.org|http://localhost:1313|g')
    echo "$urls"
}

echo;echo "Are you on a test branch and you deleted your "'./public'" folder before running hugo on http://localhost:1313 ?";echo
read -p "\"y\" to proceed, \"n\" to cancel " -n 1 -r
echo    # (optional) move to a new line
if [[ ! $REPLY =~ ^[nN]$ ]]
then
#    clear_cache
    echo;echo "Fetching URLs from production."
    prod_urls=$(get_urls_from_prod_site_map)
    url_count=$(echo "$prod_urls" | tr -cd '\n' | wc -l | tr -d ' ')
    echo "Found ${url_count} URLs to check, be patient."
    run_checks "$prod_urls"
    echo;echo "Successfully checked ${url_count} URLs!";echo;
fi

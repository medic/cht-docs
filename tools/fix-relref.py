import os
import re

# Set to True if you want to see all the files the program goes through in case it is not changing some file/
DEBUG_SHOW_NON_MATCHING_PROCESSING = False

# Pattern example: [hierarchy]({{< relref "building/workflows/hierarchy" >}})
pattern = re.compile(r'(\[[^\]]*\])\(\{\{<\s*relref\s*"([^"]+)"\s*>\}\}\)') 

def process_markdown_file(filepath):
    if (DEBUG_SHOW_NON_MATCHING_PROCESSING):
        print(f"\n🔍 Processing: {filepath}")
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
    except Exception as e:
        print(f"❌ Error reading file {filepath}: {e}")
        return

    # To skip writing unmodified files to save time, using 'modified' variable as a flag
    modified = False

    def replacer(match):
        nonlocal modified
        old_link = match.group(0) 
        label = match.group(1)        # [hierarchy]
        rel_path = match.group(2)     # building/workflows/hierarchy
        new_link = f"{label}(/" + rel_path + ")"
        print(f"  ✅ Found: {old_link}")
        print(f"  🔁 Replacing with: {new_link}")
        modified = True
        return new_link

    # substitutues multiple instances of the matches with a new link, in this case the output of replacer function.
    new_content = pattern.sub(replacer, content)

    if modified:
        if not (DEBUG_SHOW_NON_MATCHING_PROCESSING):
            print("\n--------------------------------------------")
            print(f"\n🔍 Processsed: {filepath}")
        try:
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(new_content)
            print(f"💾 File updated: {filepath}")
        except Exception as e:
            print(f"❌ Error writing file {filepath}: {e}")
    else:
        if (DEBUG_SHOW_NON_MATCHING_PROCESSING):
            print("ℹ️ No matches found. File left unchanged.")

def main():
    print("Starting markdown relref replacement...\n")
    # ❗REQUIRES THIS VALUE TO BE CHANGED IF THE SCRIPTS FILE IS MOVED
    for root, dirs, files in os.walk("../"):
        for file in files:
            if file.endswith(".md"):
                filepath = os.path.join(root, file)
                process_markdown_file(filepath)
    print("\n✅ Done.")

if __name__ == "__main__":
    main()
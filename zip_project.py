import os
import zipfile

IGNORED_DIRS = {'node_modules', '.next', '.git', '__pycache__', '.idea', '.vscode'}
IGNORED_FILES = {'.DS_Store', 'desktop.ini', 'npm-debug.log', 'yarn-error.log', 'launchmate.zip', 'launchmate_backup.zip'}

def zip_directory(path, zip_file):
    for root, dirs, files in os.walk(path):
        dirs[:] = [d for d in dirs if d not in IGNORED_DIRS]
        for file in files:
            if file in IGNORED_FILES or file.endswith('.zip') or file.endswith('.py'):
                continue
            file_path = os.path.join(root, file)
            arcname = os.path.relpath(file_path, path)
            zip_file.write(file_path, arcname)

if __name__ == "__main__":
    zip_filename = "launchmate_source_code.zip"
    with zipfile.ZipFile(zip_filename, 'w', zipfile.ZIP_DEFLATED) as zipf:
        zip_directory('.', zipf)
    print(f"Created {zip_filename} successfully.")

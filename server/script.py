import os

def create_project_structure(base_path):
    """
    Create the folder and file structure for the project.
    
    Args:
        base_path (str): The path where the structure will be created.
    """
    structure = [
        "/src/controllers",
        "/src/models",
        "/src/routes",
        "/src/middlewares",
        "/src/utils",
        "/config",
        "/tests"
    ]
    
    # Create folders
    for folder in structure:
        folder_path = os.path.join(base_path, folder[1:])
        os.makedirs(folder_path, exist_ok=True)
    
    # Create files
    files = [
        ".env",
        ".gitignore",
        "README.md"
    ]
    
    for file in files:
        file_path = os.path.join(base_path, file)
        with open(file_path, "w") as f:
            f.write("")  # Create an empty file

if __name__ == "__main__":
    base_directory = os.getcwd()  # Change this to a specific path if needed
    create_project_structure(base_directory)
    print(f"Project structure created in: {base_directory}")
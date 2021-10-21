"""Script used to validate commit messages."""

from os import system
import sys
import importlib
hook = importlib.import_module("commit-msg")


def main():
    """Validates that every commit follows the commit message convention."""
    system("git log --pretty=\"%s\" > commits.txt")
    with open("commits.txt", "r") as file:
        lines = file.readlines()
        for line in lines:
            hook.follows_convention(line)
    file.close()
    sys.exit(0)


if __name__ == "__main__":
    main()

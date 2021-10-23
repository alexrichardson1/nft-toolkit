#!/usr/bin/python3
# pylint: disable=C0103
"""
pre-push hook is used to validate what is about to be pushed
"""

import sys
from glob import glob
from colorama import Fore, Style
from util import exit_failure


def count_disabled_comments(file):
    """Checks how many warnings disabled in a file"""
    counter = 0
    DISABLE_LINTER_COMMENT = "eslint-disable"
    with open(file, "r") as f:
        lines = f.readlines()
        for line in lines:
            line_startswith = line.startswith
            if (line_startswith("//") or line_startswith("/*")
                ) and DISABLE_LINTER_COMMENT in line:
                counter += 1
    f.close()
    return counter


def check_disable_linter():
    """Counts the number of linter disabled comments in a project"""
    print("--- Checking for linter disabled comments ---")
    files = glob("client/src/**/*.js", recursive=True)
    files = glob("client/src/**/*.ts", recursive=True)
    files += glob("client/src/**/*.tsx", recursive=True)
    files += glob("server/src/**/*.js", recursive=True)
    files += glob("server/src/**/*.ts", recursive=True)
    counter = 0
    for file in files:
        counter += count_disabled_comments(file)
    MAX_DISABLES = 1
    if counter > MAX_DISABLES:
        exit_failure(
            f"too many linter disable comments (+{counter - MAX_DISABLES})")


def main():
    """Main function for the pre-push hook."""
    print("--- Running pre-push hook ---")
    check_disable_linter()
    print(
        Fore.GREEN +
        Style.BRIGHT +
        "pre-push hook finished successfully." +
        Style.RESET_ALL)
    print("-----------------------------")
    sys.exit(0)


if __name__ == "__main__":
    main()

#!/usr/bin/python3
# pylint: disable=C0103
"""
pre-push hook is used to validate what is about to be pushed
"""

import sys
from glob import glob
from colorama import Fore, Style
from util import exit_failure


def count_disabled_comments(file, DISABLE_LINTER_COMMENT):
    """Checks how many warnings disabled in a file"""
    counter = 0
    with open(file, "r") as f:
        lines = f.readlines()
        for line in lines:
            if DISABLE_LINTER_COMMENT in line:
                counter += 1
    f.close()
    return counter


def check_disable_linter(
        files, MAX_DISABLES, DISABLE_LINTER_COMMENT):
    """Counts the number of linter disabled comments in a project"""
    counter = 0
    for file in files:
        counter += count_disabled_comments(file, DISABLE_LINTER_COMMENT)
    if counter > MAX_DISABLES:
        exit_failure(
            f"too many linter disable comments (+{counter - MAX_DISABLES})")


def remove_typechain(files):
    """Removes typechain files from the files list"""
    result = []
    for f in files:
        if "typechain" not in f:
            result.append(f)
    return result


def eslint_disabled():
    """Counts the number of eslint disabled comments in a project"""
    files = glob("client/src/**/*.js", recursive=True)
    files = glob("client/src/**/*.ts", recursive=True)
    files += glob("client/src/**/*.tsx", recursive=True)
    files += glob("server/src/**/*.js", recursive=True)
    files += glob("server/src/**/*.ts", recursive=True)
    check_disable_linter(remove_typechain(files), 1, "eslint-disable")


def pylint_disabled():
    """Counts the number of pylint disabled comments in a project"""
    files = glob("ml/**/*.py", recursive=True)
    check_disable_linter(files, 1, "pylint: disable")


def main():
    """Main function for the pre-push hook."""
    print("--- Running pre-push hook ---")
    print("--- Checking for linter disabled comments ---")
    eslint_disabled()
    pylint_disabled()
    print(
        Fore.GREEN +
        Style.BRIGHT +
        "pre-push hook finished successfully." +
        Style.RESET_ALL)
    print("-----------------------------")
    sys.exit(0)


if __name__ == "__main__":
    main()

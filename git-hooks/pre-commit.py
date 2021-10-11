#!/usr/bin/python3
# pylint: disable=C0103
"""
pre-commit hook is used to inspect the snapshot that’s about to be committed
"""

import sys
import os
import subprocess
from colorama import Fore, Back, Style


def exit_failure(error_message):
    """Exits non-zero with error message."""
    print(
        Fore.RED +
        Style.BRIGHT +
        "fatal: " +
        error_message +
        Style.RESET_ALL)
    print("-------------------------------")
    sys.exit(1)


def run_formatter(file, formatter):
    """Format and stage file."""
    print("Formatting file: " + Back.BLACK + file + Style.RESET_ALL)
    os.system(formatter + file)
    os.system("git add " + file)


def format_files(staged_files, file_extension, formatter):
    """Format `staged_files` with the extension `file_extension` using the command `formatter`."""
    for file in staged_files:
        if file.endswith(file_extension):
            run_formatter(file, formatter)


def format_python(files):
    """Formats python files."""
    format_files(files, ".py", "autopep8 -i ")


def format_node(files):
    """Formats node related files."""
    format_files(files, ".js", "yarn format ")
    format_files(files, ".ts", "yarn format ")
    format_files(files, ".tsx", "yarn format ")
    format_files(files, ".json", "yarn format ")
    format_files(files, ".html", "yarn format ")
    format_files(files, ".css", "yarn format ")


def run_linter(file, linter):
    """Lint `file` using the command `linter`."""
    print("Linting file: " + Back.BLACK + file + Style.RESET_ALL)
    if os.WEXITSTATUS(os.system(linter + file)) != 0:
        exit_failure("linting failed")


def lint_files(staged_files, file_extension, linter):
    """Lint `staged_files` with the extension `file_extension` using the command `linter`."""
    for file in staged_files:
        if file.endswith(file_extension):
            run_linter(file, linter)


def lint_python(files):
    """Lint python files."""
    lint_files(files, ".py", "pylint ")


def eslint(files):
    """Lint javascript/typescript files."""
    lint_files(files, ".js", "yarn tslint ")
    lint_files(files, ".ts", "yarn tslint ")
    lint_files(files, ".tsx", "yarn tslint ")


def main():
    """Main function for the pre-commit hook."""
    print("--- Running pre-commit hook ---")
    files = subprocess.check_output(
        "git diff --name-only --staged",
        shell=True,
        universal_newlines=True)
    staged_files = files.split("\n")
    files = subprocess.check_output(
        "git diff --name-only --diff-filter=D",
        shell=True,
        universal_newlines=True)
    deleted_filles = files.split("\n")
    staged_files = [
        file for file in staged_files if file not in deleted_filles]
    # add format functions here
    format_functions = [format_python, format_node]
    for format_function in format_functions:
        format_function(staged_files)
    # add lint functions here
    lint_functions = [lint_python, eslint]
    for lint_function in lint_functions:
        lint_function(staged_files)
    print(Fore.GREEN + Style.BRIGHT +
          "pre-commit hook finished successfully." + Style.RESET_ALL)
    print("-------------------------------")
    sys.exit(0)


if __name__ == "__main__":
    main()

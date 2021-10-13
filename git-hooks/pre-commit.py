#!/usr/bin/python3
# pylint: disable=C0103
# pylint: disable=R1729
"""
pre-commit hook is used to inspect the snapshot that’s about to be committed
"""

import sys
import os
import subprocess
from colorama import Fore, Back, Style
from util import exit_failure


def run_formatter(files, formatter):
    """Format and stage files."""
    files_list = [f for f in files.split(" ") if f != ""]
    for file in files_list:
        print("Formatting file: " + Back.BLACK + file + Style.RESET_ALL)
    if os.WEXITSTATUS(os.system(formatter + files)) != 0:
        exit_failure("formatting failed")
    os.system("git add " + files)


def format_files(staged_files, file_extensions, formatter):
    """Format `staged_files` with the extension `file_extension` using the command `formatter`."""
    files = ""
    for file in staged_files:
        if any([file.endswith(file_extension)
                for file_extension in file_extensions]):
            files += f"{file} "
    if files != "":
        run_formatter(files, formatter)


def format_python(files):
    """Formats python files"""
    format_files(files, [".py"], "autopep8 -i ")


def format_node(files):
    """Formats node related files."""
    format_files(files, [".js", ".ts", ".tsx", ".json",
                         ".html", ".css", ".yml", ".md"], "yarn format ")


def run_linter(files, linter):
    """Lint `file` using the command `linter`."""
    files_list = [f for f in files.split(" ") if f != ""]
    for file in files_list:
        print("Linting file: " + Back.BLACK + file + Style.RESET_ALL)
    if os.WEXITSTATUS(os.system(linter + files)) != 0:
        exit_failure("linting failed")


def lint_files(staged_files, file_extensions, linter):
    """Lint `staged_files` with the extension `file_extension` using the command `linter`."""
    files = ""
    for file in staged_files:
        if any([file.endswith(file_extension)
                for file_extension in file_extensions]):
            files += f"{file} "
    if files != "":
        run_linter(files, linter)


def lint_python(files):
    """Lint python files."""
    lint_files(files, [".py"], "pylint ")


def eslint(files):
    """Lint javascript/typescript files."""
    lint_files(files, [".js", ".ts", ".tsx"], "yarn tslint --max-warnings 0 ")


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

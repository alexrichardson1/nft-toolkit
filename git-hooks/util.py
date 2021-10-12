"""
Utility functions.
"""

import sys
from colorama import Fore, Style


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

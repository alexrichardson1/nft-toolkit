"""
Script to find best model
"""

import math


def get_distance(df1, df2):
    """
    Calculate Euclideun distance ^2 between to dataframes
    """
    return math.pow(df1[0][0] - df2[0], 2) + math.pow(df1[0][1] - df2[1], 2)

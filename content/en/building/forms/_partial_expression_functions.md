---
title: "Expression Functions"
sidebar:
  exclude: true
hide_summary: true
---

The following functions are available for use in JavaScript expressions:

| Signature                                                                    | Description                                                                                                                                                                                                                                                                |
|------------------------------------------------------------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `ageInDays(contact)`                                                         | Returns the current age of the given contact in days.                                                                                                                                                                                                                      |
| `ageInMonth(contact)`                                                        | Returns the current age of the given contact in months.                                                                                                                                                                                                                    |
| `ageInYears(contact)`                                                        | Returns the current age of the given contact in years.                                                                                                                                                                                                                     |
| `levenshteinEq(string0, string1, threshold = 3)`                             | _(Added `4.19.0`)_ Returns `true` if the [Levenshtein distance](https://en.wikipedia.org/wiki/Levenshtein_distance) between the given strings is less than or equal to the given threshold. Otherwise `false`.                                                             |
| `normalizedLevenshteinEq(string0, string1, threshold = 0.42857142857142855)` | _(Added `4.19.0`)_ Similar to the `levenshteinEq` function except the distance value is "normalized" (by dividing by the length of the longest string) before comparing to the threshold. [See below](#normalized-levenshtein-equality) for more details. |

#### Normalized Levenshtein Equality

In cases where the length of the input strings can vary greatly, the `normalizedLevenshteinEq` function can be preferable to the `levenshteinEq` function. The `normalizedLevenshteinEq` function divides the Levenshtein distance by the length of the longest string before comparing the result to the threshold. In effect, this makes the matching more strict for shorter strings (the actual distance must be shorter for them to be considered equal) and more lenient for longer strings (the actual distance can be longer, but the strings will still be considered equal).

This can help make the same threshold limit value appropriate for use across a greater variety of string lengths. For example, if the threshold is set to `0.3`, then an actual distance of `2` would be considered equal (when using `normalizedLevenshteinEq`) for strings of length `9`, but not for two strings of length `5`. (Because `(2 / 9 = 0.2222) <= 0.3` and `(2 / 5 = 0.4) > 0.3`.)

When using normalized Levenshtein equality, make sure you consider the behavior of a particular threshold value at the edges of your expected string length range. For example, the distance between `far` and `car` is `1`. If you want your logic to consider `john` and `jon` as equal, you will need to use a normalized Levenshtein equality threshold of at least `1 / 4 = 0.25`.  However, for strings with a length of `25`, that threshold will allow a distance of `5` to be considered equal.

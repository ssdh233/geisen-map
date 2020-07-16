import { NormalizedAddress } from "../models/gameCenter";

export default function normalizeGameCenterName(rawName: string, address: NormalizedAddress): string {
  let name = rawName;
  // fullWidth to halfWidth
  name = name.replace(/[Ａ-Ｚａ-ｚ０-９]/g, function (s) {
    return String.fromCharCode(s.charCodeAt(0) - 65248);
  });

  // remove redundant character 
  name = name.replace(/･/g, "");

  // katakana to roma
  name = name.replace("ビックバン", "bigbang");
  name = name.replace("ビッグバン", "bigbang");
  name = name.replace("ギャラクシーゲート", "galaxygate");
  name = name.replace("マキシムヒーロー", "maximhero");
  name = name.toLowerCase();

  // remove general term
  name = name.replace(/店|ゲーム|アミュージアム|アミューズメント/g, "");

  // // TODO: get closest station name from somewhere
  // name = stripCommonSubstring(name, address.region);
  // name = stripCommonSubstring(name, address.town);

  // console.log("normalizeGameCenterName", rawName, name);
  return name;
}

export function stripCommonSubstring(strA: string, strB: string) {
  let result = strA;
  let commonSubstring = longestCommonSubstring(result, strB);
  while (commonSubstring.length > 1) {
    console.log({ result, commonSubstring });
    result = result.replace(commonSubstring, "");
    commonSubstring = longestCommonSubstring(result, strB);
  }

  return result;
}

/**
 * @param {string} string1
 * @param {string} string2
 * @return {string}
 * https://github.com/trekhleb/javascript-algorithms/tree/master/src/algorithms/string/longest-common-substring
 */
export function longestCommonSubstring(string1: string, string2: string): string {
  // Convert strings to arrays to treat unicode symbols length correctly.
  // For example:
  // '𐌵'.length === 2
  // [...'𐌵'].length === 1
  const s1 = string1.split("");
  const s2 = string2.split("");

  // Init the matrix of all substring lengths to use Dynamic Programming approach.
  const substringMatrix = Array(s2.length + 1).fill(null).map(() => {
    return Array(s1.length + 1).fill(null);
  });

  // Fill the first row and first column with zeros to provide initial values.
  for (let columnIndex = 0; columnIndex <= s1.length; columnIndex += 1) {
    substringMatrix[0][columnIndex] = 0;
  }

  for (let rowIndex = 0; rowIndex <= s2.length; rowIndex += 1) {
    substringMatrix[rowIndex][0] = 0;
  }

  // Build the matrix of all substring lengths to use Dynamic Programming approach.
  let longestSubstringLength = 0;
  let longestSubstringColumn = 0;
  let longestSubstringRow = 0;

  for (let rowIndex = 1; rowIndex <= s2.length; rowIndex += 1) {
    for (let columnIndex = 1; columnIndex <= s1.length; columnIndex += 1) {
      if (s1[columnIndex - 1] === s2[rowIndex - 1]) {
        substringMatrix[rowIndex][columnIndex] = substringMatrix[rowIndex - 1][columnIndex - 1] + 1;
      } else {
        substringMatrix[rowIndex][columnIndex] = 0;
      }

      // Try to find the biggest length of all common substring lengths
      // and to memorize its last character position (indices)
      if (substringMatrix[rowIndex][columnIndex] > longestSubstringLength) {
        longestSubstringLength = substringMatrix[rowIndex][columnIndex];
        longestSubstringColumn = columnIndex;
        longestSubstringRow = rowIndex;
      }
    }
  }

  if (longestSubstringLength === 0) {
    // Longest common substring has not been found.
    return '';
  }

  // Detect the longest substring from the matrix.
  let longestSubstring = '';

  while (substringMatrix[longestSubstringRow][longestSubstringColumn] > 0) {
    longestSubstring = s1[longestSubstringColumn - 1] + longestSubstring;
    longestSubstringRow -= 1;
    longestSubstringColumn -= 1;
  }

  return longestSubstring;
}
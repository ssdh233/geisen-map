import { stripCommonSubstring, longestCommonSubstring } from "../gameCenterName";

describe("stripCommonSubstring", () => {
  it("should remove common substring from first string", () => {
    expect(stripCommonSubstring(
      "名古屋レジャーランドささしま店", "愛知県名古屋市中村区平池町"
    )).toBe('レジャーランドささしま店');
  })

  it("should remove common substring from first string", () => {
    expect(stripCommonSubstring(
      "愛知県ViViD蟹江", "愛知県海部郡蟹江町桜1-212"
    )).toBe('ViViD');
  })
});

describe('longestCommonSubstring', () => {
  it('should find longest common substring between two strings', () => {
    expect(longestCommonSubstring('', '')).toBe('');
    expect(longestCommonSubstring('ABC', '')).toBe('');
    expect(longestCommonSubstring('', 'ABC')).toBe('');
    expect(longestCommonSubstring('ABABC', 'BABCA')).toBe('BABC');
    expect(longestCommonSubstring('BABCA', 'ABCBA')).toBe('ABC');
    expect(longestCommonSubstring(
      'Algorithms and data structures implemented in JavaScript',
      'Here you may find Algorithms and data structures that are implemented in JavaScript',
    )).toBe('Algorithms and data structures ');
  });

  it('should handle japanese correctly', () => {
    expect(longestCommonSubstring(
      "名古屋レジャーランドささしま店", "愛知県名古屋市中村区平池町"
    )).toBe('名古屋');
    expect(longestCommonSubstring(
      "ViViD蟹江", "愛知県海部郡蟹江町桜1-212"
    )).toBe('蟹江');
  });
});
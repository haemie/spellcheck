export function calculateDiff(str1: string, str2: string) {
  const m = str1.length;
  const n = str2.length;

  // Initialize two arrays to represent the matrix rows
  let prevRow = new Array(n + 1).fill(0);
  let currRow = new Array(n + 1).fill(0);

  // Initialize the first row with consecutive numbers
  for (let j = 0; j <= n; j++) {
    prevRow[j] = j;
  }

  // Dynamic programming to fill the matrix
  for (let i = 1; i <= m; i++) {
    currRow[0] = i;

    for (let j = 1; j <= n; j++) {
      // Check if characters at the current positions are equal
      if (str1[i - 1] === str2[j - 1]) {
        currRow[j] = prevRow[j - 1]; // No operation required
      } else {
        // Choose the minimum of three possible operations (insert, remove, replace)
        currRow[j] =
          1 +
          Math.min(
            currRow[j - 1], // Insert
            prevRow[j], // Remove
            prevRow[j - 1] // Replace
          );
      }
    }

    // Update the previous row with the current row for the next iteration
    prevRow = [...currRow];
  }

  // The result is the value at the bottom-right corner of the matrix
  return currRow[n];
}

export function calculateColor(ratio: number) {
  // 0 => 0 red, 255 green, 0 blue
  // 0.5 => 255 red, 255 gree, 0 blue
  // 1 => 255 red, 0 green, 0 blue
  let red;
  let green;
  if (ratio <= 0.5) {
    green = 255;
    red = Math.max(255 * ratio * 2, 0);
  } else {
    green = Math.min(255 - (ratio - 0.5) * 2 * 255, 255);
    red = 255;
  }
  return `rgba(${red}, ${green}, 100, 0.5)`;
}

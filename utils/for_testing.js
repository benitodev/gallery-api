export const palindrome = (str) => {
  if (typeof str === "undefined") return;
  return str.split("").reverse().join("");
};

export const average = (arr) => {
  if (typeof arr === "undefined") return;
  if (arr.length === 0) return 0;
  let sum = 0;
  arr.forEach((n) => {
    {
      sum += n;
    }
  });

  return sum / arr.length;
};

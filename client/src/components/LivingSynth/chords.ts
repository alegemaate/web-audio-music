export const getChord = (transpose: number, chord: string): number[] => {
  const [key, type] = chord.split("-");

  if (!key || !type) {
    return [];
  }

  let nums: number[] = getChordType(type);
  let offset = getChordOffset(key);

  return nums.map((n) => n + 24 + transpose + offset);
};

const getChordOffset = (key: string) => {
  switch (key) {
    case "C":
      return 0;
    case "C#":
      return 1;
    case "D":
      return 2;
    case "D#":
      return 3;
    case "E":
      return 4;
    case "F":
      return 5;
    case "F#":
      return 6;
    case "G":
      return 7;
    case "G#":
      return 8;
    case "A":
      return 9;
    case "A#":
      return 10;
    case "B":
      return 11;
    case "B#":
      return 12;
    default:
      return 0;
  }
};

const getChordType = (type: string) => {
  switch (type) {
    case "M":
      return [0, 4, 7];
    case "m":
      return [0, 3, 7];
    case "dim":
      return [0, 3, 8];
    case "aug":
      return [0, 4, 8];
    case "M7":
      return [0, 4, 7, 11];
    case "m7":
      return [0, 3, 7, 10];
    case "dom7":
      return [0, 4, 7, 10];
    case "sus2":
      return [0, 2, 7];
    case "sus4":
      return [0, 5, 7];
    default:
      return [];
  }
};

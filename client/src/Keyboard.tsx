import React from "react";

const NOTE_NAMES = [
  "A",
  "A#",
  "B",
  "C",
  "C#",
  "D",
  "D#",
  "E",
  "F",
  "F#",
  "G",
  "G#",
];

const mtof = (midi: number) => {
  return Math.pow(2, (midi - 69) / 12) * 440;
};

const getNoteName = (note: number) => {
  const noteIndex = note % NOTE_NAMES.length;
  const noteOctave = Math.floor((note + 9) / NOTE_NAMES.length);
  return `${NOTE_NAMES[noteIndex]}${noteOctave}`;
};

export const Keyboard: React.FC<{ onClick: (note: number) => void }> = ({
  onClick,
}) => {
  // Generate key index
  const keys = [];
  for (var i = 1; i <= 88; i++) {
    keys.push(i);
  }

  return (
    <>
      {keys.map((key) => (
        <>
          <button
            style={{ width: "7.5%" }}
            key={key}
            onClick={() => onClick(mtof(key + 20))}
          >
            {getNoteName(key - 1)}
          </button>
          {key % NOTE_NAMES.length === 0 && <br />}
        </>
      ))}
    </>
  );
};

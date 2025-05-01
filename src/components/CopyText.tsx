"use client";
import React from "react";

type CopyTextProps = {
  text: string;
};
const CopyText: React.FC<CopyTextProps> = ({ text }) => {
  const onCopyClick = async () => {
    try {
      await navigator.clipboard.writeText(text);

      alert("Text copied to clipboard");
    } catch (error) {
      console.log("error", error);
    }
  };
  return (
    <p
      className="font-bold text-primary cursor-pointer"
      onClick={async () => await onCopyClick()}
    >
      Copy
    </p>
  );
};

export default CopyText;

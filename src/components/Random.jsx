import React from "react";

function Random({ setRandomList }) {

  const handleRandom = async () => {
    const res = await fetch("https://api.jikan.moe/v4/random/anime");
    const data = await res.json();
    setRandomList([data.data]);
  };

  return <button className="random-btn" onClick={handleRandom}>🎲 Random</button>;
}

export default Random ;
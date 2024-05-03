import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [pokemonNameLeft, setPokemonNameLeft] = useState('');
  const [pokemonNameRight, setPokemonNameRight] = useState('');
  const [pokemonDataLeft, setPokemonDataLeft] = useState(null);
  const [pokemonDataRight, setPokemonDataRight] = useState(null);
  const [opponents, setOpponents] = useState([]);
  const [moveNamesLeft, setMoveNamesLeft] = useState([]);
  const [moveNamesRight, setMoveNamesRight] = useState([]);
  const [hpLeft, setHpLeft] = useState(100); // เพิ่ม state สำหรับเก็บค่าเลือดของ Pokemon ในฝั่งซ้าย
  const [hpRight, setHpRight] = useState(100); // เพิ่ม state สำหรับเก็บค่าเลือดของ Pokemon ในฝั่งขวา
  
  

  useEffect(() => {
    generateOpponents();
  }, []);

  useEffect(() => {
    if (pokemonDataLeft) {
      fetchMoveNames(pokemonDataLeft.moves, setMoveNamesLeft);
      setHpLeft(pokemonDataLeft.stats[0].base_stat);
    }
    if (pokemonDataRight) {
      fetchMoveNames(pokemonDataRight.moves, setMoveNamesRight);
      setHpRight(pokemonDataRight.stats[0].base_stat);
    }
  }, [pokemonDataLeft, pokemonDataRight]);

  const generateOpponents = () => {
    const randomPokemonIds = Array.from({ length: 100 }, () => Math.floor(Math.random() * 898) + 1);
    setOpponents(randomPokemonIds);
  };

  const fetchPokemonData = async (pokemonId, side) => {
    try {
      const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonId}`);
      if (!response.ok) {
        throw new Error('Pokemon not found');
      }
      const data = await response.json();
      side === 'left' ? setPokemonDataLeft(data) : setPokemonDataRight(data);
      // Remove selected Pokemon from options
      setOpponents(opponents.filter(opponentId => opponentId !== parseInt(pokemonId)));
    } catch (error) {
      side === 'left' ? setErrorLeft('Pokemon not found') : setErrorRight('Pokemon not found');
    }
  };

  const handleChoosePokemon = (event, side) => {
    side === 'left' ? setPokemonNameLeft(event.target.value) : setPokemonNameRight(event.target.value);
  };

  const handleSubmit = async (event, side) => {
    event.preventDefault();
    const pokemonName = side === 'left' ? pokemonNameLeft : pokemonNameRight;
    if (pokemonName.trim() === '') {
      side === 'left' ? setErrorLeft('Please select a Pokemon to fight') : setErrorRight('Please select a Pokemon to fight');
      return;
    }
    await fetchPokemonData(pokemonName, side);
    // Set initial HP for the newly selected Pokemon
    const pokemonData = side === 'left' ? pokemonDataLeft : pokemonDataRight;
    side === 'left' ? setHpLeft(pokemonData.stats[0].base_stat) : setHpRight(pokemonData.stats[0].base_stat);
    // Remove bouncing class if exists
    const pokemonElement = document.querySelector(`.form-${side}-pokemon`);
    pokemonElement.classList.remove('bouncing');
    // Add bouncing class to make the Pokemon bounce
    pokemonElement.classList.add('bouncing');
  };
  

  const handleAnimationEnd = (event, side) => {
    const pokemonElement = document.querySelector(`.form-${side}-pokemon`);
    pokemonElement.classList.remove('bouncing');
  };

  const fetchMoveNames = async (moves, setMoveNames) => {
    try {
      const moveRequests = moves.slice(0, 4).map((move) => fetch(move.move.url).then((response) => response.json()));
      const moveData = await Promise.all(moveRequests);
      const names = moveData.map((move) => move.name);
      setMoveNames(names);
    } catch (error) {
      console.error('Error fetching move names:', error);
    }
  };

 
  const handleSkillClick = (moveName, side) => {
    console.log(`Skill "${moveName}" clicked on ${side} side`);
  
    // เลือก Pokemon ที่โจมตีและ Pokemon ที่ถูกโจมตี
    const attackingPokemon = side === 'left' ? pokemonDataLeft : pokemonDataRight;
    const defendingPokemon = side === 'left' ? pokemonDataRight : pokemonDataLeft;
  
    // คำนวณความเสียหาย
    const damage = calculateDamage(attackingPokemon.stats[1].base_stat, defendingPokemon.stats[2].base_stat);
  
    // ลดเลือดของ Pokemon ที่ถูกโจมตี
    if (side === 'left') {
      setHpRight((prevHp) => Math.max(prevHp - damage, 0)); // ตรวจสอบว่าเลือดไม่ต่ำกว่า 0
    } else {
      setHpLeft((prevHp) => Math.max(prevHp - damage, 0)); // ตรวจสอบว่าเลือดไม่ต่ำกว่า 0
    }
  };

  const calculateDamage = (attackerAttack, defenderDefense) => {
    // คำนวณความเสียหายโดยใช้สูตรง่าย ๆ
    const damage = attackerAttack - defenderDefense;
    // กำหนดให้ค่าความเสียหายไม่ต่ำกว่า 1
    return Math.max(damage, 1);
  };
  


  return (
    <div className="App">
      <img src="https://static.tcgcollector.com/content/images/cb/c3/47/cbc347a9237f3ac1a32199b5fa6bbcbb0014d6c0ac19b86d3781e9c59fdf118f.png" alt="Pokemon Logo" width="25%" />
      <div className="form-container">
        <form onSubmit={(event) => handleSubmit(event, 'left')} className="form-left">
          <h2>นักกีฬาฝั่งซ้าย:</h2>
          <label>
            <br></br>
            เลือกตัวละคร:
            <select value={pokemonNameLeft} onChange={(event) => handleChoosePokemon(event, 'left')}>
              <option value="">-- เลือกตัวละคร --</option>
              {opponents.map((opponentId, index) => (
                <option key={index} value={opponentId}>
                  Opponent {index + 1} (ID: {opponentId})
                </option>
              ))}
            </select>
          </label>
          <button type="submit">เลือก</button>
          <>{pokemonDataLeft && (
            <div className={`form-left-pokemon ${pokemonDataLeft ? 'bouncing' : ''}`} onAnimationEnd={(event) => handleAnimationEnd(event, 'left')}>
              <h2>{pokemonDataLeft.name}</h2>
              <br />
              <img src={pokemonDataLeft.sprites.other.showdown.front_default} alt={pokemonDataLeft.name} />
             <p>พลังโจมตี: {pokemonDataLeft.stats[1].base_stat}</p>&nbsp;
              <p>พลังป้องกัน: {pokemonDataLeft.stats[2].base_stat}</p>&nbsp;
              <p>ความเร็ว: {pokemonDataLeft.stats[5].base_stat}</p>&nbsp;
              <p>HP: {hpLeft}</p> 
              <p>{moveNamesLeft.map((moveName, index) => (
                <button key={index} className="random-name-button" onClick={() => handleSkillClick(moveName, 'left')}>
                  Skill: {moveName}
                </button>
              ))}</p>
            </div>
          )}</> 
        </form>
        <form onSubmit={(event) => handleSubmit(event, 'right')} className="form-right">
          <h2>นักกีฬาฝั่งขวา:</h2>
          <label>
            <br></br>
            เลือกตัวละคร:
            <select value={pokemonNameRight} onChange={(event) => handleChoosePokemon(event, 'right')}>
              <option value="">-- เลือกตัวละคร --</option>
              {opponents.map((opponentId, index) => (
                <option key={index} value={opponentId}>
                  Opponent {index + 1} (ID: {opponentId})
                </option>
              ))}
            </select>
          </label>
          <button type="submit">เลือก</button>
         <>{pokemonDataRight && (
            <div className={`form-right-pokemon ${pokemonDataRight ? 'bouncing' : ''}`} onAnimationEnd={(event) => handleAnimationEnd(event, 'right')}>
              <h2>{pokemonDataRight.name}</h2>
              <br />
              <img src={pokemonDataRight.sprites.other.showdown.front_default} alt={pokemonDataRight.name} />
              
              &nbsp; <p>พลังโจมตี: {pokemonDataRight.stats[1].base_stat}</p>&nbsp;
              <p>พลังป้องกัน: {pokemonDataRight.stats[2].base_stat}</p>&nbsp;
              <p>ความเร็ว: {pokemonDataRight.stats[5].base_stat}</p>&nbsp;
              <p>HP: {hpRight}</p>
              
              <>
              {moveNamesRight.map((moveName, index) => (
                <button key={index} className="random-name-button" onClick={() => handleSkillClick(moveName, 'right')}>
                  Skill: {moveName}
                </button>
              ))}</>
            </div>
          )}</> 
        </form>
      </div>
    </div>
  );
}

export default App;

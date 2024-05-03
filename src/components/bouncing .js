const handleSubmit = (event, side) => {
    event.preventDefault();
    const pokemonName = side === 'left' ? pokemonNameLeft : pokemonNameRight;
    if (pokemonName.trim() === '') {
      side === 'left' ? setErrorLeft('Please select a Pokemon to fight') : setErrorRight('Please select a Pokemon to fight');
      return;
    }
    fetchPokemonData(pokemonName, side);
    
    // เพิ่มคลาส bouncing เพื่อให้ตัวละครเด้ง
    const pokemonElement = document.querySelector(`.form-${side}-pokemon`);
    pokemonElement.classList.add('bouncing');
  };
  const handleAnimationEnd = (event, side) => {
    const pokemonElement = document.querySelector(`.form-${side}-pokemon`);
    pokemonElement.classList.remove('bouncing');
  };
  
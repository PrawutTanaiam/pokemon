import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

function Pokedex() {
  const { pokeName } = useParams(); 
  const [pokeDex, setPokemonDex] = useState(undefined);

  useEffect(() => {
    fetch(`https://pokeapi.co/api/v2/pokemon/${pokeName}`) 

    const fetchData= async()=>{
        let pokemonData = await fetchPokemon(pokeName);
        if (pokemonData != undefined){
            
        }


    }

    //   .then((res) => res.json())
    //   .then((data) => {
    //     console.log(data);
    //     setPokemonDex({
    //       name: data?.name,
    //       height: data?.height,
    //     });
    //   })
    //   .catch((err) => setPokemonDex(undefined));
  }, [pokeName]);

  return (
    <div>
      {pokeDex !== undefined ? (
        <>
          <b>name: {pokeDex?.name}</b> &nbsp;
          <b>height: {pokeDex?.height}</b>
        </>
      ) : (
        <>
          <b>Not found pokemon!!!</b>
        </>
      )}
    </div>
  );
}

export default Pokedex;

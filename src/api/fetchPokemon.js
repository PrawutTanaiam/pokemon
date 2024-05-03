import axios from "axios";

export async function fetchPokemon(pokeName){
try{
const Response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${pokeName}`);
return Response?.data
} catch(error){
    console.error(error);
}
}